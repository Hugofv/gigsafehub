import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { config } from '../config';

export const seoRouter: Router = Router();

const BASE_URL = config.baseUrl;

/**
 * @swagger
 * /sitemap.xml:
 *   get:
 *     summary: Generate sitemap.xml for SEO
 *     tags: [SEO]
 *     responses:
 *       200:
 *         description: XML sitemap
 *         content:
 *           application/xml:
 */
seoRouter.get('/sitemap.xml', async (req: Request, res: Response) => {
  try {
    const products = await prisma.financialProduct.findMany({
      where: {
        robotsIndex: true,
      },
      select: {
        slug: true,
        lastModified: true,
        sitemapPriority: true,
        sitemapChangefreq: true,
        updatedAt: true,
      },
    });

    // Load categories to build full paths for category and article URLs
    // We load all categories (including inactive) to ensure historical URLs
    // for articles remain correct even if a category is later hidden from the UI.
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        parentId: true,
        slug: true,
        slugEn: true,
        slugPt: true,
      },
    });

    const articles = await prisma.article.findMany({
      where: {
        robotsIndex: true,
      },
      include: {
        category: {
          select: {
            id: true,
            parentId: true,
            slug: true,
            slugEn: true,
            slugPt: true,
          },
        },
      },
    });

    const urls: string[] = [];

    // Helper to build localized category path from a categoryId
    const buildCategoryPath = (categoryId: string, allCats: any[], locale: 'pt-BR' | 'en-US'): string[] => {
      const path: string[] = [];
      let current = allCats.find((c) => c.id === categoryId);

      while (current) {
        const slug =
          locale === 'pt-BR' && current.slugPt
            ? current.slugPt
            : locale === 'en-US' && current.slugEn
            ? current.slugEn
            : current.slug;

        path.unshift(slug);

        if (current.parentId) {
          current = allCats.find((c) => c.id === current.parentId);
        } else {
          current = undefined;
        }
      }

      return path;
    };

    // Static pages (localized home, listings, legal pages, about)
    urls.push(
      // Home
      `<url><loc>${BASE_URL}/en-US</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
      `<url><loc>${BASE_URL}/pt-BR</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
      // Reviews listing
      `<url><loc>${BASE_URL}/en-US/reviews</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`,
      `<url><loc>${BASE_URL}/pt-BR/reviews</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`,
      // Articles listing
      `<url><loc>${BASE_URL}/en-US/articles</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
      `<url><loc>${BASE_URL}/pt-BR/articles</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
      // Legal pages - Privacy Policy
      `<url><loc>${BASE_URL}/en-US/privacy-and-policies</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
      `<url><loc>${BASE_URL}/pt-BR/politicas-e-privacidade</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
      // Legal pages - Terms of Use
      `<url><loc>${BASE_URL}/en-US/terms-of-use</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
      `<url><loc>${BASE_URL}/pt-BR/termos-de-uso</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
      // About pages
      `<url><loc>${BASE_URL}/en-US/about</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
      `<url><loc>${BASE_URL}/pt-BR/sobre-nos</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`
    );

    // Category pages (all active categories with localized slugs)
    (['en-US', 'pt-BR'] as const).forEach((locale) => {
      categories.forEach((category) => {
        const pathSegments = buildCategoryPath(category.id, categories, locale);
        if (pathSegments.length === 0) {
          return;
        }
        const locUrl = `${BASE_URL}/${locale}/${pathSegments.join('/')}`;
        urls.push(
          `<url><loc>${locUrl}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`
        );
      });
    });

    // Products
    products.forEach((product) => {
      const lastmod = product.lastModified || product.updatedAt;
      const priority = product.sitemapPriority || 0.8;
      const changefreq = product.sitemapChangefreq || 'weekly';

      urls.push(
        `<url><loc>${BASE_URL}/en-US/reviews/${product.slug}</loc><lastmod>${lastmod.toISOString()}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`,
        `<url><loc>${BASE_URL}/pt-BR/reviews/${product.slug}</loc><lastmod>${lastmod.toISOString()}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
      );
    });

    // Articles (use localized slugs and full category path when available)
    articles.forEach((article) => {
      const lastmod = article.lastModified || article.updatedAt;
      const priority = article.sitemapPriority || 0.9;
      const changefreq = article.sitemapChangefreq || 'monthly';

      const targetLocales: Array<'en-US' | 'pt-BR'> =
        article.locale === 'Both'
          ? ['en-US', 'pt-BR']
          : article.locale === 'pt_BR'
          ? ['pt-BR']
          : ['en-US'];

      targetLocales.forEach((locale) => {
        const localizedSlug =
          locale === 'pt-BR' && article.slugPt
            ? article.slugPt
            : locale === 'en-US' && article.slugEn
            ? article.slugEn
            : article.slug;

        let path = `${BASE_URL}/${locale}`;

        // Prefer category from relation (article.category) when present,
        // otherwise fall back to raw categoryId.
        const categoryIdFromRelation = article.category?.id;
        const categoryId =
          (typeof categoryIdFromRelation === 'string' && categoryIdFromRelation) ||
          (typeof article.categoryId === 'string' && article.categoryId) ||
          null;

        const categoryPathSegments =
          categoryId !== null ? buildCategoryPath(categoryId, categories, locale) : [];

        if (categoryPathSegments.length > 0) {
          // Category found and active: use full category path
          path += `/${categoryPathSegments.join('/')}`;
        } else {
          // Fallback to /articles when no active category is associated
          path += '/articles';
        }

        const url = `${path}/${localizedSlug}`;

        urls.push(
          `<url><loc>${url}</loc><lastmod>${lastmod.toISOString()}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
        );
      });
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

/**
 * @swagger
 * /robots.txt:
 *   get:
 *     summary: Generate robots.txt for SEO
 *     tags: [SEO]
 *     responses:
 *       200:
 *         description: robots.txt content
 *         content:
 *           text/plain:
 */
seoRouter.get('/robots.txt', (req: Request, res: Response) => {
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /docs/
Disallow: /_next/

Sitemap: ${BASE_URL}/sitemap.xml`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
  res.send(robots);
});

/**
 * @swagger
 * /api/seo/meta:
 *   get:
 *     summary: Get SEO meta tags for a page
 *     tags: [SEO]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [product, article]
 *       - in: query
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *           default: en-US
 *     responses:
 *       200:
 *         description: SEO meta tags
 */
seoRouter.get('/meta', async (req: Request, res: Response) => {
  try {
    const { type, slug, locale = 'en-US' } = req.query;

    if (!type || !slug) {
      return res.status(400).json({ error: 'Type and slug are required' });
    }

    // Validate and convert query parameters to strings
    const typeStr = Array.isArray(type) ? type[0] : type;
    const slugStr = Array.isArray(slug) ? slug[0] : slug;
    const localeStr = Array.isArray(locale) ? locale[0] : locale;

    if (typeof typeStr !== 'string' || typeof slugStr !== 'string' || typeof localeStr !== 'string') {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    let metaData: any = {};

    if (typeStr === 'product') {
      const product = await prisma.financialProduct.findUnique({
        where: { slug: slugStr },
        select: {
          name: true,
          description: true,
          logoUrl: true,
          logoAlt: true,
          metaTitle: true,
          metaDescription: true,
          metaKeywords: true,
          ogTitle: true,
          ogDescription: true,
          ogImage: true,
          canonicalUrl: true,
          structuredData: true,
        },
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      metaData = {
        title: product.metaTitle || `${product.name} - GigSafeHub Review`,
        description: product.metaDescription || product.description.substring(0, 160),
        keywords: product.metaKeywords || `${product.name}, review, comparison, gig economy`,
        ogTitle: product.ogTitle || product.metaTitle || product.name,
        ogDescription: product.ogDescription || product.metaDescription || product.description.substring(0, 200),
        ogImage: product.ogImage || product.logoUrl,
        ogType: 'product',
        canonicalUrl: product.canonicalUrl || `${BASE_URL}/${localeStr}/reviews/${slugStr}`,
        structuredData: product.structuredData ? JSON.parse(product.structuredData) : generateProductStructuredData(product, localeStr),
      };
    } else if (typeStr === 'article') {
      const article = await prisma.article.findUnique({
        where: { slug: slugStr },
        select: {
          title: true,
          excerpt: true,
          imageUrl: true,
          imageAlt: true,
          date: true,
          metaTitle: true,
          metaDescription: true,
          metaKeywords: true,
          ogTitle: true,
          ogDescription: true,
          ogImage: true,
          canonicalUrl: true,
          structuredData: true,
          readingTime: true,
        },
      });

      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      metaData = {
        title: article.metaTitle || `${article.title} - GigSafeHub`,
        description: article.metaDescription || article.excerpt.substring(0, 160),
        keywords: article.metaKeywords || 'gig economy, freelancer, insurance, financial advice',
        ogTitle: article.ogTitle || article.metaTitle || article.title,
        ogDescription: article.ogDescription || article.metaDescription || article.excerpt.substring(0, 200),
        ogImage: article.ogImage || article.imageUrl,
        ogType: 'article',
        canonicalUrl: article.canonicalUrl || `${BASE_URL}/${localeStr}/articles/${slugStr}`,
        structuredData: article.structuredData ? JSON.parse(article.structuredData) : generateArticleStructuredData(article, localeStr),
        publishedTime: article.date.toISOString(),
        readingTime: article.readingTime,
      };
    }

    res.json(metaData);
  } catch (error) {
    console.error('Error fetching SEO meta:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function generateProductStructuredData(product: any, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.logoUrl,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
    },
    offers: {
      '@type': 'Offer',
      price: product.fees,
      priceCurrency: 'USD',
    },
  };
}

function generateArticleStructuredData(article: any, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl,
    datePublished: article.date.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'GigSafeHub',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GigSafeHub',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    ...(article.readingTime && {
      timeRequired: `PT${article.readingTime}M`,
    }),
  };
}

