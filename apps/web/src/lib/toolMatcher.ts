/**
 * Tool Matcher - Automatically matches articles to relevant tools
 * based on content analysis using keywords
 */

export interface ToolInfo {
  id: string;
  slug: {
    en: string;
    pt: string;
  };
  name: {
    en: string;
    pt: string;
  };
  description: {
    en: string;
    pt: string;
  };
  cta: {
    en: string;
    pt: string;
  };
  icon: 'calculator' | 'chart' | 'currency' | 'search' | 'flame' | 'warning' | 'budget';
  gradient: string;
  keywords: string[];
}

// Tool definitions with keywords for matching
export const TOOLS: ToolInfo[] = [
  {
    id: 'daily-profit-calculator',
    slug: { en: 'daily-profit-calculator', pt: 'calculadora-lucro-diario' },
    name: {
      en: 'Daily Real Profit Calculator',
      pt: 'Calculadora de Lucro Real Diário'
    },
    description: {
      en: 'Discover how much you really earn per hour after all costs.',
      pt: 'Descubra quanto você realmente ganha por hora após todos os custos.'
    },
    cta: { en: 'Calculate My Profit', pt: 'Calcular Meu Lucro' },
    icon: 'currency',
    gradient: 'from-emerald-500 to-teal-500',
    keywords: [
      'lucro', 'profit', 'ganho', 'earning', 'faturamento', 'revenue',
      'quanto ganha', 'how much earn', 'salário', 'salary', 'hora',
      'hourly', 'diário', 'daily', 'real', 'líquido', 'net'
    ],
  },
  {
    id: 'hidden-costs-calculator',
    slug: { en: 'hidden-costs-calculator', pt: 'calculadora-custos-ocultos' },
    name: {
      en: 'Hidden Costs Calculator',
      pt: 'Calculadora de Custos Ocultos'
    },
    description: {
      en: 'Discover hidden costs like depreciation and wear you might be ignoring.',
      pt: 'Descubra custos ocultos como depreciação e desgaste que você pode estar ignorando.'
    },
    cta: { en: 'Find Hidden Costs', pt: 'Descobrir Custos Ocultos' },
    icon: 'search',
    gradient: 'from-rose-500 to-pink-500',
    keywords: [
      'custo', 'cost', 'gasto', 'expense', 'despesa', 'escondido', 'hidden',
      'oculto', 'depreciação', 'depreciation', 'manutenção', 'maintenance',
      'desgaste', 'wear', 'invisível', 'invisible', 'ignorando', 'overlooking'
    ],
  },
  {
    id: 'cost-per-trip-calculator',
    slug: { en: 'cost-per-trip-calculator', pt: 'calculadora-custo-corrida' },
    name: {
      en: 'Cost per Trip Calculator',
      pt: 'Calculadora de Custo por Corrida'
    },
    description: {
      en: 'Find out if each trip is worth accepting based on real costs.',
      pt: 'Descubra se cada corrida vale a pena aceitar baseado nos custos reais.'
    },
    cta: { en: 'Calculate Trip Cost', pt: 'Calcular Custo da Corrida' },
    icon: 'calculator',
    gradient: 'from-cyan-500 to-teal-500',
    keywords: [
      'corrida', 'trip', 'viagem', 'ride', 'aceitar', 'accept', 'vale a pena',
      'worth', 'recusar', 'decline', 'distância', 'distance', 'km', 'quilômetro',
      'mile', 'tarifa', 'fare', 'preço', 'price'
    ],
  },
  {
    id: 'monthly-goal-simulator',
    slug: { en: 'monthly-goal-simulator', pt: 'simulador-meta-mensal' },
    name: {
      en: 'Monthly Goal Simulator',
      pt: 'Simulador de Meta Mensal'
    },
    description: {
      en: 'Set your income goal and discover how many hours and trips you need.',
      pt: 'Defina sua meta de renda e descubra quantas horas e corridas você precisa.'
    },
    cta: { en: 'Plan My Goal', pt: 'Planejar Minha Meta' },
    icon: 'chart',
    gradient: 'from-purple-500 to-violet-500',
    keywords: [
      'meta', 'goal', 'objetivo', 'target', 'quanto preciso', 'how much need',
      'mensal', 'monthly', 'planejar', 'plan', 'planejamento', 'planning',
      'atingir', 'reach', 'alcançar', 'achieve'
    ],
  },
  {
    id: 'fuel-calculator',
    slug: { en: 'fuel-calculator', pt: 'calculadora-combustivel' },
    name: {
      en: 'Fuel Calculator',
      pt: 'Calculadora de Combustível'
    },
    description: {
      en: 'Compare gas vs ethanol and find out which is more economical.',
      pt: 'Compare gasolina vs etanol e descubra qual é mais econômico.'
    },
    cta: { en: 'Calculate Fuel Cost', pt: 'Calcular Combustível' },
    icon: 'flame',
    gradient: 'from-amber-500 to-orange-500',
    keywords: [
      'combustível', 'fuel', 'gasolina', 'gas', 'gasoline', 'etanol', 'ethanol',
      'álcool', 'alcohol', 'abastecimento', 'refuel', 'posto', 'station',
      'consumo', 'consumption', 'km/l', 'mpg'
    ],
  },
  {
    id: 'driver-budget-simulator',
    slug: { en: 'driver-budget-simulator', pt: 'simulador-orcamento' },
    name: {
      en: 'Complete Budget Simulator',
      pt: 'Simulador de Orçamento Completo'
    },
    description: {
      en: 'Build your complete budget and know how much you need to earn.',
      pt: 'Monte seu orçamento completo e saiba quanto você precisa faturar.'
    },
    cta: { en: 'Build My Budget', pt: 'Montar Meu Orçamento' },
    icon: 'budget',
    gradient: 'from-violet-500 to-purple-500',
    keywords: [
      'orçamento', 'budget', 'conta', 'bill', 'quebra', 'broke', 'sobreviver',
      'survive', 'financeiro', 'financial', 'pessoal', 'personal', 'fixo',
      'fixed', 'variável', 'variable', 'completo', 'complete'
    ],
  },
  {
    id: 'break-even-calculator',
    slug: { en: 'break-even-calculator', pt: 'calculadora-ponto-equilibrio' },
    name: {
      en: 'Break-Even Calculator',
      pt: 'Calculadora de Ponto de Equilíbrio'
    },
    description: {
      en: 'Find out how much revenue you need to cover all costs.',
      pt: 'Descubra quanto você precisa faturar para cobrir todos os custos.'
    },
    cta: { en: 'Find Break-Even', pt: 'Calcular Ponto de Equilíbrio' },
    icon: 'chart',
    gradient: 'from-blue-500 to-indigo-500',
    keywords: [
      'equilíbrio', 'break-even', 'breakeven', 'cobrir custos', 'cover costs',
      'ponto', 'point', 'mínimo', 'minimum', 'empatar', 'even', 'zero a zero',
      'lucrar', 'profit'
    ],
  },
  {
    id: 'loss-income-simulator',
    slug: { en: 'loss-income-simulator', pt: 'simulador-perda-renda' },
    name: {
      en: 'Loss Income Simulator',
      pt: 'Simulador de Perda de Renda'
    },
    description: {
      en: 'Calculate how much income you could lose without proper insurance.',
      pt: 'Calcule quanto de renda você poderia perder sem seguro adequado.'
    },
    cta: { en: 'Simulate Now', pt: 'Simular Agora' },
    icon: 'warning',
    gradient: 'from-orange-500 to-red-500',
    keywords: [
      'seguro', 'insurance', 'proteção', 'protection', 'risco', 'risk',
      'perda', 'loss', 'acidente', 'accident', 'doença', 'illness', 'sick',
      'afastado', 'unable to work', 'incapacidade', 'disability'
    ],
  },
];

