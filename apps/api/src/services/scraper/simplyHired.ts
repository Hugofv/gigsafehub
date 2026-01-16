import pino from 'pino';
import { chromium, Browser } from 'playwright';

const logger = pino().child({ module: 'SimplyHiredScraper' });

// Singleton browser instance to reuse
let browserInstance: Browser | null = null;

/**
 * Get or create browser instance
 * Configured to work in Railway and other containerized environments
 */
async function getBrowser(): Promise<Browser> {
  if (!browserInstance) {
    // Railway and Docker-friendly configuration
    const isRailway = process.env.RAILWAY_ENVIRONMENT === 'production' || process.env.RAILWAY_ENVIRONMENT_NAME;
    const isDocker = process.env.DOCKER === 'true' || process.env.IN_DOCKER === 'true';

    browserInstance = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions',
        '--single-process', // Required for Railway/Docker
        ...(isRailway || isDocker ? ['--disable-background-networking'] : []),
      ],
      // Use system chromium if available (Railway)
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    });
  }
  return browserInstance;
}

/**
 * Close browser instance
 */
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

export interface SimplyHiredJob {
  jobKey: string;
  title: string;
  company: string;
  location: string;
  salaryInfo?: string;
  companyRating?: number;
  benefits?: string[];
  snippet?: string;
  botUrl?: string;
  encodedUrl?: string;
  jobCardTrackingKey?: string;
  requirements?: string[];
  jobTypes?: string[];
  remoteAttributes?: string[];
  uncategorized?: string[];
  indeedApply?: boolean;
  sponsored?: boolean;
  auction?: boolean;
  dateOnIndeed?: number; // Timestamp
  datePublished?: number; // Timestamp
  jobDescriptionHtml?: string; // Full HTML description
  qualifications?: string[];
  compensation?: string;
  employerName?: string;
  employerCompanyPageUrl?: string;
  expired?: boolean;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}

export interface SimplyHiredViewJobData {
  jobKey?: string;
  jobTitle?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  jobDescriptionHtml?: string;
  compensation?: string;
  datePublished?: number;
  dateOnIndeed?: number;
  qualifications?: string[];
  employerName?: string;
  employerCompanyPageUrl?: string;
  expired?: boolean;
  [key: string]: any;
}

export interface SimplyHiredResponse {
  pageProps?: {
    jobs?: SimplyHiredJob[];
    viewJobData?: SimplyHiredViewJobData; // Detailed job data when viewing a single job
    pageCursors?: {
      [pageNumber: string]: string; // Page number as key, cursor as value
    };
    currentPageNumber?: number;
    totalPages?: number;
  };
}

export interface ScrapeOptions {
  query: string;
  location?: string;
  cursor?: string; // Pagination cursor (not page number)
  rateLimitDelay?: number;
  context?: any; // Optional browser context to reuse across pages
}

/**
 * Generate a unique source ID for a job
 * This is used for deduplication
 */
export function generateSourceId(job: SimplyHiredJob, query: string): string {
  // Use jobKey if available (primary identifier from SimplyHired)
  if (job.jobKey) {
    return `simplyhired_${job.jobKey}`;
  }

  // Fallback: create a hash from job details
  const hashInput = `${job.title}_${job.company}_${job.location}_${query}`;
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `simplyhired_${Math.abs(hash).toString(36)}`;
}

/**
 * Generate source URL for a job
 */
export function generateSourceUrl(job: SimplyHiredJob): string | null {
  // Prefer botUrl (decoded URL)
  if (job.botUrl) {
    if (job.botUrl.startsWith('/')) {
      return `https://www.simplyhired.com${job.botUrl}`;
    }
    return job.botUrl;
  }

  // Fallback to encodedUrl (needs decoding)
  if (job.encodedUrl) {
    try {
      const decodedUrl = decodeURIComponent(job.encodedUrl);
      if (decodedUrl.startsWith('/')) {
        return `https://www.simplyhired.com${decodedUrl}`;
      }
      return decodedUrl;
    } catch (e) {
      // If decoding fails, use as-is
      if (job.encodedUrl.startsWith('/')) {
        return `https://www.simplyhired.com${job.encodedUrl}`;
      }
      return job.encodedUrl;
    }
  }

  // Use jobKey to construct URL
  if (job.jobKey) {
    return `https://www.simplyhired.com/job/${job.jobKey}`;
  }

  // Fallback: create a search URL
  const params = new URLSearchParams({
    q: job.title,
    l: job.location,
  });
  return `https://www.simplyhired.com/search?${params.toString()}`;
}

