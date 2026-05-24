import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ищем повторяющиеся /catalog/catalog
  if (pathname.includes('/catalog/catalog')) {
    // заменяем множественные catalog на один
    const normalizedPath = pathname.replace(/(\/catalog)+/g, '/catalog');

    return NextResponse.redirect(
      new URL(normalizedPath, request.url),
      301
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/catalog/:path*'],
};