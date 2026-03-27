import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { siteConfig } from './lib/site-config';

const CUSTOM_HOST = new URL(siteConfig.domain).host;

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Redirect vercel.app (or any non-custom-domain) to custom domain
  if (host !== CUSTOM_HOST && !host.startsWith('localhost')) {
    const url = new URL(request.url);
    url.host = CUSTOM_HOST;
    url.protocol = 'https';
    return NextResponse.redirect(url, 308);
  }
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
