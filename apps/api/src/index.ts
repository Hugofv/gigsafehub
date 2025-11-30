import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import pino from 'pino';
import pinoHttp from 'pino-http';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { healthRouter } from './routes/health';
import { quotesRouter } from './routes/quotes';
import { authRouter } from './routes/auth';
import { productsRouter } from './routes/products';
import { articlesRouter } from './routes/articles';
import { guidesRouter } from './routes/guides';
import { comparisonsRouter } from './routes/comparisons';
import { faqRouter } from './routes/faq';
import { categoriesRouter } from './routes/categories';
import { seoRouter } from './routes/seo';
import { adminRouter } from './routes/admin';
import { seoHeaders, structuredDataHeaders } from './middleware/seo';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config';

const app: Express = express();
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        }
      : undefined,
});

// Trust proxy (important for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware with SEO-friendly headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    // Allow search engines to index
    noSniff: true,
    xssFilter: true,
  })
);
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting - more lenient for categories endpoint
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// More lenient rate limiting for categories (since we cache aggressively)
const categoriesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Higher limit for categories
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply category-specific rate limiting
app.use('/api/categories', categoriesLimiter);
// Apply general rate limiting to other routes
app.use('/api/', generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware
app.use(hpp());
app.use(mongoSanitize());
// Note: XSS protection is handled by Helmet middleware above

// Compression
app.use(compression());

// Request logging
app.use(pinoHttp({ logger }));

// SEO middleware
app.use(seoHeaders);
app.use(structuredDataHeaders);

// Remove X-Powered-By header
app.disable('x-powered-by');

// SEO-friendly headers middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  // Add canonical URL hint
  if (req.path.startsWith('/api/')) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }

  // Add structured data hint
  res.setHeader('X-Content-Type-Options', 'nosniff');

  next();
});

// Swagger/OpenAPI documentation
import { swaggerDefinition } from './swagger';

const swaggerOptions = {
  definition: {
    ...swaggerDefinition,
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/health', healthRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/guides', guidesRouter);
app.use('/api/comparisons', comparisonsRouter);
app.use('/api/faq', faqRouter);
app.use('/api/categories', categoriesRouter);
app.use('/', seoRouter); // SEO routes (sitemap.xml, robots.txt, /api/seo/meta)
app.use('/api/admin', adminRouter);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'GigSafeHub API',
    version: '1.0.0',
    docs: '/docs',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`API Documentation: http://localhost:${config.port}/docs`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    logger.info('HTTP server closed');
    // Disconnect Prisma
    const { prisma } = await import('./lib/prisma');
    await prisma.$disconnect();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    logger.info('HTTP server closed');
    // Disconnect Prisma
    const { prisma } = await import('./lib/prisma');
    await prisma.$disconnect();
    process.exit(0);
  });
});

export default app;