/**
 * Analyzes article content and returns matching tools (max 2)
 * @param title - Article title
 * @param content - Article content (HTML or plain text)
 * @param excerpt - Article excerpt
 * @returns Array of matched tools (max 2)
 */
export function matchToolsToArticle(
  title: string,
  content: string,
  excerpt?: string
): ToolInfo[] {
  // Combine all text for analysis (lowercase for matching)
  const fullText = `${title} ${excerpt || ''} ${content}`.toLowerCase();

  // Remove HTML tags for cleaner matching
  const cleanText = fullText.replace(/<[^>]*>/g, ' ');

  // Score each tool based on keyword matches
  const toolScores: { tool: ToolInfo; score: number }[] = TOOLS.map((tool) => {
    let score = 0;

    for (const keyword of tool.keywords) {
      const keywordLower = keyword.toLowerCase();

      // Count occurrences of keyword
      const regex = new RegExp(`\\b${keywordLower}\\b`, 'gi');
      const matches = cleanText.match(regex);

      if (matches) {
        // Weight: title matches are worth more
        const titleMatches = title.toLowerCase().match(regex);
        score += matches.length;
        if (titleMatches) {
          score += titleMatches.length * 3; // Title matches worth 3x
        }
      }
    }

    return { tool, score };
  });

  // Sort by score and get top 2
  const sortedTools = toolScores
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((t) => t.tool);

  // If no matches, return default tool (Loss Income Simulator)
  if (sortedTools.length === 0) {
    return [TOOLS.find((t) => t.id === 'loss-income-simulator')!];
  }

  return sortedTools;
}

/**
 * Gets tool URL based on locale
 */
export function getToolUrl(tool: ToolInfo, locale: string): string {
  const basePath = locale === 'pt-BR' ? 'ferramentas' : 'tools';
  const slug = locale === 'pt-BR' ? tool.slug.pt : tool.slug.en;
  return `/${locale}/${basePath}/${slug}`;
}

/**
 * Gets localized tool name
 */
export function getToolName(tool: ToolInfo, locale: string): string {
  return locale === 'pt-BR' ? tool.name.pt : tool.name.en;
}

/**
 * Gets localized tool description
 */
export function getToolDescription(tool: ToolInfo, locale: string): string {
  return locale === 'pt-BR' ? tool.description.pt : tool.description.en;
}

/**
 * Gets localized CTA text
 */
export function getToolCTA(tool: ToolInfo, locale: string): string {
  return locale === 'pt-BR' ? tool.cta.pt : tool.cta.en;
}

