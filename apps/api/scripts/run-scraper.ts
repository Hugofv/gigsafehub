#!/usr/bin/env tsx

/**
 * Script para executar o scraper SimplyHired manualmente
 *
 * Uso: pnpm tsx scripts/run-scraper.ts
 */

import { simplyHiredScraperJob } from '../src/workers/jobs/simplyHiredScraper';
import { closeBrowser } from '../src/services/scraper/simplyHired';
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

async function main() {
  logger.info('🚀 Iniciando scraper SimplyHired...');

  try {
    await simplyHiredScraperJob();
    logger.info('✅ Scraper executado com sucesso!');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, '❌ Erro ao executar scraper');
    process.exit(1);
  } finally {
    // Ensure browser is closed
    await closeBrowser();
  }
}

main();
