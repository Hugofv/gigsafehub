# SEO Configuration Guide

This document outlines the SEO features implemented in the GigSafeHub API.

## Database Schema SEO Fields

### FinancialProduct
- `slug` - SEO-friendly URL identifier (unique, indexed)
- `metaTitle` - Custom meta title (overrides default)
- `metaDescription` - Meta description (160 chars recommended)
- `metaKeywords` - Comma-separated keywords
- `ogTitle` - Open Graph title
- `ogDescription` - Open Graph description
- `ogImage` - Open Graph image URL
- `canonicalUrl` - Canonical URL to prevent duplicate content
- `structuredData` - JSON-LD structured data (JSON string)
- `lastModified` - Last modification date for sitemap
- `sitemapPriority` - Sitemap priority (0.0-1.0, default: 0.8)
- `sitemapChangefreq` - Change frequency (daily, weekly, monthly, etc.)
- `robotsIndex` - Allow search engines to index (default: true)
- `robotsFollow` - Allow search engines to follow links (default: true)
- `logoAlt` - Alt text for logo image (accessibility + SEO)

### Article
- All the same SEO fields as FinancialProduct
- `readingTime` - Estimated reading time in minutes
- `imageAlt` - Alt text for article image

## API Endpoints

### SEO Endpoints

#### `GET /sitemap.xml`
Generates a dynamic XML sitemap including:
- Static pages (home, reviews, articles)
- All indexable products (with locale variants)
- All indexable articles (with locale variants)
- Last modified dates
- Change frequencies
- Priorities

**Cache**: 1 hour (public cache)

#### `GET /robots.txt`
Generates robots.txt with:
- Allow rules for public content
- Disallow rules for admin, API, and docs
- Sitemap location

**Cache**: 24 hours (public cache)

#### `GET /api/seo/meta?type={product|article}&slug={slug}&locale={locale}`
Returns SEO meta tags for a specific page:
- Meta title, description, keywords
- Open Graph tags
- Canonical URL
- Structured data (JSON-LD)

### Content Endpoints with SEO

All content endpoints now include:
- SEO metadata fields
- Cache headers (1 hour for public content)
- Last-Modified headers
- X-Robots-Tag headers (for non-indexable content)
- Proper content-type headers

#### `GET /api/products`
- Only returns indexable products (`robotsIndex: true`)
- Includes slug for SEO-friendly URLs
- Cache: 1 hour

#### `GET /api/products/:id`
- Supports both ID and slug lookup
- Returns full SEO metadata
- Sets X-Robots-Tag if not indexable
- Cache: 1 hour

#### `GET /api/articles`
- Filters by locale
- Only returns indexable articles
- Includes SEO fields
- Cache: 1 hour

#### `GET /api/articles/:slug`
- Returns full SEO metadata
- Includes structured data
- Cache: 1 hour

## Structured Data (Schema.org)

The API automatically generates JSON-LD structured data:

### Product Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "...",
  "image": "...",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.5,
    "reviewCount": 100
  },
  "offers": {
    "@type": "Offer",
    "price": "$0/mo",
    "priceCurrency": "USD"
  }
}
```

### Article Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "...",
  "image": "...",
  "datePublished": "2024-01-01T00:00:00Z",
  "author": {
    "@type": "Organization",
    "name": "GigSafeHub"
  },
  "publisher": {
    "@type": "Organization",
    "name": "GigSafeHub"
  }
}
```

## Best Practices

### 1. Slug Generation
- Use lowercase
- Replace spaces with hyphens
- Remove special characters
- Keep under 100 characters
- Make them descriptive and keyword-rich

### 2. Meta Descriptions
- Keep under 160 characters
- Include primary keyword
- Make them compelling (CTR optimization)
- Unique for each page

### 3. Meta Titles
- Keep under 60 characters
- Include primary keyword at the beginning
- Include brand name
- Unique for each page

### 4. Images
- Always provide alt text
- Use descriptive filenames
- Optimize file sizes
- Use appropriate formats (WebP when possible)

### 5. Canonical URLs
- Set for all pages to prevent duplicate content
- Use absolute URLs
- Point to the preferred version

### 6. Structured Data
- Validate using Google's Rich Results Test
- Keep it accurate and up-to-date
- Don't mark up hidden content

### 7. Sitemap
- Update priorities based on importance
- Set appropriate change frequencies
- Include all indexable content
- Submit to Google Search Console

## Environment Variables

```env
BASE_URL=https://gigsafehub.com  # Used for canonical URLs and sitemap
```

## Testing SEO

1. **Validate Structured Data**: Use [Google Rich Results Test](https://search.google.com/test/rich-results)
2. **Check Sitemap**: Visit `/sitemap.xml` and validate format
3. **Check Robots**: Visit `/robots.txt`
4. **Test Meta Tags**: Use `/api/seo/meta?type=product&slug=example`
5. **Validate URLs**: Ensure all slugs are SEO-friendly

## Migration Notes

After updating the schema, run:

```bash
pnpm prisma:migrate
pnpm prisma:generate
```

Update existing records to include:
- Slugs (generate from names)
- Meta descriptions (from descriptions)
- Last modified dates
- Sitemap priorities