/**
 * Parse location string to extract city and state
 */
function parseLocation(location: string): { city: string | null; state: string | null } {
  if (!location) {
    return { city: null, state: null };
  }

  // Common patterns: "City, State" or "City, State, Country"
  const parts = location.split(',').map((p) => p.trim());

  if (parts.length >= 2) {
    const state = parts[1].split(' ')[0]; // Take first part (e.g., "CA" from "CA 90210")
    return {
      city: parts[0] || null,
      state: state || null,
    };
  }

  return { city: location, state: null };
}

/**
 * Transform SimplyHired job to our JobOpportunity format
 */
export function transformJob(
  job: SimplyHiredJob,
  searchQuery: string,
  searchLocation?: string
): {
  title: string;
  company: string;
  location: string;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  salaryInfo: string | null;
  compensation: string | null;
  description: string | null;
  rawDescriptionHtml: string | null;
  companyRating: number | null;
  employerName: string | null;
  employerCompanyPageUrl: string | null;
  benefits: any;
  jobTypes: any;
  qualifications: any;
  requirements: any;
  datePublished: Date | null;
  dateOnIndeed: Date | null;
  isExpired: boolean;
  sourceUrl: string | null;
  sourceId: string;
  source: string;
  searchQuery: string;
  searchLocation: string | null;
} {
  // Handle companyRating: -1 means no rating available
  let rating: number | null = null;
  if (job.companyRating !== undefined && job.companyRating !== null && job.companyRating >= 0) {
    rating = job.companyRating;
  }

  // Parse location
  const { city, state } = parseLocation(job.location || '');

  // Parse dates (timestamps in milliseconds)
  // Use datePublished if available, otherwise fall back to dateOnIndeed
  const dateOnIndeed = job.dateOnIndeed ? new Date(job.dateOnIndeed) : null;
  const datePublished = job.datePublished ? new Date(job.datePublished) : (dateOnIndeed || null);

  // Extract job types, qualifications, and requirements separately
  const jobTypes = job.jobTypes && job.jobTypes.length > 0 ? job.jobTypes : null;
  const qualifications = job.qualifications && job.qualifications.length > 0 ? job.qualifications : null;
  const requirements = job.requirements && job.requirements.length > 0 ? job.requirements : null;

  // Benefits object (keep existing structure for backward compatibility)
  const benefitsData: any = {};
  if (job.benefits && job.benefits.length > 0) {
    benefitsData.benefits = job.benefits;
  }

  return {
    title: job.title || 'Untitled Job',
    company: job.company || 'Unknown Company',
    location: job.location || 'Location not specified',
    city: job.city || city,
    state: job.state || state,
    latitude: job.latitude || null,
    longitude: job.longitude || null,
    salaryInfo: job.salaryInfo || null,
    compensation: job.compensation || null,
    description: job.snippet || null,
    rawDescriptionHtml: job.jobDescriptionHtml || null,
    companyRating: rating,
    employerName: job.employerName || job.company || null,
    employerCompanyPageUrl: job.employerCompanyPageUrl || null,
    benefits: Object.keys(benefitsData).length > 0 ? benefitsData : null,
    jobTypes,
    qualifications,
    requirements,
    datePublished,
    dateOnIndeed,
    isExpired: job.expired || false,
    sourceUrl: generateSourceUrl(job),
    sourceId: generateSourceId(job, searchQuery),
    source: 'simplyhired',
    searchQuery,
    searchLocation: searchLocation || null,
  };
}

