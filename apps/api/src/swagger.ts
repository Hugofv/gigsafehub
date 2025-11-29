// Swagger/OpenAPI configuration
export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'GigSafeHub API',
    version: '1.0.0',
    description: 'API documentation for GigSafeHub',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      InsuranceQuote: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          productId: { type: 'string' },
          coverage: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['basic', 'standard', 'premium'] },
              amount: { type: 'number' },
              deductible: { type: 'number' },
              features: { type: 'array', items: { type: 'string' } },
            },
          },
          premium: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          expiresAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};

