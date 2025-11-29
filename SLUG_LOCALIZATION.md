# Slug Localization for SEO

## Overview

Slugs are now localized to improve SEO for different languages. Each product and article can have separate slugs for English (`slugEn`) and Portuguese (`slugPt`), in addition to a default `slug` for backward compatibility.

## Database Schema Changes

### FinancialProduct
- `slug` - Default/English slug (for backward compatibility)
- `slugEn` - English-specific slug (optional, unique)
- `slugPt` - Portuguese-specific slug (optional, unique)

### Article
- `slug` - Default/English slug (for backward compatibility)
- `slugEn` - English-specific slug (optional, unique)
- `slugPt` - Portuguese-specific slug (optional, unique)

## URL Structure

### Products
- English: `/en-US/reviews/gigbank-pro`
- Portuguese: `/pt-BR/reviews/gigbank-pro-brasil`

### Articles
- English: `/en-US/articles/hiscox-vs-next-insurance`
- Portuguese: `/pt-BR/articles/hiscox-vs-next-seguro`

## API Endpoints

### GET /api/products/:identifier?locale={locale}
- Supports ID, default slug, or localized slug
- Returns the appropriate slug based on locale
- Falls back to default slug if localized slug not found

### GET /api/articles/:identifier?locale={locale}
- Supports default slug or localized slug
- Returns the appropriate slug based on locale
- Falls back to default slug if localized slug not found

## Benefits for SEO

1. **Language-Specific URLs**: URLs match the content language
2. **Better Indexing**: Search engines can better understand language-specific content
3. **Improved Rankings**: Localized slugs help with regional search rankings
4. **User Experience**: Users see URLs in their language
5. **Canonical URLs**: Proper canonical tags prevent duplicate content issues

## Migration Steps

1. **Run Migration**:
   ```bash
   cd apps/api
   pnpm prisma migrate dev --name add_localized_slugs
   ```

2. **Update Seed Data**:
   - Add `slugEn` and `slugPt` to existing products/articles
   - Generate slugs from product/article names in respective languages

3. **Update Existing Content**:
   - Generate Portuguese slugs for existing products
   - Ensure all new content has both slugs

## Slug Generation

Use the `generateSlug` utility function:

```typescript
import { generateSlug } from '@/lib/slug';

const slugEn = generateSlug('GigBank Pro', 'en-US');
// Result: 'gigbank-pro'

const slugPt = generateSlug('GigBank Pro Brasil', 'pt-BR');
// Result: 'gigbank-pro-brasil'
```

## Best Practices

1. **Always provide both slugs** when creating new content
2. **Use descriptive slugs** that match the content title
3. **Keep slugs short** but meaningful (50-60 characters max)
4. **Use hyphens** to separate words
5. **Avoid special characters** except hyphens
6. **Maintain consistency** between slug and title language

## Example

```typescript
// Product creation
const product = await prisma.financialProduct.create({
  data: {
    name: 'GigBank Pro',
    slug: 'gigbank-pro', // Default/English
    slugEn: 'gigbank-pro', // English
    slugPt: 'gigbank-pro-brasil', // Portuguese
    // ... other fields
  }
});
```

## Frontend Usage

The frontend automatically uses the correct slug based on the current locale:

```typescript
// ProductCard component
const slug = getLocalizedSlug(
  product.slug,
  product.slugEn,
  product.slugPt,
  locale
);

<Link href={`/${locale}/reviews/${slug}`}>
  View Details
</Link>
```

## Redirects

If a user accesses a product with the wrong locale slug, the system will:
1. Try to find the product by the provided slug
2. If found, return the product with the correct localized slug
3. Optionally redirect to the correct URL (can be implemented in middleware)

