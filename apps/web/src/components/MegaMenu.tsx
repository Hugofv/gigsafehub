'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCategories } from '@/contexts/CategoriesContext';
import { useMenu } from '@/contexts/MenuContext';
import type { Category } from '@/services/api';

interface MegaMenuProps {
  locale: string;
  getLink: (path: string) => string;
  onClose: () => void;
}

export const InsuranceMegaMenu: React.FC<MegaMenuProps> = ({ locale, getLink, onClose }) => {
  const { categories, loading, getByParent, findBySlug, buildPath } = useCategories();
  const router = useRouter();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const submenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Find insurance root category
  const insuranceRoot = findBySlug(locale === 'pt-BR' ? 'seguros' : 'insurance', locale);

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openSubmenu) {
        const ref = submenuRefs.current[openSubmenu];
        if (ref && !ref.contains(event.target as Node)) {
          setOpenSubmenu(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openSubmenu]);

  if (loading) {
    return (
      <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-6">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!insuranceRoot) {
    console.warn('Insurance root category not found');
    return null;
  }

  // Type for menu items with nested structure
  type MenuItem = Omit<Category, 'children'> & {
    fullPath: string;
    children?: MenuItem[];
  };

  // Recursive function to build nested menu items - get ALL levels
  const buildAllLevels = (parentId: string, startLevel: number = 2): MenuItem[] => {
    const children = getByParent(parentId)
      .filter((cat) => cat.level >= startLevel)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return children.map((child) => {
      const subChildren = buildAllLevels(child.id, startLevel + 1);
      const { children: _, ...childWithoutChildren } = child;
      const fullPath = buildPath(child, locale);
      // Ensure we have a valid path
      const validPath = fullPath || child.slug || '';
      const menuItem: MenuItem = {
        ...childWithoutChildren,
        fullPath: validPath,
      };
      if (subChildren.length > 0) {
        menuItem.children = subChildren;
      }
      return menuItem;
    });
  };

  // Group by level 1 categories
  const level1Cats = getByParent(insuranceRoot.id);
  const sortedLevel1Cats = [...level1Cats].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Build sections with all levels
  const sections = sortedLevel1Cats
    .map((level1Cat) => {
      const items = buildAllLevels(level1Cat.id, 2);

      return {
        title: level1Cat.name,
        items,
      };
    })
    .filter((s) => s.items.length > 0);

  if (sections.length === 0) {
    return null;
  }

  // Component to render menu items with popover for submenus
  const MenuItemComponent: React.FC<{ item: MenuItem; sectionIdx: number; itemIdx: number }> = ({
    item,
    sectionIdx,
    itemIdx,
  }) => {
    const hasChildren = item.children && item.children.length > 0;
    const itemKey = `${sectionIdx}-${itemIdx}-${item.id}`;
    const isSubmenuOpen = openSubmenu === itemKey;

    return (
      <li className="relative group">
        <div className="flex items-center justify-between">
          <Link
            href={getLink(item.fullPath ? `/${item.fullPath}` : item.slug ? `/${item.slug}` : '#')}
            onClick={(e) => {
              // Don't prevent default - let Link handle navigation
              // Close menu after a small delay to allow navigation to start
              setTimeout(() => {
                onClose();
              }, 50);
            }}
            className="text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors block py-2 px-2 rounded-md whitespace-normal flex-1"
            title={item.name}
          >
            {item.name}
          </Link>
          {hasChildren && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpenSubmenu(isSubmenuOpen ? null : itemKey);
              }}
              onMouseEnter={() => setOpenSubmenu(itemKey)}
              className="ml-2 p-1 text-slate-400 hover:text-slate-600 flex-shrink-0"
              aria-label="Toggle submenu"
            >
              <svg
                className={`w-4 h-4 transition-transform ${isSubmenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
        {hasChildren && isSubmenuOpen && (
          <div
            ref={(el) => {
              submenuRefs.current[itemKey] = el;
            }}
            className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-[60] p-4"
            onMouseLeave={() => setOpenSubmenu(null)}
          >
            <ul className="space-y-1.5">
              {item.children!.map((child, childIdx) => (
                <MenuItemComponent
                  key={child.id}
                  item={child}
                  sectionIdx={sectionIdx}
                  itemIdx={itemIdx * 1000 + childIdx}
                />
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <div
      className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-slate-200 z-50"
      style={{ width: '44rem' }}
    >
      <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {sections.map((section, idx) => (
            <div key={`${section.title}-${idx}`} className="flex flex-col min-w-0">
              <h3 className="font-bold text-slate-900 mb-5 text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
                {section.title}
              </h3>
              <ul className="space-y-1.5 flex-1">
                {section.items.map((item, itemIdx) => (
                  <MenuItemComponent key={item.id} item={item} sectionIdx={idx} itemIdx={itemIdx} />
                ))}
              </ul>
            </div>
          ))}
        </div>
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

  if (loading) {
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

  if (guideItems.length === 0 && menuArticles.length === 0) {
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
                href={getLink(
                  item.slug ? `/${item.slug}` : '#'
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
          {/* Menu Articles */}
          {menuArticles.map((article: any) => (
            <li key={article.id}>
              <Link
                href={getLink(article.fullPath)}
onClick={(e) => {
              // Close menu immediately, navigation will happen via Link
              onClose();
            }}
                className="text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors block py-2.5 px-3 rounded-md"
              >
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const BlogMegaMenu: React.FC<MegaMenuProps> = ({ locale, getLink, onClose }) => {
  const { categories: allCategories, loading, getByParent, findBySlug, buildPath } = useCategories();

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

  const insuranceRoot = findBySlug(locale === 'pt-BR' ? 'seguros' : 'insurance', locale);
  const level1Cats = insuranceRoot ? getByParent(insuranceRoot.id) : [];
  const sortedLevel1Cats = [...level1Cats].sort((a, b) => (a.order || 0) - (b.order || 0));

  if (loading) {
    return <div className="px-3 py-2 text-sm text-slate-500">Loading...</div>;
  }

  return (
    <div className="pl-4 mt-1 space-y-1 border-l-2 border-slate-200">
      {sortedLevel1Cats.map((level1Cat) => {
        const children = getByParent(level1Cat.id);
        const sortedChildren = [...children].sort((a, b) => (a.order || 0) - (b.order || 0));

        return (
          <div key={level1Cat.id} className="pt-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-1">
              {level1Cat.name}
            </div>
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

  // Build paths for menu articles
  const articlesWithPaths = menuArticles.map((article) => {
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
          {article.title}
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
