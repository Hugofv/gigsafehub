// Shared types for admin API

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  namePt?: string;
  slug: string;
  slugEn?: string;
  slugPt?: string;
  description?: string;
  descriptionEn?: string;
  descriptionPt?: string;
  level: number;
  parentId?: string | null;
  parent?: Category;
  children?: Category[];
  country?: string | null;
  order: number;
  isActive: boolean;
  icon?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    products: number;
    articles: number;
    guides: number;
    comparisons: number;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  slugEn?: string;
  slugPt?: string;
  categoryId: string;
  category?: Category;
  country?: string | null;
  rating: number;
  reviewsCount: number;
  description: string;
  fees: string;
  affiliateLink: string;
  safetyScore: number;
  logoUrl: string;
  logoAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: string;
  sitemapPriority?: number;
  sitemapChangefreq?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Article {
  id: string;
  slug: string;
  slugEn?: string;
  slugPt?: string;
  title: string;
  titleMenu?: string;
  excerpt: string;
  content: string;
  partnerTag: string;
  imageUrl: string;
  imageAlt?: string;
  date: string | Date;
  locale: 'en_US' | 'pt_BR' | 'Both';
  articleType: string;
  categoryId?: string | null;
  category?: Category;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: string;
  readingTime?: number;
  showInMenu?: boolean;
  // Controla se o artigo está ativo (indexado) ou não
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  meta?: {
    socialMedia?: {
      facebook?: { postId: string; postedAt: string };
      instagram?: { postId: string; postedAt: string };
      twitter?: { postId: string; postedAt: string };
    };
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  categories: number;
  products: number;
  articles: number;
}

