import { IncomingMessage } from 'http';
import { NextResponse } from 'next/server';

const allowedPaths: (string | RegExp)[] = [
  /^\/api\/.*/,
  /\.png$/,
  /\.svg$/,
  /\.css$/,
  /\.ico$/,
  /^\/socket\.io\/?/,
  /^\/analytics\/.*/
];

function isPathAllowed(
  pathname: string,
  allowedPaths: (string | RegExp)[]
): boolean {
  return allowedPaths.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(pathname);
    }
    return pathname === pattern;
  });
}

function middleware(request: IncomingMessage) {
  const pathname = request.url;

  if (!pathname) {
    // Handle case where pathname is undefined
    return NextResponse.error();
  }

  if (isPathAllowed(pathname, allowedPaths)) {
    return NextResponse.next();
  }

  // All requests proceed without auth checks
  return NextResponse.next();
}

export default middleware;