/**
 * Scrape jobs with pagination support using cursor
 */
export async function scrapeSimplyHiredJobs(
  options: ScrapeOptions & {
    maxPages?: number;
    rateLimitDelay?: number;
  }
): Promise<SimplyHiredJob[]> {
  const { query, location, maxPages = 1, rateLimitDelay = 2000 } = options;
  const allJobs: SimplyHiredJob[] = [];
  let currentPage = 1;
  let nextCursor: string | undefined = undefined;

  // Create browser and context once for all pages
  let browser: Browser;
  let context: any;
  try {
    browser = await getBrowser();

    // Check if browser is still connected
    if (!browser.isConnected()) {
      logger.warn('Browser disconnected, recreating...');
      await closeBrowser();
      browser = await getBrowser();
    }

    context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      timezoneId: 'America/New_York',
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
      },
      // Suppress console logs and ignore HTTPS errors
      ignoreHTTPSErrors: true,
    });
  } catch (error: any) {
    logger.error({ error }, 'Error creating browser/context for pagination');
    throw error;
  }

  try {
    // Continue pagination while we have a cursor
    // maxPages: 0 = unlimited (continue until no cursor), > 0 = limit
    const hasLimit = maxPages > 0;

    while (true) {
      // Safety limit: only apply if maxPages is explicitly set (> 0)
      if (hasLimit && currentPage > maxPages) {
        logger.info({
          query,
          location,
          page: currentPage,
          maxPages,
          totalJobs: allJobs.length,
          hasNextCursor: !!nextCursor
        }, `Reached maxPages limit (${maxPages}), stopping pagination`);
        break;
      }

      try {
        const result = await fetchSimplyHiredJobsWithCursor({
          query,
          location,
          cursor: nextCursor,
          rateLimitDelay: currentPage > 1 ? rateLimitDelay : 0, // No delay for first page
          context, // Pass context to reuse it
        });

      const { jobs, cursor: newCursor } = result;

      // If no jobs returned, we've reached the end
      if (jobs.length === 0) {
        logger.info({ query, location, page: currentPage, cursor: nextCursor }, 'No more jobs found, stopping pagination');
        break;
      }

      allJobs.push(...jobs);
      nextCursor = newCursor;

      logger.info({
        query,
        location,
        page: currentPage,
        jobsInThisPage: jobs.length,
        totalJobs: allJobs.length,
        hasNextCursor: !!nextCursor,
        nextCursorPreview: nextCursor ? nextCursor.substring(0, 50) + '...' : null,
        maxPages: hasLimit ? maxPages : 'unlimited',
        willContinue: !!nextCursor && (!hasLimit || currentPage < maxPages)
      }, `Page ${currentPage} processed`);

      // If no next cursor, we've reached the last page
      if (!nextCursor) {
        logger.info({ query, location, page: currentPage, totalJobs: allJobs.length }, 'No next cursor found, reached last page');
        break;
      }

      // Check if we got fewer jobs than expected (might indicate last page)
      // But still continue if we have a cursor
      if (jobs.length < 10) {
        logger.debug({ query, location, page: currentPage, jobsCount: jobs.length }, 'Few jobs returned, but continuing if cursor available');
      }

      currentPage++;
      } catch (error: any) {
        const errorMessage = error?.message || error?.toString() || 'Unknown error';
        const errorStack = error?.stack;
        const errorName = error?.name;

        logger.error({
          error: errorMessage,
          errorName,
          errorStack,
          errorDetails: String(error),
          query,
          location,
          page: currentPage,
          hasCursor: !!nextCursor,
          cursorPreview: nextCursor ? nextCursor.substring(0, 30) + '...' : null
        }, 'Error fetching page, stopping pagination');
        break;
      }
    }
  } finally {
    // Close context after all pages are processed
    try {
      if (context) {
        await context.close();
      }
    } catch (closeError) {
      logger.debug({ closeError }, 'Error closing context');
    }
  }

  logger.info(
    { query, location, totalJobs: allJobs.length, pagesScraped: currentPage - 1 },
    'Finished scraping SimplyHired'
  );

  return allJobs;
}

