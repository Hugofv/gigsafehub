import React from 'react';

interface StructuredDataProps {
  data: Record<string, any>;
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Helper functions to generate structured data

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateArticleStructuredData(article: {
  title: string;
  description?: string;
  imageUrl?: string;
  date: string;
  author?: string;
  url: string;
  locale: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.imageUrl ? `${baseUrl}${article.imageUrl}` : undefined,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Organization',
      name: article.author || 'GigSafeHub',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GigSafeHub',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
    inLanguage: article.locale === 'pt-BR' ? 'pt-BR' : 'en-US',
  };
}

export function generateCategoryStructuredData(category: {
  name: string;
  description?: string;
  url: string;
  locale: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: category.url,
    inLanguage: category.locale === 'pt-BR' ? 'pt-BR' : 'en-US',
  };
}

export function generateOrganizationStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GigSafeHub',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Insurance and protection comparison platform for gig economy workers',
    sameAs: [
      // Add social media links here when available
    ],
  };
}

export function generateWebSiteStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GigSafeHub',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateLegalDocumentStructuredData(document: {
  name: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  locale: string;
  publisher?: {
    name: string;
    url: string;
  };
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': document.url,
    name: document.name,
    description: document.description,
    url: document.url,
    datePublished: document.datePublished,
    dateModified: document.dateModified,
    inLanguage: document.locale === 'pt-BR' ? 'pt-BR' : 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: 'GigSafeHub',
      url: baseUrl,
    },
    publisher: document.publisher || {
      '@type': 'Organization',
      name: 'GigSafeHub',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntity: {
      '@type': 'LegalDocument',
      name: document.name,
      description: document.description,
      datePublished: document.datePublished,
      dateModified: document.dateModified,
    },
  };
}

