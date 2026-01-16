import { prisma } from '../../lib/prisma';
import pino from 'pino';
import {
  scrapeSimplyHiredJobs,
  transformJob,
  SimplyHiredJob,
  closeBrowser,
} from '../../services/scraper/simplyHired';

const logger = pino().child({ module: 'SimplyHiredScraperJob' });

/**
 * Get search queries from environment or use defaults
 */
function getSearchQueries(): string[] {
  const envQueries = process.env.SIMPLYHIRED_SEARCH_QUERIES;
  if (envQueries) {
    return envQueries.split(',').map((q) => q.trim());
  }
  // Default queries for gig economy jobs
  return ['driver', 'delivery driver', 'rideshare driver', 'gig economy'];
}

/**
 * Get search locations from environment or use defaults
 */
function getSearchLocations(): string[] {
  const envLocations = process.env.SIMPLYHIRED_SEARCH_LOCATIONS;
  if (envLocations) {
    return envLocations.split(',').map((l) => l.trim()).filter(Boolean);
  }
  // Empty array means search all locations
  return [];
}

/**
 * SimplyHired scraper job
 * Scrapes job opportunities and stores them in the database
 */
export async function simplyHiredScraperJob(): Promise<void> {
  logger.info('Starting SimplyHired scraper job');

  const searchQueries = getSearchQueries();
  const searchLocations = getSearchLocations();
  const rateLimitDelay = parseInt(process.env.SIMPLYHIRED_RATE_LIMIT_DELAY || '2000', 10);
  // maxPages: 0 = unlimited (only safety limit of 1000), or set a specific limit
  // Default to 0 to scrape all available pages
  const maxPages = parseInt(process.env.SIMPLYHIRED_MAX_PAGES || '0', 10);

  let totalScraped = 0;
  let totalNew = 0;
  let totalUpdated = 0;
  let totalErrors = 0;

  try {
    // If no locations specified, use empty string to search all locations
    const locations = searchLocations.length > 0 ? searchLocations : [''];

    for (const query of searchQueries) {
      for (const location of locations) {
        try {
          logger.info({ query, location: location || 'all locations' }, 'Scraping jobs');

          // Add delay between different queries to avoid rate limiting
          if (rateLimitDelay > 0) {
            await new Promise((resolve) => setTimeout(resolve, rateLimitDelay));
          }

          // Scrape jobs from SimplyHired
          const jobs = await scrapeSimplyHiredJobs({
            query,
            location: location || undefined,
            maxPages,
            rateLimitDelay,
          });

          totalScraped += jobs.length;

          // Process each job
          logger.info({ jobsToProcess: jobs.length }, 'Starting to process jobs for database');

          for (const job of jobs) {
            try {
              const transformed = transformJob(job, query, location || undefined);

              // Check if job already exists before upsert
              const existing = await prisma.jobOpportunity.findUnique({
                where: {
                  sourceId_source: {
                    sourceId: transformed.sourceId,
                    source: 'simplyhired',
                  },
                },
                select: { id: true, createdAt: true },
              });

              const existedBefore = !!existing;

              // Upsert job (update if exists, create if new)
              const result = await prisma.jobOpportunity.upsert({
                where: {
                  sourceId_source: {
                    sourceId: transformed.sourceId,
                    source: 'simplyhired',
                  },
                },
                update: {
                  // Update fields that might have changed
                  title: transformed.title,
                  company: transformed.company,
                  location: transformed.location,
                  city: transformed.city,
                  state: transformed.state,
                  latitude: transformed.latitude,
                  longitude: transformed.longitude,
                  salaryInfo: transformed.salaryInfo,
                  compensation: transformed.compensation,
                  description: transformed.description,
                  rawDescriptionHtml: transformed.rawDescriptionHtml,
                  companyRating: transformed.companyRating,
                  employerName: transformed.employerName,
                  employerCompanyPageUrl: transformed.employerCompanyPageUrl,
                  benefits: transformed.benefits,
                  jobTypes: transformed.jobTypes,
                  qualifications: transformed.qualifications,
                  requirements: transformed.requirements,
                  datePublished: transformed.datePublished,
                  dateOnIndeed: transformed.dateOnIndeed,
                  isExpired: transformed.isExpired,
                  sourceUrl: transformed.sourceUrl,
                  searchQuery: transformed.searchQuery,
                  searchLocation: transformed.searchLocation,
                  lastSeenAt: new Date(),
                  isActive: true, // Reactivate if it was marked inactive
                },
                create: {
                  ...transformed,
                  country: 'US', // Default to US for now
                  locale: 'en_US', // Default to English for now
                  lastSeenAt: new Date(),
                },
              });

              // Use the check we did before upsert to determine if it's new
              if (!existedBefore) {
                totalNew++;
                if (totalNew <= 5) {
                  logger.info({ title: result.title, company: result.company, id: result.id, sourceId: transformed.sourceId }, '✅ New job saved to database');
                }
              } else {
                totalUpdated++;
                if (totalUpdated <= 5) {
                  logger.debug({ title: result.title, company: result.company, id: result.id }, 'Job updated in database');
                }
              }
            } catch (error) {
              logger.error({ error, job: job.title }, 'Error processing individual job');
              totalErrors++;
            }
          }

          logger.info(
            {
              query,
              location: location || 'all',
              jobsFound: jobs.length,
              willSave: jobs.length > 0,
            },
            'Completed scraping for query/location'
          );

          if (jobs.length === 0) {
            logger.warn(
              { query, location: location || 'all' },
              'No jobs found - check if SimplyHired structure changed or if page loaded correctly'
            );
          }
        } catch (error) {
          logger.error({ error, query, location }, 'Error scraping jobs for query/location');
          totalErrors++;
        }
      }
    }

    // Optional: Mark jobs as inactive if not seen for 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const inactiveCount = await prisma.jobOpportunity.updateMany({
      where: {
        isActive: true,
        lastSeenAt: {
          lt: thirtyDaysAgo,
        },
      },
      data: {
        isActive: false,
      },
    });

    logger.info(
      {
        totalScraped,
        totalNew,
        totalUpdated,
        totalErrors,
        markedInactive: inactiveCount.count,
      },
      'SimplyHired scraper job completed'
    );
  } catch (error) {
    logger.error({ error }, 'SimplyHired scraper job failed');
    throw error;
  } finally {
    // Close browser to free resources
    await closeBrowser();
  }
}
