import { ProviderAdapter, LeadPayload, QuoteResponse } from '../types';

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class MockProviderAdapter implements ProviderAdapter {
  readonly name: string;
  readonly timeout = 15000;
  readonly maxRetries = 0;
  private failureRate: number;

  constructor(name: string, failureRate = 0.1) {
    this.name = name;
    this.failureRate = failureRate;
  }

  async fetchQuote(payload: LeadPayload): Promise<QuoteResponse> {
    const delay = randomBetween(1000, 4000);
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (Math.random() < this.failureRate) {
      throw new Error(`${this.name} quote unavailable for this profile`);
    }

    const basePremium = payload.country === 'BR' ? randomBetween(150, 500) : randomBetween(80, 250);
    const accidentSurcharge = payload.driver.accidentsLast5Years * (payload.country === 'BR' ? 40 : 25);
    const violationSurcharge = payload.driver.violationsLast5Years * (payload.country === 'BR' ? 25 : 15);
    const fullCoverageAdd = payload.coverage.wantsFullCoverage ? (payload.country === 'BR' ? 80 : 50) : 0;

    const monthlyPremium = basePremium + accidentSurcharge + violationSurcharge + fullCoverageAdd;
    const annualPremium = monthlyPremium * 11;

    const deductible = payload.coverage.deductiblePreference || (payload.country === 'BR' ? 1000 : 500);

    const hasGap = Math.random() > 0.4;
    const hasRoadside = Math.random() > 0.3;

    const highlights: string[] = [];
    if (hasGap) highlights.push(payload.country === 'BR' ? 'Cobertura gap inclusa' : 'Rideshare gap coverage included');
    if (hasRoadside) highlights.push(payload.country === 'BR' ? 'Assistência 24h' : '24/7 roadside assistance');
    if (payload.driver.accidentsLast5Years === 0) {
      highlights.push(payload.country === 'BR' ? 'Desconto bom motorista' : 'Good driver discount');
    }

    return {
      monthlyPremium: Math.round(monthlyPremium * 100) / 100,
      annualPremium: Math.round(annualPremium * 100) / 100,
      coverageSummary: {
        liability: payload.coverage.liabilityLimit,
        collision: payload.coverage.wantsFullCoverage || Math.random() > 0.3,
        comprehensive: payload.coverage.wantsFullCoverage || Math.random() > 0.4,
        deductible,
        gap: hasGap,
        roadside: hasRoadside,
      },
      highlights,
      providerUrl: `https://example.com/quote/${this.name.toLowerCase().replace(/\s+/g, '-')}`,
    };
  }
}
