import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import type { ContentLocale } from '@prisma/client';

export const menuRouter: Router = Router();

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Get complete navigation menu structure
 *     tags: [Menu]
 *     parameters:
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *           enum: [en-US, pt-BR]
 *         default: pt-BR
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Complete menu structure with categories and menu articles
 */
menuRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { locale = 'pt-BR', country } = req.query;
    const prismaLocale = locale === 'pt-BR' ? 'pt_BR' : locale === 'en-US' ? 'en_US' : 'Both';

    // Fetch all categories and menu articles in parallel for better performance
    const [categories, menuArticles] = await Promise.all([
      // Fetch all active categories with full hierarchy
      // Only fetch categories that should appear in navbar or footer
      prisma.category.findMany({
        where: {
          isActive: true,
          OR: [
            { showInNavbar: true },
            { showInFooter: true },
          ],
          ...(country ? {
            AND: [
              {
                OR: [
                  { country: country as any },
                  { country: null },
                ],
              },
            ],
          } : {}),
        },
        include: {
          parent: {
            include: {
              parent: true, // Support up to 3 levels
            },
          },
          children: {
            where: { isActive: true },
            orderBy: { order: 'asc' },
            include: {
              children: {
                where: { isActive: true },
                orderBy: { order: 'asc' },
              },
            },
          },
        },
        orderBy: [
          { order: 'asc' },
          { name: 'asc' },
        ],
      }),
      // Fetch articles that should appear in menu
      prisma.article.findMany({
        where: {
          showInMenu: true,
          robotsIndex: true,
          OR: [
            { locale: prismaLocale as ContentLocale },
            { locale: 'Both' },
          ],
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              slugEn: true,
              slugPt: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
        take: 50, // Limit to 50 menu articles for performance
      }),
    ]);

    // Format categories with localized data
    const formatCategory = (cat: any): any => {
      const currentSlug =
        (locale === 'pt-BR' && cat.slugPt) ? cat.slugPt :
        (locale === 'en-US' && cat.slugEn) ? cat.slugEn :
        cat.slug;

      const currentName =
        (locale === 'pt-BR' && cat.namePt) ? cat.namePt :
        (locale === 'en-US' && cat.nameEn) ? cat.nameEn :
        cat.name;

      return {
        id: cat.id,
        name: currentName,
        slug: currentSlug,
        slugEn: cat.slugEn || cat.slug,
        slugPt: cat.slugPt || cat.slug,
        level: cat.level,
        parentId: cat.parentId,
        order: cat.order || 0,
        icon: cat.icon,
        showInNavbar: cat.showInNavbar || false,
        showInFooter: cat.showInFooter || false,
        children: cat.children ? cat.children.map(formatCategory) : [],
      };
    };

    const formattedCategories = categories.map(formatCategory);

    // Build category paths for quick lookup
    const buildCategoryPath = (categoryId: string, allCats: any[]): string[] => {
      const path: string[] = [];
      let current = allCats.find((c) => c.id === categoryId);

      while (current) {
        const slug =
          (locale === 'pt-BR' && current.slugPt) ? current.slugPt :
          (locale === 'en-US' && current.slugEn) ? current.slugEn :
          current.slug;
        path.unshift(slug);

        if (current.parentId) {
          current = allCats.find((c) => c.id === current.parentId);
        } else {
          break;
        }
      }

      return path;
    };

    // Format menu articles with full paths
    const formattedMenuArticles = menuArticles.map((article: any) => {
      const currentSlug =
        (locale === 'pt-BR' && article.slugPt) ? article.slugPt :
        (locale === 'en-US' && article.slugEn) ? article.slugEn :
        article.slug;

      let fullPath = '';
      if (article.category) {
        const categoryPath = buildCategoryPath(article.category.id, categories);
        fullPath = categoryPath.length > 0
          ? `/${categoryPath.join('/')}/${currentSlug}`
          : `/${currentSlug}`;
      } else {
        fullPath = `/${currentSlug}`;
      }

      return {
        id: article.id,
        title: article.title,
        titleMenu: article.titleMenu || article.title,
        slug: currentSlug,
        fullPath,
        category: article.category ? {
          id: article.category.id,
          name: article.category.name,
          slug: article.category.slug,
        } : null,
      };
    });

    // Organize menu by root categories - get all root categories that should appear in navbar
    const rootCategories = formattedCategories
      .filter((cat) => cat.level === 0 && cat.showInNavbar)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    // Get all category IDs (including children) for a given root category
    const getAllCategoryIds = (parentId: string | null, allCats: any[]): string[] => {
      if (!parentId) return [];
      const ids = [parentId];
      const children = allCats.filter((cat) => cat.parentId === parentId);
      children.forEach((child) => {
        ids.push(child.id);
        ids.push(...getAllCategoryIds(child.id, allCats));
      });
      return ids;
    };

    // Build items for each menu section (only showInNavbar items)
    const buildMenuItems = (parentId: string | null, level: number = 1): any[] => {
      return formattedCategories
        .filter((cat) => cat.parentId === parentId && cat.level === level && cat.showInNavbar)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((cat) => ({
          ...cat,
          children: buildMenuItems(cat.id, level + 1),
        }));
    };

    // Build footer items (only showInFooter items)
    const buildFooterItems = (parentId: string | null, level: number = 1): any[] => {
      return formattedCategories
        .filter((cat) => cat.parentId === parentId && cat.level === level && cat.showInFooter)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((cat) => ({
          ...cat,
          children: buildFooterItems(cat.id, level + 1),
        }));
    };

    // Build dynamic menu structure from root categories
    const menuItems = rootCategories.map((rootCategory) => {
      const categoryIds = getAllCategoryIds(rootCategory.id, formattedCategories);
      const menuArticles = formattedMenuArticles.filter((article: any) => {
        return article.category && categoryIds.includes(article.category.id);
      });

      return {
        root: rootCategory,
        items: buildMenuItems(rootCategory.id, 1),
        menuArticles: menuArticles.length > 0 ? menuArticles : undefined,
      };
    });

    // Build legacy structure for backward compatibility (can be removed later)
    const insuranceRoot = rootCategories.find((cat) =>
      (locale === 'pt-BR' && cat.slug === 'seguros') ||
      (locale === 'en-US' && cat.slug === 'insurance') ||
      cat.slug === 'insurance' || cat.slug === 'seguros'
    );
    const comparisonRoot = rootCategories.find((cat) =>
      (locale === 'pt-BR' && cat.slug === 'comparador') ||
      (locale === 'en-US' && cat.slug === 'comparisons') ||
      cat.slug === 'comparisons' || cat.slug === 'comparador'
    );
    const guidesRoot = rootCategories.find((cat) =>
      (locale === 'pt-BR' && cat.slug === 'guias') ||
      (locale === 'en-US' && cat.slug === 'guides') ||
      cat.slug === 'guides' || cat.slug === 'guias'
    );
    const blogRoot = rootCategories.find((cat) =>
      cat.slug === 'blog' || cat.slug === 'blog'
    );

    // Legacy structure for backward compatibility
    const menuStructure: any = {
      items: menuItems, // New dynamic structure
      // Legacy structure (for backward compatibility)
      insurance: {
        root: insuranceRoot,
        items: insuranceRoot ? buildMenuItems(insuranceRoot.id, 1) : [],
        menuArticles: insuranceRoot
          ? formattedMenuArticles.filter((article: any) => {
              const categoryIds = getAllCategoryIds(insuranceRoot.id, formattedCategories);
              return article.category && categoryIds.includes(article.category.id);
            })
          : [],
      },
      comparison: {
        root: comparisonRoot,
        items: comparisonRoot ? buildMenuItems(comparisonRoot.id, 1) : [],
      },
      guides: {
        root: guidesRoot,
        items: guidesRoot ? buildMenuItems(guidesRoot.id, 1) : [],
        menuArticles: guidesRoot
          ? formattedMenuArticles.filter((article: any) => {
              const categoryIds = getAllCategoryIds(guidesRoot.id, formattedCategories);
              return article.category && categoryIds.includes(article.category.id);
            })
          : [],
      },
      blog: {
        root: blogRoot,
        items: blogRoot ? buildMenuItems(blogRoot.id, 1) : [],
      },
    };

    // Set aggressive cache headers for performance
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('Vary', 'Accept-Language');

    res.json({
      locale,
      menu: menuStructure,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

