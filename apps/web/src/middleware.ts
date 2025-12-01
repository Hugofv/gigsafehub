import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle locale-specific slug redirects for privacy and terms pages
  const pathSegments = pathname.split('/').filter(Boolean);

  if (pathSegments.length >= 2) {
    const locale = pathSegments[0];
    const slug = pathSegments[1];

    // Redirect wrong locale-specific slugs
    // If pt-BR locale but using English slug
    if (locale === 'pt-BR') {
      if (slug === 'privacy-and-policies') {
        return NextResponse.redirect(new URL('/pt-BR/politicas-e-privacidade', request.url));
      }
      if (slug === 'terms-of-use') {
        return NextResponse.redirect(new URL('/pt-BR/termos-de-uso', request.url));
      }
    }

    // If en-US locale but using Portuguese slug
    if (locale === 'en-US') {
      if (slug === 'politicas-e-privacidade') {
        return NextResponse.redirect(new URL('/en-US/privacy-and-policies', request.url));
      }
      if (slug === 'termos-de-uso') {
        return NextResponse.redirect(new URL('/en-US/terms-of-use', request.url));
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
