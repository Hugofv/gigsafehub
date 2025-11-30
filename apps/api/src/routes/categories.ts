import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const categoriesRouter: Router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories (hierarchical)
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *       - in: query
 *         name: level
 *         schema:
 *           type: integer
 *       - in: query
 *         name: parentId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of categories
 */
categoriesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { locale = 'en-US', country } = req.query;

    // Always fetch all active categories with full hierarchy
    const where: any = {
      isActive: true,
    };

    if (country) {
      where.OR = [
        { country: country as string },
        { country: null }, // Categories that apply to all countries
      ];
    }

    // Fetch all categories with their relationships
    const categories = await prisma.category.findMany({
      where,
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
        _count: {
          select: {
            products: true,
            articles: true,
          },
        },
      },
      orderBy: [
        { order: 'asc' },
        { name: 'asc' },
      ],
    });

    const formattedCategories = categories.map((cat: any) => {
      const currentSlug =
        (locale === 'pt-BR' && cat.slugPt) ? cat.slugPt :
        (locale === 'en-US' && cat.slugEn) ? cat.slugEn :
        cat.slug;

      const currentName =
        (locale === 'pt-BR' && cat.namePt) ? cat.namePt :
        (locale === 'en-US' && cat.nameEn) ? cat.nameEn :
        cat.name;

      const currentDescription =
        (locale === 'pt-BR' && cat.descriptionPt) ? cat.descriptionPt :
        (locale === 'en-US' && cat.descriptionEn) ? cat.descriptionEn :
        cat.description;

      return {
        id: cat.id,
        name: currentName,
        nameEn: cat.nameEn || cat.name,
        namePt: cat.namePt || cat.name,
        slug: currentSlug,
        slugEn: cat.slugEn || cat.slug,
        slugPt: cat.slugPt || cat.slug,
        description: currentDescription,
        level: cat.level,
        parentId: cat.parentId,
        parent: cat.parent ? {
          id: cat.parent.id,
          name: cat.parent.name,
          slug: cat.parent.slug,
        } : null,
        order: cat.order,
        country: cat.country,
        icon: cat.icon,
        children: cat.children ? cat.children.map((child: any) => {
          const childSlug =
            (locale === 'pt-BR' && child.slugPt) ? child.slugPt :
            (locale === 'en-US' && child.slugEn) ? child.slugEn :
            child.slug;

          const childName =
            (locale === 'pt-BR' && child.namePt) ? child.namePt :
            (locale === 'en-US' && child.nameEn) ? child.nameEn :
            child.name;

          return {
            id: child.id,
            name: childName,
            nameEn: child.nameEn || child.name,
            namePt: child.namePt || child.name,
            slug: childSlug,
            slugEn: child.slugEn || child.slug,
            slugPt: child.slugPt || child.slug,
            level: child.level,
            parentId: child.parentId,
            order: child.order,
            children: child.children ? child.children.map((grandchild: any) => ({
              id: grandchild.id,
              name: (locale === 'pt-BR' && grandchild.namePt) ? grandchild.namePt :
                    (locale === 'en-US' && grandchild.nameEn) ? grandchild.nameEn :
                    grandchild.name,
              slug: (locale === 'pt-BR' && grandchild.slugPt) ? grandchild.slugPt :
                    (locale === 'en-US' && grandchild.slugEn) ? grandchild.slugEn :
                    grandchild.slug,
              level: grandchild.level,
              parentId: grandchild.parentId,
              order: grandchild.order,
            })) : [],
          };
        }) : [],
        metaTitle: cat.metaTitle,
        metaDescription: cat.metaDescription,
        counts: {
          products: cat._count.products,
          articles: cat._count.articles,
        },
      };
    });

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/categories/{slug}:
 *   get:
 *     summary: Get category by slug (supports hierarchical slugs)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Can be a single slug or hierarchical path (e.g., "seguros-para-motoristas/uber")
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
categoriesRouter.get('/:slugPath(*)', async (req: Request, res: Response) => {
  try {
    const slugPath = req.params.slugPath as string;
    const { locale = 'en-US' } = req.query;

    // Split hierarchical slug path (e.g., "seguros-para-motoristas/uber")
    const slugParts = slugPath.split('/').filter(Boolean);

    if (slugParts.length === 0) {
      return res.status(400).json({ error: 'Invalid slug path' });
    }

    // Start with the last slug (most specific)
    let currentSlug = slugParts[slugParts.length - 1];
    let category = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: currentSlug },
          ...(locale === 'pt-BR' ? [{ slugPt: currentSlug }] : []),
          ...(locale === 'en-US' ? [{ slugEn: currentSlug }] : []),
        ],
        isActive: true,
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
        },
        _count: {
          select: {
            products: true,
            articles: true,
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Verify the hierarchical path matches
    if (slugParts.length > 1) {
      let current: typeof category = category;
      const path: Array<typeof category> = [current];

      while (current.parent) {
        path.unshift(current.parent as typeof category);
        current = current.parent as typeof category;
      }

      // Check if the path matches
      if (path.length !== slugParts.length) {
        return res.status(404).json({ error: 'Category path mismatch' });
      }

      for (let i = 0; i < slugParts.length; i++) {
        const expectedSlug = (locale === 'pt-BR' && path[i].slugPt) ? path[i].slugPt :
                             (locale === 'en-US' && path[i].slugEn) ? path[i].slugEn :
                             path[i].slug;

        if (expectedSlug !== slugParts[i]) {
          return res.status(404).json({ error: 'Category path mismatch' });
        }
      }
    }

    const currentSlugFormatted =
      (locale === 'pt-BR' && category.slugPt) ? category.slugPt :
      (locale === 'en-US' && category.slugEn) ? category.slugEn :
      category.slug;

    const currentName =
      (locale === 'pt-BR' && category.namePt) ? category.namePt :
      (locale === 'en-US' && category.nameEn) ? category.nameEn :
      category.name;

    const currentDescription =
      (locale === 'pt-BR' && category.descriptionPt) ? category.descriptionPt :
      (locale === 'en-US' && category.descriptionEn) ? category.descriptionEn :
      category.description;

    // Build full path
    const fullPath: string[] = [];
    let parent: typeof category.parent = category.parent;
    while (parent) {
      const parentSlug = (locale === 'pt-BR' && parent.slugPt) ? parent.slugPt :
                        (locale === 'en-US' && parent.slugEn) ? parent.slugEn :
                        parent.slug;
      fullPath.unshift(parentSlug);
      parent = (parent as any).parent;
    }
    fullPath.push(currentSlugFormatted);

    const formattedCategory = {
      id: category.id,
      name: currentName,
      nameEn: category.nameEn || category.name,
      namePt: category.namePt || category.name,
      slug: currentSlugFormatted,
      slugEn: category.slugEn || category.slug,
      slugPt: category.slugPt || category.slug,
      fullPath: fullPath.join('/'),
      description: currentDescription,
      level: category.level,
      parentId: category.parentId,
      parent: category.parent ? {
        id: category.parent.id,
        name: category.parent.name,
        slug: (locale === 'pt-BR' && category.parent.slugPt) ? category.parent.slugPt :
              (locale === 'en-US' && category.parent.slugEn) ? category.parent.slugEn :
              category.parent.slug,
      } : null,
      children: category.children.map((child: any) => ({
        id: child.id,
        name: (locale === 'pt-BR' && child.namePt) ? child.namePt :
              (locale === 'en-US' && child.nameEn) ? child.nameEn :
              child.name,
        slug: (locale === 'pt-BR' && child.slugPt) ? child.slugPt :
              (locale === 'en-US' && child.slugEn) ? child.slugEn :
              child.slug,
        level: child.level,
      })),
      country: category.country,
      order: category.order,
      icon: category.icon,
      metaTitle: category.metaTitle,
      metaDescription: category.metaDescription,
      metaKeywords: category.metaKeywords,
      counts: {
        products: category._count.products,
        articles: category._count.articles,
      },
    };

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json(formattedCategory);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

