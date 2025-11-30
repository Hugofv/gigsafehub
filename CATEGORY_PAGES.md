# Category Pages System

## Overview

The category pages system automatically generates pages for all categories and subcategories based on their hierarchical slug paths. This system is fully dynamic and SEO-optimized.

## How It Works

### 1. Route Structure

All category pages are handled by the catch-all route:
```
apps/web/src/app/[locale]/[...slug]/page.tsx
```

This route matches any path like:
- `/pt-BR/seguros` (Insurance)
- `/pt-BR/seguros/seguros-para-motoristas` (Insurance for Drivers)
- `/pt-BR/seguros/seguros-para-motoristas/uber` (Uber Insurance)
- `/en-US/insurance/insurance-for-drivers/uber`

### 2. Page Generation Flow

1. **URL Parsing**: The slug array is joined to create the full path (e.g., `seguros/seguros-para-motoristas/uber`)
2. **Category Lookup**: The system fetches the category by its hierarchical slug path from the API
3. **Breadcrumbs**: Builds breadcrumb navigation by traversing parent categories
4. **Content Detection**: Determines if the category should show products, articles, guides, or comparisons
5. **Content Fetching**: Fetches the appropriate content (products/articles) filtered by category
6. **Rendering**: Renders the page with SEO metadata, breadcrumbs, subcategories, and content

### 3. SEO Features

- **Dynamic Metadata**: Each category page has its own title, description, and Open Graph tags
- **Breadcrumbs**: Structured navigation for better UX and SEO
- **Canonical URLs**: Prevents duplicate content issues
- **Structured Data**: Ready for schema.org markup (can be extended)

### 4. Content Types

The system automatically detects content type based on:

- **Blog Categories**: Shows articles if category name includes "blog" or has more articles than products
- **Guide Categories**: Shows guides if category name includes "guide" or has guides count > 0
- **Comparison Categories**: Shows comparisons if category name includes "compar" or has comparisons count > 0
- **Product Categories**: Default behavior - shows products filtered by category

### 5. Components

#### `CategoryPage` (Server Component)
- Fetches category data and content
- Generates SEO metadata
- Builds breadcrumbs
- Determines content type

#### `CategoryPageClient` (Client Component)
- Renders the UI with:
  - Breadcrumb navigation
  - Category header with description
  - Subcategories grid
  - Products/Articles grid
  - Compare functionality
  - Empty states

## Usage Examples

### Accessing Category Pages

1. **Main Category**:
   ```
   /pt-BR/seguros
   ```

2. **Subcategory**:
   ```
   /pt-BR/seguros/seguros-para-motoristas
   ```

3. **Deep Subcategory**:
   ```
   /pt-BR/seguros/seguros-para-motoristas/uber
   ```

### Creating New Categories

Categories are created in the database via Prisma. The system automatically:
- Generates pages for all categories
- Handles hierarchical slugs
- Supports multiple locales
- Updates when categories change

### API Endpoints Used

- `GET /api/categories/:slugPath` - Fetch category by slug path
- `GET /api/products?categoryId=...` - Fetch products by category
- `GET /api/articles?categoryId=...` - Fetch articles by category
- `GET /api/categories` - Fetch all categories (for breadcrumbs)

## Customization

### Adding New Content Types

To add support for a new content type (e.g., "Guides"):

1. Update `CategoryPage` to detect the new type
2. Fetch the content in the server component
3. Pass it to `CategoryPageClient`
4. Add rendering logic in the client component

### Styling

The page uses Tailwind CSS classes. Key sections:
- Header: Gradient background with category info
- Breadcrumbs: White background with navigation
- Subcategories: Grid of category cards
- Content: Responsive grid of products/articles

## SEO Best Practices

1. **Unique Titles**: Each category has its own meta title
2. **Descriptions**: Category descriptions are used for meta descriptions
3. **Breadcrumbs**: Help search engines understand site structure
4. **Canonical URLs**: Prevent duplicate content
5. **Structured Data**: Can be extended with JSON-LD

## Future Enhancements

- [ ] Add JSON-LD structured data
- [ ] Implement pagination for large category pages
- [ ] Add filtering and sorting options
- [ ] Implement category-specific layouts
- [ ] Add related categories section
- [ ] Implement category search

