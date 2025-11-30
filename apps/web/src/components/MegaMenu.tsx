'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCategories } from '@/contexts/CategoriesContext';
import { useMenu } from '@/contexts/MenuContext';
import type { Category } from '@/services/api';

interface MegaMenuProps {
  locale: string;
  getLink: (path: string) => string;
  onClose: () => void;
  rootCategory?: any;
  items?: any[];
  menuArticles?: any[];
}

// Generic MegaMenu component that works with any category
export const GenericMegaMenu: React.FC<MegaMenuProps> = ({
  locale,
  getLink,
  onClose,
  rootCategory,
  items = [],
  menuArticles = []
}) => {
  const { buildPath } = useCategories();

  if (!rootCategory && items.length === 0 && menuArticles.length === 0) {
    return null;
  }

  // Build full paths for categories
  const categories = items.map((cat) => {
    const fullPath = buildPath(cat, locale);
    return {
      ...cat,
      fullPath: fullPath || cat.slug || '',
    };
  });

  // Group articles by their category ID
  const articlesByCategory = menuArticles.reduce((acc: any, article: any) => {
    if (article.category && article.category.id) {
      const categoryId = article.category.id;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(article);
    }
    return acc;
  }, {});

  return (
    <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
      <div className="p-4">
        <ul className="space-y-1">
          {categories.map((item) => {
            const categoryArticles = articlesByCategory[item.id] || [];
            return (
              <li key={item.id}>
                <Link
                  href={getLink(
                    item.fullPath ? `/${item.fullPath}` : item.slug ? `/${item.slug}` : '#'
                  )}
                  onClick={(e) => {
                    // Close menu immediately, navigation will happen via Link
                    onClose();
                  }}
                  className="text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors block py-2.5 px-3 rounded-md"
                >
                  {item.name}
                </Link>
                {categoryArticles.length > 0 && (
                  <ul className="pl-4 mt-1 space-y-1">
                    {categoryArticles.map((article: any) => (
                      <li key={article.id}>
                        <Link
                          href={getLink(article.fullPath)}
                          onClick={(e) => {
                            // Close menu immediately, navigation will happen via Link
                            onClose();
                          }}
                          className="text-sm text-slate-500 hover:text-brand-600 hover:bg-slate-50 transition-colors block py-2 px-3 rounded-md"
                        >
                          {article.titleMenu || article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
          {/* Show articles that don't have a category or belong to categories not in the list */}
          {menuArticles
            .filter((article: any) => {
              if (!article.category || !article.category.id) return true;
              return !categories.some((cat) => cat.id === article.category.id);
            })
            .map((article: any) => (
              <li key={article.id}>
                <Link
                  href={getLink(article.fullPath)}
                  onClick={(e) => {
                    // Close menu immediately, navigation will happen via Link
                    onClose();
                  }}
                  className="text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors block py-2.5 px-3 rounded-md"
                >
                  {article.titleMenu || article.title}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

// Generic MobileMenu component
export const GenericMobileMenu: React.FC<MegaMenuProps> = ({
  locale,
  getLink,
  onClose,
  rootCategory,
  items = [],
  menuArticles = []
}) => {
  const { buildPath, getByParent } = useCategories();

  if (!rootCategory && items.length === 0 && menuArticles.length === 0) {
    return null;
  }

  // Get level 1 categories
  const level1Cats = rootCategory ? getByParent(rootCategory.id) : items;
  const sortedLevel1Cats = [...level1Cats].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Get all category IDs (including children) for filtering articles
  const getAllCategoryIds = (parentId: string | null): string[] => {
    if (!parentId) return [];
    const ids = [parentId];
    const children = getByParent(parentId);
    children.forEach((child) => {
      ids.push(child.id);
      ids.push(...getAllCategoryIds(child.id));
    });
    return ids;
  };

  const categoryIds = rootCategory ? getAllCategoryIds(rootCategory.id) : [];

  // Filter articles to only show those that belong to this category tree
  const filteredMenuArticles = menuArticles.filter((article: any) => {
    if (!article.category || !article.category.id) return false;
    return categoryIds.includes(article.category.id);
  });

  return (
    <div className="pl-4 mt-1 space-y-1 border-l-2 border-slate-200">
      {sortedLevel1Cats.map((level1Cat) => {
        const children = getByParent(level1Cat.id);
        const sortedChildren = [...children].sort((a, b) => (a.order || 0) - (b.order || 0));

        // Get articles that belong to this level 1 category
        const categoryArticles = filteredMenuArticles.filter(
          (article: any) => article.category?.id === level1Cat.id
        );

        return (
          <div key={level1Cat.id} className="pt-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-1">
              {level1Cat.name}
            </div>
            {/* Category children */}
            {sortedChildren.map((child) => {
              const childPath = buildPath(child, locale);
              const href = childPath ? `/${childPath}` : child.slug ? `/${child.slug}` : '#';
              return (
                <Link
                  key={child.id}
                  href={getLink(href)}
                  onClick={(e) => {
                    // Close menu immediately, navigation will happen via Link
                    onClose();
                  }}
                  className="block px-3 py-2 text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 rounded-md"
                >
                  {child.name}
                </Link>
              );
            })}
            {/* Articles */}
            {categoryArticles.map((article: any) => (
              <Link
                key={article.id}
                href={getLink(article.fullPath)}
                onClick={(e) => {
                  onClose();
                }}
                className="block px-3 py-2 text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 rounded-md"
              >
                {article.titleMenu || article.title}
              </Link>
            ))}
          </div>
        );
      })}
      {/* Show articles without a category */}
      {filteredMenuArticles
        .filter((article: any) => !article.category || !article.category.id)
        .map((article: any) => (
          <Link
            key={article.id}
            href={getLink(article.fullPath)}
            onClick={(e) => {
              onClose();
            }}
            className="block px-3 py-2 text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 rounded-md"
          >
            {article.titleMenu || article.title}
          </Link>
        ))}
    </div>
  );
};

export const InsuranceMegaMenu: React.FC<MegaMenuProps> = ({ locale, getLink, onClose }) => {
  const {
    categories: allCategories,
    loading,
    getByParent,
    findBySlug,
    buildPath,
  } = useCategories();
  const { menu: menuData } = useMenu();

  // Find insurance root category
  const insuranceRoot = findBySlug(locale === 'pt-BR' ? 'seguros' : 'insurance', locale);

  // Filter insurance categories (level 1)
  const insuranceCats = insuranceRoot ? getByParent(insuranceRoot.id) : [];
  const sortedInsuranceCats = [...insuranceCats].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Build full paths
  const categories = sortedInsuranceCats.map((cat) => {
    const fullPath = buildPath(cat, locale);
    return {
      ...cat,
      fullPath: fullPath || cat.slug || '',
    };
  });

  // Get menu articles that belong to insurance categories
  const insuranceMenuArticles = menuData?.insurance?.menuArticles || [];

  // Group articles by their category ID
  const articlesByCategory = insuranceMenuArticles.reduce((acc: any, article: any) => {
    if (article.category && article.category.id) {
      const categoryId = article.category.id;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(article);
    }
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-4">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (categories.length === 0 && insuranceMenuArticles.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
      <div className="p-4">
        <ul className="space-y-1">
          {categories.map((item) => {
            const categoryArticles = articlesByCategory[item.id] || [];
            return (
              <li key={item.id}>
                <Link
                  href={getLink(
                    item.fullPath ? `/${item.fullPath}` : item.slug ? `/${item.slug}` : '#'
                  )}
                  onClick={(e) => {
                    // Close menu immediately, navigation will happen via Link
                    onClose();
                  }}
                  className="text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors block py-2.5 px-3 rounded-md"
                >
                  {item.name}
                </Link>
                {categoryArticles.length > 0 && (
                  <ul className="pl-4 mt-1 space-y-1">
                    {categoryArticles.map((article: any) => (
                      <li key={article.id}>
                        <Link
                          href={getLink(article.fullPath)}
                          onClick={(e) => {
                            // Close menu immediately, navigation will happen via Link
                            onClose();
                          }}
                          className="text-sm text-slate-500 hover:text-brand-600 hover:bg-slate-50 transition-colors block py-2 px-3 rounded-md"
                        >
                          {article.titleMenu || article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
          {/* Show articles that don't have a category or belong to categories not in the level 1 list */}
          {insuranceMenuArticles
            .filter((article: any) => {
              if (!article.category || !article.category.id) return true;
              return !categories.some((cat) => cat.id === article.category.id);
            })
            .map((article: any) => (
              <li key={article.id}>
                <Link
                  href={getLink(article.fullPath)}
                  onClick={(e) => {
                    // Close menu immediately, navigation will happen via Link
                    onClose();
                  }}
                  className="text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors block py-2.5 px-3 rounded-md"
                >
                  {article.titleMenu || article.title}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export const ComparisonMegaMenu: React.FC<MegaMenuProps> = ({ locale, getLink, onClose }) => {
  const {
    categories: allCategories,
    loading,
    getByParent,
    findBySlug,
    buildPath,
  } = useCategories();

  // Find comparison root category
  const comparisonRoot = findBySlug(locale === 'pt-BR' ? 'comparador' : 'comparisons', locale);

  // Filter comparison categories (level 1)
  const comparisonCats = comparisonRoot ? getByParent(comparisonRoot.id) : [];

  // Build full paths
  const categories = comparisonCats.map((cat) => {
    const fullPath = buildPath(cat, locale);
    return {
      ...cat,
      fullPath: fullPath || cat.slug || '',
    };
  });

  if (loading) {
    return (
      <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-4">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
      <div className="p-4">
        <ul className="space-y-1">
          {categories.map((item) => (
            <li key={item.id}>
              <Link
                href={getLink(
                  item.fullPath ? `/${item.fullPath}` : item.slug ? `/${item.slug}` : '#'
                )}
                onClick={(e) => {
                  // Close menu immediately, navigation will happen via Link
                  onClose();
                }}
                className="text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors block py-2.5 px-3 rounded-md"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const GuidesMegaMenu: React.FC<MegaMenuProps> = ({ locale, getLink, onClose }) => {
  const { menu, loading } = useMenu();
  const { categories, loading: categoriesLoading, getByParent, findBySlug } = useCategories();

  if (loading || categoriesLoading) {
    return (
      <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-4">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!menu || !menu.guides.root) {
    return null;
  }

  const guideItems = menu.guides.items || [];
  const menuArticles = menu.guides.menuArticles || [];

  // Get all guides category IDs (including children) for safety filtering
  const getAllGuidesCategoryIds = (parentId: string | null): string[] => {
    if (!parentId) return [];
    const ids = [parentId];
    const children = getByParent(parentId);
    children.forEach((child) => {
      ids.push(child.id);
      ids.push(...getAllGuidesCategoryIds(child.id));
    });
    return ids;
  };

  const guidesRootCategory = findBySlug(locale === 'pt-BR' ? 'guias' : 'guides', locale);
  const guidesCategoryIds = guidesRootCategory
    ? getAllGuidesCategoryIds(guidesRootCategory.id)
    : [];

  // Filter articles to only show those that belong to guides categories
  const filteredMenuArticles = menuArticles.filter((article: any) => {
    if (!article.category || !article.category.id) return false;
    return guidesCategoryIds.includes(article.category.id);
  });

  if (guideItems.length === 0 && filteredMenuArticles.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
      <div className="p-4">
        <ul className="space-y-1">
          {/* Categories */}
          {guideItems.map((item: any) => (
            <li key={item.id}>
              <Link
                href={getLink(item.slug ? `/${item.slug}` : '#')}
                onClick={(e) => {
                  // Close menu immediately, navigation will happen via Link
                  onClose();
                }}
                className="text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors block py-2.5 px-3 rounded-md"
              >
                {item.name}
              </Link>
            </li>
          ))}
          {/* Menu Articles */}
          {filteredMenuArticles.map((article: any) => (
            <li key={article.id}>
              <Link
                href={getLink(article.fullPath)}
                onClick={(e) => {
                  // Close menu immediately, navigation will happen via Link
                  onClose();
                }}
                className="text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors block py-2.5 px-3 rounded-md"
              >
                {article.titleMenu || article.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const BlogMegaMenu: React.FC<MegaMenuProps> = ({ locale, getLink, onClose }) => {
  const {
    categories: allCategories,
    loading,
    getByParent,
    findBySlug,
    buildPath,
  } = useCategories();

  // Find blog root category
  const blogRoot = findBySlug('blog', locale);

  // Filter blog categories (level 1)
  const categories = blogRoot ? getByParent(blogRoot.id) : [];

  if (loading) {
    return (
      <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-4">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
      <div className="p-4">
        <ul className="space-y-1">
          {categories.map((item) => (
            <li key={item.id}>
              <Link
                href={getLink(
                  (() => {
                    const path = buildPath(item, locale);
                    return path ? `/${path}` : item.slug ? `/${item.slug}` : '#';
                  })()
                )}
                onClick={(e) => {
                  // Close menu immediately, navigation will happen via Link
                  onClose();
                }}
                className="text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors block py-2.5 px-3 rounded-md"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Mobile menu components
export const MobileInsuranceMenu: React.FC<MegaMenuProps> = ({ locale, getLink, onClose }) => {
  const { categories, loading, getByParent, findBySlug, buildPath } = useCategories();
  const { menu: menuData } = useMenu();

  const insuranceRoot = findBySlug(locale === 'pt-BR' ? 'seguros' : 'insurance', locale);
  const level1Cats = insuranceRoot ? getByParent(insuranceRoot.id) : [];
  const sortedLevel1Cats = [...level1Cats].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Get menu articles that belong to insurance categories
  const insuranceMenuArticles = menuData?.insurance?.menuArticles || [];

  if (loading) {
    return <div className="px-3 py-2 text-sm text-slate-500">Loading...</div>;
  }

  return (
    <div className="pl-4 mt-1 space-y-1 border-l-2 border-slate-200">
      {sortedLevel1Cats.map((level1Cat) => {
        const children = getByParent(level1Cat.id);
        const sortedChildren = [...children].sort((a, b) => (a.order || 0) - (b.order || 0));

        // Get articles that belong to this level 1 category
        const categoryArticles = insuranceMenuArticles.filter(
          (article: any) => article.category?.id === level1Cat.id
        );

        return (
          <div key={level1Cat.id} className="pt-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-1">
              {level1Cat.name}
            </div>
            {/* Category children */}
            {sortedChildren.map((child) => {
              const childPath = buildPath(child, locale);
              const href = childPath ? `/${childPath}` : child.slug ? `/${child.slug}` : '#';
              return (
                <Link
                  key={child.id}
                  href={getLink(href)}
                  onClick={(e) => {
                    // Close menu immediately, navigation will happen via Link
                    onClose();
                  }}
                  className="block px-3 py-2 text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 rounded-md"
                >
                  {child.name}
                </Link>
              );
            })}
            {/* Articles */}
            {categoryArticles.map((article: any) => (
              <Link
                key={article.id}
                href={getLink(article.fullPath)}
                onClick={(e) => {
                  onClose();
                }}
                className="block px-3 py-2 text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 rounded-md"
              >
                {article.titleMenu || article.title}
              </Link>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export const MobileComparisonMenu: React.FC<MegaMenuProps> = ({ locale, getLink, onClose }) => {
  const { categories, loading, getByParent, findBySlug, buildPath } = useCategories();

  const comparisonRoot = findBySlug(locale === 'pt-BR' ? 'comparador' : 'comparisons', locale);
  const comparisonCats = comparisonRoot ? getByParent(comparisonRoot.id) : [];
  const sortedCats = [...comparisonCats].sort((a, b) => (a.order || 0) - (b.order || 0));

  if (loading) {
    return <div className="px-3 py-2 text-sm text-slate-500">Loading...</div>;
  }

  return (
    <div className="pl-4 mt-1 space-y-1 border-l-2 border-slate-200">
      {sortedCats.map((cat) => (
        <Link
          key={cat.id}
          href={getLink(
            (() => {
              const path = buildPath(cat, locale);
              return path ? `/${path}` : cat.slug ? `/${cat.slug}` : '#';
            })()
          )}
          onClick={(e) => {
            // Close menu immediately, navigation will happen via Link
            onClose();
          }}
          className="block px-3 py-2 text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 rounded-md"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
};

export const MobileGuidesMenu: React.FC<MegaMenuProps> = ({ locale, getLink, onClose }) => {
  const { categories, loading, getByParent, findBySlug, buildPath } = useCategories();
  const [menuArticles, setMenuArticles] = React.useState<any[]>([]);
  const [articlesLoading, setArticlesLoading] = React.useState(true);

  // Fetch articles that should appear in menu
  React.useEffect(() => {
    const fetchMenuArticles = async () => {
      try {
        const { getMenuArticles } = await import('@/services/api');
        const articles = await getMenuArticles(locale);
        setMenuArticles(articles);
      } catch (error) {
        console.error('Error fetching menu articles:', error);
      } finally {
        setArticlesLoading(false);
      }
    };
    fetchMenuArticles();
  }, [locale]);

  const guidesRoot = findBySlug(locale === 'pt-BR' ? 'guias' : 'guides', locale);
  const guideCats = guidesRoot ? getByParent(guidesRoot.id) : [];
  const sortedCats = [...guideCats].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Get all guides category IDs (including children) for filtering
  const getAllGuidesCategoryIds = (parentId: string | null): string[] => {
    if (!parentId) return [];
    const ids = [parentId];
    const children = getByParent(parentId);
    children.forEach((child) => {
      ids.push(child.id);
      ids.push(...getAllGuidesCategoryIds(child.id));
    });
    return ids;
  };

  const guidesCategoryIds = guidesRoot ? getAllGuidesCategoryIds(guidesRoot.id) : [];

  // Filter articles to only show those that belong to guides categories
  const filteredMenuArticles = menuArticles.filter((article: any) => {
    if (!article.category || !article.category.id) return false;
    return guidesCategoryIds.includes(article.category.id);
  });

  // Build paths for menu articles
  const articlesWithPaths = filteredMenuArticles.map((article) => {
    let articlePath = '';
    if (article.category) {
      const categoryPath = buildPath(article.category, locale);
      articlePath = categoryPath ? `/${categoryPath}/${article.slug}` : `/${article.slug}`;
    } else {
      articlePath = `/${article.slug}`;
    }
    return {
      ...article,
      fullPath: articlePath,
    };
  });

  if (loading || articlesLoading) {
    return <div className="px-3 py-2 text-sm text-slate-500">Loading...</div>;
  }

  return (
    <div className="pl-4 mt-1 space-y-1 border-l-2 border-slate-200">
      {/* Categories */}
      {sortedCats.map((cat) => (
        <Link
          key={cat.id}
          href={getLink(
            (() => {
              const path = buildPath(cat, locale);
              return path ? `/${path}` : cat.slug ? `/${cat.slug}` : '#';
            })()
          )}
          onClick={(e) => {
            // Close menu immediately, navigation will happen via Link
            onClose();
          }}
          className="block px-3 py-2 text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 rounded-md"
        >
          {cat.name}
        </Link>
      ))}
      {/* Menu Articles */}
      {articlesWithPaths.map((article) => (
        <Link
          key={article.id}
          href={getLink(article.fullPath)}
          onClick={(e) => {
            // Close menu immediately, navigation will happen via Link
            onClose();
          }}
          className="block px-3 py-2 text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 rounded-md"
        >
          {article.titleMenu || article.title}
        </Link>
      ))}
    </div>
  );
};

export const MobileBlogMenu: React.FC<MegaMenuProps> = ({ locale, getLink, onClose }) => {
  const { categories, loading, getByParent, findBySlug, buildPath } = useCategories();

  const blogRoot = findBySlug('blog', locale);
  const blogCats = blogRoot ? getByParent(blogRoot.id) : [];
  const sortedCats = [...blogCats].sort((a, b) => (a.order || 0) - (b.order || 0));

  if (loading) {
    return <div className="px-3 py-2 text-sm text-slate-500">Loading...</div>;
  }

  return (
    <div className="pl-4 mt-1 space-y-1 border-l-2 border-slate-200">
      {sortedCats.map((cat) => (
        <Link
          key={cat.id}
          href={getLink(
            (() => {
              const path = buildPath(cat, locale);
              return path ? `/${path}` : cat.slug ? `/${cat.slug}` : '#';
            })()
          )}
          onClick={(e) => {
            // Close menu immediately, navigation will happen via Link
            onClose();
          }}
          className="block px-3 py-2 text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 rounded-md"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
};