/**
 * Fetch jobs with cursor and return both jobs and next cursor
 */
async function fetchSimplyHiredJobsWithCursor(
  options: ScrapeOptions
): Promise<{ jobs: SimplyHiredJob[]; cursor?: string }> {
  const { query, location = '', cursor, rateLimitDelay = 2000, context: providedContext } = options;

  const baseUrl = 'https://www.simplyhired.com';
  const params = new URLSearchParams({
    q: query,
    ...(location && { l: location }),
    ...(cursor && { cursor }),
  });

  const searchUrl = `${baseUrl}/search?${params.toString()}`;

  logger.info({
    searchUrl,
    query,
    location,
    cursor: cursor ? cursor.substring(0, 50) + '...' : 'first page',
    hasCursor: !!cursor,
    hasProvidedContext: !!providedContext,
    paramsString: params.toString()
  }, 'Fetching jobs from SimplyHired with Playwright');

  // Use provided context or create a new one
  let context = providedContext;
  let shouldCloseContext = false;

  if (!context) {
    // Create new context if not provided (for backward compatibility)
    let browser: Browser;
    try {
      browser = await getBrowser();

      // Check if browser is still connected
      if (!browser.isConnected()) {
        logger.warn('Browser disconnected, recreating...');
        await closeBrowser();
        browser = await getBrowser();
      }
    } catch (browserError) {
      logger.warn({ browserError }, 'Error getting browser, recreating...');
      await closeBrowser();
      browser = await getBrowser();
    }

    try {
      context = await browser.newContext({
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 },
        locale: 'en-US',
        timezoneId: 'America/New_York',
        extraHTTPHeaders: {
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0',
        },
        // Ignore HTTPS errors and suppress console logs
        ignoreHTTPSErrors: true,
      });
      shouldCloseContext = true; // Only close if we created it
    } catch (contextError) {
      logger.error({ contextError }, 'Error creating context, browser may be closed');
      throw contextError;
    }
  }

  const page = await context.newPage();

  // Suppress console logs (CORS errors, certificate warnings, etc.)
  // These are browser console messages that don't affect functionality
  page.on('console', (msg: any) => {
    const type = msg.type();
    const text = msg.text();

    // Ignore info/warning messages about CORS and certificates
    if (type === 'warning' || type === 'info') {
      if (
        text.includes('CORS policy') ||
        text.includes('certificate') ||
        text.includes('Error parsing certificate') ||
        text.includes('policy qualifiers') ||
        text.includes('otSDKStub') ||
        text.includes('OtAutoBlock') ||
        text.includes('one-trust') ||
        text.includes('cloudfront.net')
      ) {
        return; // Ignore these messages - they're not critical
      }
    }

    // Only log errors that are not related to CORS/certificates
    if (type === 'error' && !text.includes('CORS') && !text.includes('certificate')) {
      logger.debug({ consoleType: type, consoleText: text }, 'Browser console message');
    }
  });

  // Suppress page errors (like failed resource loads)
  page.on('pageerror', (error: any) => {
    const errorMessage = error?.message || String(error);
    // Ignore CORS and certificate errors - they're just browser warnings
    if (!errorMessage.includes('CORS') && !errorMessage.includes('certificate')) {
      logger.debug({ pageError: errorMessage }, 'Page error (non-critical)');
    }
  });

  // Suppress request failed errors for blocked resources (OneTrust scripts, etc.)
  page.on('requestfailed', (request: any) => {
    const url = request.url();
    // Ignore OneTrust/CloudFront requests that fail due to CORS - they're just cookie consent scripts
    if (url.includes('cloudfront.net') || url.includes('one-trust') || url.includes('otSDKStub') || url.includes('OtAutoBlock')) {
      return; // Ignore - these are non-critical third-party scripts
    }
    // Log other failed requests only at debug level
    logger.debug({ failedUrl: url, failure: request.failure()?.errorText }, 'Request failed (non-critical)');
  });

  try {
    // Add delay to respect rate limits
    if (rateLimitDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, rateLimitDelay));
    }

    // Navigate to search page first to establish session and get buildId
    await page.goto(searchUrl, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Wait a bit to simulate human behavior
    await page.waitForTimeout(1000 + Math.random() * 2000);

    // Extract buildId from Next.js page
    // The buildId is in the _next/static path or in script tags
    let buildId = 'm88IQrQYuHrT_Flt-A_Sa'; // Default/fallback buildId
    try {
      // Try to get buildId from page scripts or network requests
      const buildIdMatch = await page.evaluate(() => {
        // Look for buildId in script tags or window.__NEXT_DATA__
        const scripts = Array.from(document.querySelectorAll('script'));
        for (const script of scripts) {
          const content = script.textContent || '';
          const match = content.match(/_next\/static\/([^/]+)/);
          if (match) return match[1];
        }
        // Try window.__NEXT_DATA__
        if ((window as any).__NEXT_DATA__?.buildId) {
          return (window as any).__NEXT_DATA__.buildId;
        }
        return null;
      }).catch(() => null);

      if (buildIdMatch) {
        buildId = buildIdMatch;
        logger.debug({ buildId }, 'Extracted buildId from page');
      }
    } catch (e) {
      logger.debug('Could not extract buildId, using default');
    }

    // Construct the correct JSON URL using Next.js format
    const locale = 'en-US'; // Default locale, could be extracted from page if needed
    const jsonUrl = `${baseUrl}/_next/data/${buildId}/${locale}/search.json?${params.toString()}`;

    logger.debug({ jsonUrl, buildId }, 'Using Next.js JSON endpoint');

    // Fetch JSON data using the established session
    let jobs: SimplyHiredJob[] = [];
    let nextPageCursor: string | undefined = undefined;

    try {
      const response = await page.request.get(jsonUrl, {
        headers: {
          Accept: 'application/json',
          Referer: searchUrl,
        },
      });

      if (!response.ok()) {
        throw new Error(`HTTP error! status: ${response.status()}`);
      }

      const data: SimplyHiredResponse = await response.json();
      jobs = data.pageProps?.jobs || [];

      // Merge viewJobData into jobs if available (for single job view)
      // In search results, viewJobData may contain details for highlighted job
      if (data.pageProps?.viewJobData && jobs.length > 0) {
        // Try to match viewJobData with first job by jobKey
        const viewData = data.pageProps.viewJobData;
        const matchingJob = jobs.find(j => j.jobKey === viewData.jobKey);
        if (matchingJob) {
          // Merge additional fields from viewJobData
          Object.assign(matchingJob, {
            jobDescriptionHtml: viewData.jobDescriptionHtml || matchingJob.jobDescriptionHtml,
            datePublished: viewData.datePublished || matchingJob.datePublished,
            dateOnIndeed: viewData.dateOnIndeed || matchingJob.dateOnIndeed,
            qualifications: viewData.qualifications || matchingJob.qualifications,
            compensation: viewData.compensation || matchingJob.compensation,
            employerName: viewData.employerName || matchingJob.employerName,
            employerCompanyPageUrl: viewData.employerCompanyPageUrl || matchingJob.employerCompanyPageUrl,
            expired: viewData.expired !== undefined ? viewData.expired : matchingJob.expired,
            city: viewData.city || matchingJob.city,
            state: viewData.state || matchingJob.state,
            latitude: viewData.latitude || matchingJob.latitude,
            longitude: viewData.longitude || matchingJob.longitude,
          });
        }
      }

      // Extract next cursor from pageCursors
      // If we're on page N, the cursor for page N+1 might not be in pageCursors
      // pageCursors contains cursors for OTHER pages (not the current one)
      const currentPage = data.pageProps?.currentPageNumber || 1;
      const nextPageNumber = currentPage + 1;
      const pageCursors = data.pageProps?.pageCursors || {};
      const totalPages = data.pageProps?.totalPages;

      // Log pageCursors structure for debugging
      logger.info({
        currentPage,
        nextPageNumber,
        totalPages,
        pageCursorsKeys: Object.keys(pageCursors).map(Number).sort((a, b) => a - b),
        hasPageCursors: !!data.pageProps?.pageCursors,
        pageCursorsCount: Object.keys(pageCursors).length
      }, 'Extracting cursor from pageCursors');

      // Try to get cursor for next page (N+1)
      nextPageCursor = pageCursors[nextPageNumber.toString()];

      // If not found, try to find the first available page after current page
      if (!nextPageCursor && Object.keys(pageCursors).length > 0) {
        const availablePages = Object.keys(pageCursors).map(Number).sort((a, b) => a - b);
        const nextAvailablePage = availablePages.find(page => page > currentPage);
        if (nextAvailablePage) {
          nextPageCursor = pageCursors[nextAvailablePage.toString()];
          logger.info({
            nextAvailablePage,
            currentPage,
            cursorPreview: nextPageCursor.substring(0, 50) + '...'
          }, 'Using next available cursor from pageCursors (not sequential)');
        }
      }

      logger.info({
        currentPage,
        nextPageNumber,
        totalPages,
        foundNextCursor: !!nextPageCursor,
        cursorPreview: nextPageCursor ? nextPageCursor.substring(0, 50) + '...' : null,
        availableCursors: Object.keys(pageCursors).map(Number).sort((a, b) => a - b)
      }, 'Cursor extraction result');

      if (jobs.length > 0) {
        logger.info(
          {
            query,
            location,
            cursor: cursor || 'first page',
            jobCount: jobs.length,
            currentPage,
            hasNextCursor: !!nextPageCursor,
            nextPageNumber: nextPageCursor ? nextPageNumber : null
          },
          'Successfully fetched jobs from JSON endpoint'
        );
      } else {
        logger.warn(
          { query, location, cursor: cursor || 'first page' },
          'JSON endpoint returned empty jobs array'
        );
      }
    } catch (jsonError: any) {
      const errorMessage = jsonError?.message || jsonError?.toString() || 'Unknown error';
      const errorStack = jsonError?.stack;
      const statusCode = jsonError?.response?.status || jsonError?.status || jsonError?.statusCode;

      logger.error({
        errorMessage,
        errorStack,
        statusCode,
        jsonUrl,
        searchUrl,
        hasCursor: !!cursor,
        cursorPreview: cursor ? cursor.substring(0, 30) + '...' : null
      }, 'Error fetching JSON from SimplyHired');

      throw new Error(`Failed to fetch JSON: ${errorMessage}${statusCode ? ` (HTTP ${statusCode})` : ''}`);
    }

    return { jobs, cursor: nextPageCursor };
  } catch (error: any) {
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    const errorStack = error?.stack;
    const errorName = error?.name;

    logger.error({
      error: errorMessage,
      errorName,
      errorStack,
      errorDetails: String(error),
      searchUrl,
      query,
      location,
      hasCursor: !!cursor,
      cursorPreview: cursor ? cursor.substring(0, 30) + '...' : null
    }, 'Error fetching jobs from SimplyHired');
    throw error;
  } finally {
    // Only close context if we created it (not if it was provided)
    if (shouldCloseContext && context) {
      try {
        await context.close();
      } catch (closeError) {
        logger.debug({ closeError }, 'Error closing context');
      }
    }
    // Always close the page
    try {
      if (page) {
        await page.close();
      }
    } catch (closeError) {
      logger.debug({ closeError }, 'Error closing page');
    }
  }
}

/**
 * Fetch jobs from SimplyHired JSON API using Playwright to avoid blocking
 * Uses only JSON endpoint - no HTML scraping
 * This is a wrapper that maintains backward compatibility
 */
export async function fetchSimplyHiredJobs(
  options: ScrapeOptions
): Promise<SimplyHiredJob[]> {
  const result = await fetchSimplyHiredJobsWithCursor(options);
  return result.jobs;
}
