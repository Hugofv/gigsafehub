import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to add SEO-friendly headers
 */
export const seoHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Add Last-Modified header if available
  // This will be set by individual routes based on data

  // Add ETag support for caching
  // Individual routes should set this based on content hash

  // Ensure proper content type
  if (!res.getHeader('Content-Type')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  }

  // Add Vary header for proper caching
  res.setHeader('Vary', 'Accept-Language, Accept-Encoding');

  next();
};

/**
 * Middleware to add structured data headers
 */
export const structuredDataHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Hint to search engines about structured data availability
  if (req.path.includes('/api/products/') || req.path.includes('/api/articles/')) {
    res.setHeader('X-Structured-Data', 'available');
  }

  next();
};

