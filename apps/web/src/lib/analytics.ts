// GA4 Event Tracking Utility

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

type GAEventParams = Record<string, string | number | boolean | undefined>;

/**
 * Track a GA4 event
 */
export function trackEvent(eventName: string, params?: GAEventParams): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

// ============================================
// CTA Events
// ============================================

export function trackCTAClick(ctaName: string, location: string, destination?: string): void {
  trackEvent('cta_click', {
    cta_name: ctaName,
    location: location,
    destination: destination,
  });
}

export function trackToolsCTAClick(location: string): void {
  trackCTAClick('tools_page', location, '/ferramentas');
}

export function trackSimulatorCTAClick(location: string): void {
  trackCTAClick('loss_income_simulator', location, '/ferramentas/simulador-perda-renda');
}

// ============================================
// Tool Usage Events
// ============================================

export function trackToolStart(toolName: string): void {
  trackEvent('tool_start', {
    tool_name: toolName,
  });
}

export function trackSimulatorView(): void {
  trackEvent('simulator_view', {
    tool_name: 'loss_income_simulator',
  });
}

export function trackToolComplete(toolName: string, result?: Record<string, unknown>): void {
  trackEvent('tool_complete', {
    tool_name: toolName,
    ...result,
  });
}

export function trackSimulatorCalculation(params: {
  monthlyIncome: number;
  daysOff: number;
  hasInsurance: boolean;
  estimatedLoss: number;
}): void {
  trackEvent('simulator_calculation', {
    tool_name: 'loss_income_simulator',
    monthly_income_range: getIncomeRange(params.monthlyIncome),
    days_off: params.daysOff,
    has_insurance: params.hasInsurance,
    estimated_loss: params.estimatedLoss,
  });
}

// ============================================
// Article Events
// ============================================

export function trackArticleScroll(articleSlug: string, percentage: number): void {
  trackEvent('article_scroll', {
    article_slug: articleSlug,
    scroll_percentage: percentage,
  });
}

export function trackRelatedArticleClick(fromArticle: string, toArticle: string): void {
  trackEvent('related_article_click', {
    from_article: fromArticle,
    to_article: toArticle,
  });
}

// ============================================
// Helpers
// ============================================

function getIncomeRange(income: number): string {
  if (income < 2000) return '0-2000';
  if (income < 4000) return '2000-4000';
  if (income < 6000) return '4000-6000';
  if (income < 10000) return '6000-10000';
  return '10000+';
}

