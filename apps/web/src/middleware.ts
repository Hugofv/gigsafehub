import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle root path redirect with locale detection (301 permanent redirect for SEO)
  if (pathname === '/') {
    // Detect user's preferred language from Accept-Language header
    const acceptLanguage = request.headers.get('accept-language') || '';
    let preferredLocale = 'en-US';

    if (acceptLanguage) {
      // Check if Portuguese (pt) is preferred
      const languages = acceptLanguage.toLowerCase().split(',');
      const ptLanguage = languages.find(lang => lang.includes('pt'));

      if (ptLanguage) {
        preferredLocale = 'pt-BR';
      }
    }

    // Use permanent redirect (301) for SEO
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${preferredLocale}`;
    if (process.env.NODE_ENV === 'production') {
      redirectUrl.protocol = 'https:';
    }
    return NextResponse.redirect(redirectUrl, 301);
  }

  // Serve IndexNow key file for Bing/search engine ownership verification
  // Must be at root: https://example.com/{key}.txt per IndexNow spec
  const indexNowKey = process.env.INDEXNOW_KEY;
  if (indexNowKey && pathname === `/${indexNowKey}.txt`) {
    return new NextResponse(indexNowKey, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  // Block search routes - they don't exist and should return 404
  if (pathname.startsWith('/search')) {
    return new NextResponse(null, { status: 404 });
  }

  // Force HTTPS redirect in production (if not already handled at infrastructure level)
  // Check the X-Forwarded-Proto header (set by reverse proxies) or the protocol
  const protocol = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol;
  if (process.env.NODE_ENV === 'production' && protocol === 'http:') {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = 'https:';
    // Use 301 (permanent) for HTTP to HTTPS redirects for better SEO
    return NextResponse.redirect(httpsUrl, 301);
  }

  // Remove trailing slashes except for root to ensure consistent URLs
  if (pathname !== '/' && pathname.endsWith('/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    // Ensure HTTPS in production
    if (process.env.NODE_ENV === 'production') {
      url.protocol = 'https:';
    }
    return NextResponse.redirect(url, 301);
  }

  // Handle locale-specific slug redirects for privacy and terms pages
  const pathSegments = pathname.split('/').filter(Boolean);

  if (pathSegments.length >= 2) {
    const locale = pathSegments[0];
    const slug = pathSegments[1];

    // Helper function to create redirect URL with HTTPS in production
    const createRedirectUrl = (path: string) => {
      const url = new URL(path, request.url);
      if (process.env.NODE_ENV === 'production') {
        url.protocol = 'https:';
      }
      return url;
    };

    // Redirect wrong locale-specific slugs
    // If pt-BR locale but using English slug
    if (locale === 'pt-BR') {
      if (slug === 'privacy-and-policies') {
        return NextResponse.redirect(createRedirectUrl('/pt-BR/politicas-e-privacidade'), 301);
      }
      if (slug === 'terms-of-use') {
        return NextResponse.redirect(createRedirectUrl('/pt-BR/termos-de-uso'), 301);
      }
    }

    // If en-US locale but using Portuguese slug
    if (locale === 'en-US') {
      if (slug === 'politicas-e-privacidade') {
        return NextResponse.redirect(createRedirectUrl('/en-US/privacy-and-policies'), 301);
      }
      if (slug === 'termos-de-uso') {
        return NextResponse.redirect(createRedirectUrl('/en-US/terms-of-use'), 301);
      }
      if (slug === 'sobre-nos') {
        return NextResponse.redirect(createRedirectUrl('/en-US/about'), 301);
      }
    }

    // Redirect old /about slug to locale-specific slug
    if (slug === 'about') {
      if (locale === 'pt-BR') {
        return NextResponse.redirect(createRedirectUrl('/pt-BR/sobre-nos'), 301);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
