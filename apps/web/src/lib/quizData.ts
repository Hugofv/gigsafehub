/**
 * Quiz definitions: questions, options, and result logic.
 * Used by QuizEngine to render and compute results.
 * Lives in lib/ to avoid Webpack issues with dynamic route paths ([locale]).
 */

export type QuizSlug = 'risco-burnout' | 'proposta-valor-unica';

export interface QuizOption {
  id: string;
  label: string;
  labelEn?: string;
  /** For score-based results: points added when selected */
  score?: number;
  /** For outcome-based results: result key or category slug */
  resultKey?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionEn?: string;
  options: QuizOption[];
  /** Optional: "Why this matters" for EEAT (1 sentence) */
  explanationShort?: string;
  explanationShortEn?: string;
}

export interface KeyFactor {
  id: string;
  label: string;
  labelEn?: string;
}

export interface QuizResultCta {
  label: string;
  labelEn?: string;
  /** Path without locale prefix (pt-BR), e.g. /ferramentas/simulador-perda-renda */
  path: string;
  /** Path for en-US when different, e.g. /tools/loss-income-simulator */
  pathEn?: string;
}

export interface QuizResultVariant {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  ctas: QuizResultCta[];
  /** 2-3 sentences: how we interpret this result (EEAT) */
  methodologyShort?: string;
  methodologyShortEn?: string;
  /** Fallback factors when answers not available (e.g. shared result URL) */
  keyFactorsFallback?: KeyFactor[];
  /** Article slugs for "Leia em seguida" (fetched by page) */
  recommendedArticleSlugs?: string[];
}

export interface QuizDefinition {
  slug: QuizSlug;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  estimatedMinutes: number;
  questions: QuizQuestion[];
  /** Score ranges [min, max] -> result id (score-based quizzes use this) */
  scoreRanges?: { min: number; max: number; resultId: string }[];
  /** Result variants by id (score-based: risco-burnout, proposta-valor-unica) */
  results: QuizResultVariant[];
  /** Disclaimer for whole quiz (EEAT trust) */
  disclaimer?: string;
  disclaimerEn?: string;
  /** Optional link to "How we calculate" section or page */
  methodologyUrl?: string;
}

// ========== CALCULADOR DE RISCO DE BURNOUT ==========
/** Answer -> KeyFactor mapping for risco-burnout */
const riscoBurnoutFactorMap: Record<string, KeyFactor> = {
  'hours.50plus': { id: 'hours_50plus', label: 'Mais de 50h/semana trabalhando', labelEn: 'Working more than 50 hours/week' },
  'hours.40to50': { id: 'hours_40to50', label: 'Entre 40 e 50h por semana', labelEn: '40 to 50 hours per week' },
  'hours.30to40': { id: 'hours_30to40', label: 'Entre 30 e 40h por semana', labelEn: '30 to 40 hours per week' },
  'hours.under30': { id: 'hours_under30', label: 'Menos de 30h por semana', labelEn: 'Under 30 hours per week' },
  'rest.never': { id: 'rest_never', label: 'Quase nunca tira dias de folga', labelEn: 'Rarely or never takes days off' },
  'rest.sometimes': { id: 'rest_sometimes', label: 'Às vezes tira folga, mas irregular', labelEn: 'Sometimes takes time off, but irregularly' },
  'rest.regular': { id: 'rest_regular', label: 'Folga regular (pelo menos 1 dia/semana)', labelEn: 'Regular rest (at least 1 day/week)' },
  'sleep.poor': { id: 'sleep_poor', label: 'Sono ruim ou insuficiente (menos de 6h)', labelEn: 'Poor or insufficient sleep (under 6h)' },
  'sleep.ok': { id: 'sleep_ok', label: 'Sono razoável (6–7h)', labelEn: 'Reasonable sleep (6–7h)' },
  'sleep.good': { id: 'sleep_good', label: 'Bom sono (7h ou mais)', labelEn: 'Good sleep (7h or more)' },
  'boundaries.no': { id: 'boundaries_no', label: 'Dificuldade em dizer não a demandas', labelEn: 'Difficulty saying no to demands' },
  'boundaries.sometimes': { id: 'boundaries_sometimes', label: 'Às vezes estabelece limites', labelEn: 'Sometimes sets boundaries' },
  'boundaries.yes': { id: 'boundaries_yes', label: 'Consegue estabelecer limites claros', labelEn: 'Able to set clear boundaries' },
  'pressure.high': { id: 'pressure_high', label: 'Alta pressão financeira (depende de cada gig)', labelEn: 'High financial pressure (depends on each gig)' },
  'pressure.medium': { id: 'pressure_medium', label: 'Pressão financeira moderada', labelEn: 'Moderate financial pressure' },
  'pressure.low': { id: 'pressure_low', label: 'Baixa pressão (reserva ou renda estável)', labelEn: 'Low pressure (reserve or stable income)' },
  'support.low': { id: 'support_low', label: 'Pouco ou nenhum suporte emocional/prático', labelEn: 'Little or no emotional/practical support' },
  'support.some': { id: 'support_some', label: 'Algum suporte (família, amigos)', labelEn: 'Some support (family, friends)' },
  'support.strong': { id: 'support_strong', label: 'Rede de suporte forte', labelEn: 'Strong support network' },
};

const quizRiscoBurnout: QuizDefinition = {
  slug: 'risco-burnout',
  title: 'Calculador de Risco de Burnout',
  titleEn: 'Burnout Risk Calculator',
  description: 'Em poucos minutos, avalie sinais de sobrecarga e exaustão e receba orientações práticas para cuidar da sua saúde e do seu trabalho.',
  descriptionEn: 'In a few minutes, assess signs of overload and exhaustion and get practical guidance to take care of your health and your work.',
  estimatedMinutes: 3,
  disclaimer: 'Este quiz é apenas educativo e de autoconhecimento. Não substitui avaliação médica ou psicológica. Se você está em sofrimento, procure um profissional de saúde.',
  disclaimerEn: 'This quiz is for educational and self-awareness purposes only. It does not replace medical or psychological evaluation. If you are in distress, seek a healthcare professional.',
  methodologyUrl: '/faq',
  questions: [
    {
      id: 'hours',
      question: 'Quantas horas por semana você costuma trabalhar (em média)?',
      questionEn: 'How many hours per week do you usually work (on average)?',
      explanationShort: 'Trabalhar consistentemente mais de 40–50h por semana aumenta o risco de exaustão, especialmente sem descanso adequado.',
      explanationShortEn: 'Consistently working more than 40–50 hours per week increases exhaustion risk, especially without adequate rest.',
      options: [
        { id: '50plus', label: 'Mais de 50 horas', labelEn: 'More than 50 hours', score: 3 },
        { id: '40to50', label: 'Entre 40 e 50 horas', labelEn: '40 to 50 hours', score: 2 },
        { id: '30to40', label: 'Entre 30 e 40 horas', labelEn: '30 to 40 hours', score: 1 },
        { id: 'under30', label: 'Menos de 30 horas', labelEn: 'Under 30 hours', score: 0 },
      ],
    },
    {
      id: 'rest',
      question: 'Com que frequência você tira dias de folga (sem trabalhar)?',
      questionEn: 'How often do you take days off (without working)?',
      explanationShort: 'Descanso regular é um dos principais fatores de proteção contra burnout; folgas irregulares ou inexistentes aumentam o risco.',
      explanationShortEn: 'Regular rest is one of the main protective factors against burnout; irregular or no time off increases risk.',
      options: [
        { id: 'never', label: 'Quase nunca ou nunca', labelEn: 'Rarely or never', score: 3 },
        { id: 'sometimes', label: 'Às vezes, mas de forma irregular', labelEn: 'Sometimes, but irregularly', score: 2 },
        { id: 'regular', label: 'Pelo menos um dia por semana', labelEn: 'At least one day per week', score: 0 },
      ],
    },
    {
      id: 'sleep',
      question: 'Como está a qualidade e a quantidade do seu sono?',
      questionEn: 'How is the quality and quantity of your sleep?',
      explanationShort: 'Sono insuficiente ou de má qualidade está associado a maior estresse e menor recuperação, aumentando o risco de burnout.',
      explanationShortEn: 'Insufficient or poor-quality sleep is associated with higher stress and less recovery, increasing burnout risk.',
      options: [
        { id: 'poor', label: 'Ruim ou menos de 6 horas por noite', labelEn: 'Poor or under 6 hours per night', score: 3 },
        { id: 'ok', label: 'Razoável (cerca de 6–7 horas)', labelEn: 'Reasonable (around 6–7 hours)', score: 1 },
        { id: 'good', label: 'Bom (7 horas ou mais)', labelEn: 'Good (7 hours or more)', score: 0 },
      ],
    },
    {
      id: 'boundaries',
      question: 'Você consegue dizer não ou adiar demandas quando está no limite?',
      questionEn: 'Can you say no or postpone demands when you\'re at your limit?',
      explanationShort: 'Limites claros entre trabalho e vida pessoal reduzem a sensação de descontrole e ajudam a prevenir esgotamento.',
      explanationShortEn: 'Clear boundaries between work and personal life reduce the feeling of loss of control and help prevent burnout.',
      options: [
        { id: 'no', label: 'Quase nunca; aceito tudo que vem', labelEn: 'Rarely; I take on almost everything', score: 3 },
        { id: 'sometimes', label: 'Às vezes, mas é difícil', labelEn: 'Sometimes, but it\'s hard', score: 2 },
        { id: 'yes', label: 'Sim, consigo priorizar e recusar', labelEn: 'Yes, I can prioritize and decline', score: 0 },
      ],
    },
    {
      id: 'pressure',
      question: 'Como você descreveria a pressão financeira no seu dia a dia (depender de cada corrida/entrega/projeto)?',
      questionEn: 'How would you describe the financial pressure in your daily life (relying on each trip/delivery/project)?',
      explanationShort: 'Pressão financeira alta aumenta o estresse crônico e a dificuldade de parar para descansar, elevando o risco de burnout.',
      explanationShortEn: 'High financial pressure increases chronic stress and the difficulty of stopping to rest, raising burnout risk.',
      options: [
        { id: 'high', label: 'Alta — preciso trabalhar o máximo possível', labelEn: 'High — I need to work as much as possible', score: 3 },
        { id: 'medium', label: 'Moderada — consigo respirar um pouco', labelEn: 'Moderate — I can breathe a little', score: 2 },
        { id: 'low', label: 'Baixa — tenho reserva ou renda mais estável', labelEn: 'Low — I have savings or more stable income', score: 0 },
      ],
    },
    {
      id: 'support',
      question: 'Você tem alguém (família, amigos, rede) com quem contar para suporte emocional ou prático?',
      questionEn: 'Do you have someone (family, friends, network) you can count on for emotional or practical support?',
      explanationShort: 'Rede de suporte é um fator de proteção importante; a falta dela pode aumentar a sensação de sobrecarga e isolamento.',
      explanationShortEn: 'Support network is an important protective factor; lack of it can increase feelings of overload and isolation.',
      options: [
        { id: 'low', label: 'Pouco ou nenhum', labelEn: 'Little or none', score: 3 },
        { id: 'some', label: 'Algumas pessoas', labelEn: 'A few people', score: 1 },
        { id: 'strong', label: 'Sim, uma rede em quem confio', labelEn: 'Yes, a network I trust', score: 0 },
      ],
    },
  ],
  scoreRanges: [
    { min: 0, max: 4, resultId: 'low' },
    { min: 5, max: 10, resultId: 'medium' },
    { min: 11, max: 18, resultId: 'high' },
  ],
  results: [
    {
      id: 'low',
      title: 'Seu risco de burnout parece baixo',
      titleEn: 'Your burnout risk appears low',
      description: 'Você tende a ter hábitos mais equilibrados: descanso, sono e limites razoáveis. Manter esses hábitos e continuar priorizando sua saúde ajuda a prevenir o esgotamento no longo prazo.',
      descriptionEn: 'You tend to have more balanced habits: rest, sleep, and reasonable boundaries. Keeping these habits and continuing to prioritize your health helps prevent burnout in the long run.',
      methodologyShort: 'O resultado considera fatores como horas de trabalho, descanso, sono, limites, pressão financeira e rede de suporte. As faixas (baixo/médio/alto) seguem indicadores comuns de risco de burnout na literatura de saúde ocupacional. O quiz é apenas educativo.',
      methodologyShortEn: 'The result considers factors such as working hours, rest, sleep, boundaries, financial pressure, and support network. The bands (low/medium/high) follow common burnout risk indicators in occupational health literature. This quiz is for educational purposes only.',
      keyFactorsFallback: [
        { id: 'balance_ok', label: 'Equilíbrio entre trabalho e descanso', labelEn: 'Balance between work and rest' },
        { id: 'support_ok', label: 'Rede de suporte presente', labelEn: 'Support network present' },
      ],
      recommendedArticleSlugs: [],
      ctas: [
        { label: 'Simulador de Perda de Renda', labelEn: 'Loss Income Simulator', path: '/ferramentas/simulador-perda-renda', pathEn: '/tools/loss-income-simulator' },
        { label: 'Guias e artigos', labelEn: 'Guides and articles', path: '/articles' },
      ],
    },
    {
      id: 'medium',
      title: 'Seu risco de burnout é moderado',
      titleEn: 'Your burnout risk is moderate',
      description: 'Alguns fatores — como muitas horas, pouco descanso ou pressão financeira — podem estar pesando. Pequenas mudanças (folgas regulares, sono, dizer não quando necessário) podem reduzir o risco.',
      descriptionEn: 'Some factors — such as long hours, little rest, or financial pressure — may be weighing on you. Small changes (regular time off, sleep, saying no when needed) can reduce risk.',
      methodologyShort: 'O resultado considera horas de trabalho, descanso, sono, limites, pressão financeira e suporte. As faixas seguem indicadores de risco de burnout. O quiz é apenas educativo e não substitui avaliação profissional.',
      methodologyShortEn: 'The result considers working hours, rest, sleep, boundaries, financial pressure, and support. The bands follow burnout risk indicators. This quiz is for educational purposes only and does not replace professional evaluation.',
      keyFactorsFallback: [
        { id: 'hours_or_rest', label: 'Muitas horas ou pouco descanso', labelEn: 'Long hours or little rest' },
        { id: 'pressure_or_support', label: 'Pressão financeira ou pouco suporte', labelEn: 'Financial pressure or little support' },
      ],
      recommendedArticleSlugs: [],
      ctas: [
        { label: 'Simulador de Orçamento', labelEn: 'Budget Simulator', path: '/ferramentas/simulador-orcamento', pathEn: '/tools/driver-budget-simulator' },
        { label: 'Calculadora de Lucro Real', labelEn: 'Real Profit Calculator', path: '/ferramentas/calculadora-lucro-diario', pathEn: '/tools/daily-profit-calculator' },
        { label: 'Guias e artigos', labelEn: 'Guides and articles', path: '/articles' },
      ],
    },
    {
      id: 'high',
      title: 'Seu risco de burnout parece alto',
      titleEn: 'Your burnout risk appears high',
      description: 'Vários sinais indicam sobrecarga e risco de esgotamento: muitas horas, pouco descanso ou sono, dificuldade em estabelecer limites ou pouca rede de suporte. Recomendamos priorizar descanso, sono e, se possível, buscar apoio (amigos, família ou profissional de saúde) para não chegar ao limite.',
      descriptionEn: 'Several signs point to overload and burnout risk: long hours, little rest or sleep, difficulty setting boundaries, or a weak support network. We recommend prioritizing rest, sleep, and, if possible, seeking support (friends, family, or a healthcare professional) so you don\'t push past your limits.',
      methodologyShort: 'O resultado usa fatores como horas trabalhadas, folga, sono, limites, pressão financeira e rede de suporte. A faixa "alto" indica múltiplos fatores de risco. O quiz é educativo; procure um profissional de saúde se estiver em sofrimento.',
      methodologyShortEn: 'The result uses factors such as hours worked, time off, sleep, boundaries, financial pressure, and support network. The "high" band indicates multiple risk factors. This quiz is educational; seek a healthcare professional if you are in distress.',
      keyFactorsFallback: [
        { id: 'hours_high', label: 'Muitas horas e pouco descanso', labelEn: 'Long hours and little rest' },
        { id: 'sleep_or_boundaries', label: 'Sono ruim ou limites frágeis', labelEn: 'Poor sleep or fragile boundaries' },
        { id: 'pressure_support', label: 'Alta pressão ou pouco suporte', labelEn: 'High pressure or little support' },
      ],
      recommendedArticleSlugs: [],
      ctas: [
        { label: 'Simulador de Perda de Renda', labelEn: 'Loss Income Simulator', path: '/ferramentas/simulador-perda-renda', pathEn: '/tools/loss-income-simulator' },
        { label: 'FAQ e dúvidas', labelEn: 'FAQ', path: '/faq', pathEn: '/faq' },
        { label: 'Guias e artigos', labelEn: 'Guides and articles', path: '/articles' },
      ],
    },
  ],
};

// ========== IDENTIFICADOR DE PROPOSTA DE VALOR ÚNICA (PVU) ==========
/** Answer -> KeyFactor mapping for proposta-valor-unica */
const propostaValorUnicaFactorMap: Record<string, KeyFactor> = {
  'niche.clear': { id: 'niche_clear', label: 'Nicho ou especialidade bem definidos', labelEn: 'Well-defined niche or specialty' },
  'niche.somewhat': { id: 'niche_somewhat', label: 'Tem alguma especialização', labelEn: 'Has some specialization' },
  'niche.no': { id: 'niche_no', label: 'Atua de forma genérica', labelEn: 'Works in a generic way' },
  'results.yes': { id: 'results_yes', label: 'Consegue citar resultados concretos para clientes', labelEn: 'Can cite concrete results for clients' },
  'results.some': { id: 'results_some', label: 'Alguns resultados, mas não sempre mensurados', labelEn: 'Some results, but not always measured' },
  'results.no': { id: 'results_no', label: 'Dificuldade em mostrar resultados mensuráveis', labelEn: 'Difficulty showing measurable results' },
  'praise.specific': { id: 'praise_specific', label: 'Clientes elogiam algo específico (não só "bom trabalho")', labelEn: 'Clients praise something specific (not just "good job")' },
  'praise.generic': { id: 'praise_generic', label: 'Elogios genéricos', labelEn: 'Generic praise' },
  'praise.rare': { id: 'praise_rare', label: 'Poucos elogios ou feedback claro', labelEn: 'Rare praise or clear feedback' },
  'price.main': { id: 'price_main', label: 'Competição gira muito em torno de preço', labelEn: 'Competition revolves mainly around price' },
  'price.sometimes': { id: 'price_sometimes', label: 'Às vezes compito por preço, às vezes por valor', labelEn: 'Sometimes compete on price, sometimes on value' },
  'price.value': { id: 'price_value', label: 'Consegue vender pelo valor, não só pelo preço', labelEn: 'Can sell on value, not just price' },
  'differentiator.yes': { id: 'differentiator_yes', label: 'Sabe explicar o que te diferencia em 1–2 frases', labelEn: 'Can explain what sets you apart in 1–2 sentences' },
  'differentiator.some': { id: 'differentiator_some', label: 'Tem ideia, mas não está cristalizado', labelEn: 'Has an idea, but it\'s not crystal clear' },
  'differentiator.no': { id: 'differentiator_no', label: 'Dificuldade em dizer o que te diferencia', labelEn: 'Difficulty saying what sets you apart' },
};

const quizPropostaValorUnica: QuizDefinition = {
  slug: 'proposta-valor-unica',
  title: 'Qual é o Seu Verdadeiro Diferencial no Mercado? Descubra Sua Proposta de Valor Única.',
  titleEn: 'What\'s Your True Differentiator in the Market? Discover Your Unique Value Proposition.',
  description: 'Ajuda freelancers e autônomos a saírem da briga por preço, identificando o que os torna especiais e como comunicar isso aos clientes.',
  descriptionEn: 'Helps freelancers and self-employed professionals get out of the price war by identifying what makes them special and how to communicate it to clients.',
  estimatedMinutes: 3,
  disclaimer: 'Este quiz é apenas educativo e de reflexão. Não substitui consultoria de negócios ou marketing. Use as ideias para orientar sua estratégia e, se necessário, consulte um profissional.',
  disclaimerEn: 'This quiz is for educational and reflection purposes only. It does not replace business or marketing consulting. Use the ideas to guide your strategy and, if needed, consult a professional.',
  methodologyUrl: '/faq',
  questions: [
    {
      id: 'niche',
      question: 'Você atua em um nicho ou especialidade bem definidos, ou de forma mais genérica?',
      questionEn: 'Do you work in a well-defined niche or specialty, or in a more generic way?',
      explanationShort: 'Um nicho claro ajuda clientes a lembrarem de você e reduz a competição direta por preço; "quem faz de tudo" compete com muitos.',
      explanationShortEn: 'A clear niche helps clients remember you and reduces direct price competition; "jack of all trades" competes with many.',
      options: [
        { id: 'clear', label: 'Sim, tenho um nicho ou especialidade bem definidos', labelEn: 'Yes, I have a well-defined niche or specialty', score: 0 },
        { id: 'somewhat', label: 'Tenho alguma especialização, mas ainda atendo um leque amplo', labelEn: 'I have some specialization but still serve a broad range', score: 1 },
        { id: 'no', label: 'Atuo de forma bem genérica', labelEn: 'I work in a very generic way', score: 2 },
      ],
    },
    {
      id: 'results',
      question: 'Você consegue citar resultados concretos que já entregou a clientes (economia de tempo, aumento de vendas, etc.)?',
      questionEn: 'Can you cite concrete results you\'ve delivered to clients (time saved, sales increase, etc.)?',
      explanationShort: 'Resultados mensuráveis são a base de uma proposta de valor forte; "fiz um bom trabalho" é vago, "reduzi custos em 20%" é convincente.',
      explanationShortEn: 'Measurable results are the basis of a strong value proposition; "I did a good job" is vague, "I reduced costs by 20%" is convincing.',
      options: [
        { id: 'yes', label: 'Sim, tenho exemplos com números ou fatos concretos', labelEn: 'Yes, I have examples with numbers or concrete facts', score: 0 },
        { id: 'some', label: 'Alguns, mas não sempre mensuro ou registro', labelEn: 'Some, but I don\'t always measure or record', score: 1 },
        { id: 'no', label: 'Tenho dificuldade em mostrar resultados mensuráveis', labelEn: 'I have difficulty showing measurable results', score: 2 },
      ],
    },
    {
      id: 'praise',
      question: 'Quando clientes te elogiam, o que costumam destacar?',
      questionEn: 'When clients praise you, what do they usually highlight?',
      explanationShort: 'Elogios específicos (ex.: "sua comunicação", "entregou antes do prazo") revelam seu diferencial real; elogios genéricos não ajudam a construir PVU.',
      explanationShortEn: 'Specific praise (e.g. "your communication", "delivered early") reveals your real differentiator; generic praise doesn\'t help build a UVP.',
      options: [
        { id: 'specific', label: 'Algo específico (ex.: comunicação, prazo, qualidade em X)', labelEn: 'Something specific (e.g. communication, deadlines, quality in X)', score: 0 },
        { id: 'generic', label: 'Coisas genéricas ("bom trabalho", "ficou bom")', labelEn: 'Generic things ("good job", "looks good")', score: 1 },
        { id: 'rare', label: 'Poucos elogios ou feedback pouco claro', labelEn: 'Rare praise or unclear feedback', score: 2 },
      ],
    },
    {
      id: 'price',
      question: 'Na prática, a competição pelos seus clientes gira muito em torno de preço ou você consegue destacar valor?',
      questionEn: 'In practice, does competition for your clients revolve mainly around price, or can you highlight value?',
      explanationShort: 'Quem compete só por preço está na "briga de menor valor"; quem consegue mostrar valor único tende a conseguir melhores projetos e preços.',
      explanationShortEn: 'Those who compete only on price are in the "race to the bottom"; those who can show unique value tend to get better projects and rates.',
      options: [
        { id: 'main', label: 'Muito em torno de preço (quem cobra menos leva)', labelEn: 'Mainly around price (lowest bid wins)', score: 2 },
        { id: 'sometimes', label: 'Às vezes preço, às vezes valor — depende do cliente', labelEn: 'Sometimes price, sometimes value — depends on the client', score: 1 },
        { id: 'value', label: 'Consigo vender pelo valor que entrego, não só pelo preço', labelEn: 'I can sell on the value I deliver, not just price', score: 0 },
      ],
    },
    {
      id: 'differentiator',
      question: 'Você consegue explicar em 1 ou 2 frases o que te diferencia da concorrência?',
      questionEn: 'Can you explain in 1 or 2 sentences what sets you apart from the competition?',
      explanationShort: 'A proposta de valor única (PVU) é justamente essa frase clara que resume por que o cliente deve escolher você; sem ela, você soa como "mais um".',
      explanationShortEn: 'The unique value proposition (UVP) is exactly that clear sentence that sums up why the client should choose you; without it, you sound like "just another one".',
      options: [
        { id: 'yes', label: 'Sim, tenho uma frase ou ideia clara', labelEn: 'Yes, I have a clear sentence or idea', score: 0 },
        { id: 'some', label: 'Tenho uma ideia, mas não está cristalizada', labelEn: 'I have an idea, but it\'s not crystal clear', score: 1 },
        { id: 'no', label: 'Tenho dificuldade em dizer o que me diferencia', labelEn: 'I have difficulty saying what sets me apart', score: 2 },
      ],
    },
  ],
  scoreRanges: [
    { min: 0, max: 2, resultId: 'strong' },
    { min: 3, max: 5, resultId: 'developing' },
    { min: 6, max: 10, resultId: 'needs_work' },
  ],
  results: [
    {
      id: 'strong',
      title: 'Sua proposta de valor está bem definida',
      titleEn: 'Your value proposition is well defined',
      description: 'Você tem nicho ou especialidade, consegue mostrar resultados e comunicar seu diferencial. Use isso a seu favor: destaque sua PVU em propostas, perfis e conversas com clientes para sair da briga por preço.',
      descriptionEn: 'You have a niche or specialty, can show results, and communicate your differentiator. Use this to your advantage: highlight your UVP in proposals, profiles, and client conversations to get out of the price war.',
      methodologyShort: 'O resultado considera nicho, resultados mensuráveis, feedback dos clientes, competição por preço vs. valor e clareza do diferencial. A faixa "bem definida" indica que você já tem elementos sólidos de uma PVU. O quiz é apenas educativo.',
      methodologyShortEn: 'The result considers niche, measurable results, client feedback, price vs. value competition, and clarity of differentiator. The "well defined" band indicates you already have solid elements of a UVP. This quiz is for educational purposes only.',
      keyFactorsFallback: [
        { id: 'niche_clear', label: 'Nicho ou especialidade definidos', labelEn: 'Defined niche or specialty' },
        { id: 'results_yes', label: 'Resultados concretos e diferencial comunicado', labelEn: 'Concrete results and communicated differentiator' },
      ],
      recommendedArticleSlugs: [],
      ctas: [
        { label: 'Calculadora de Lucro Real', labelEn: 'Real Profit Calculator', path: '/ferramentas/calculadora-lucro-diario', pathEn: '/tools/daily-profit-calculator' },
        { label: 'Guias e artigos', labelEn: 'Guides and articles', path: '/articles' },
      ],
    },
    {
      id: 'developing',
      title: 'Sua proposta de valor está em construção',
      titleEn: 'Your value proposition is under construction',
      description: 'Você tem alguns elementos (nicho, resultados ou feedback), mas ainda falta cristalizar o que te torna único. Próximos passos: registrar resultados de projetos, pedir feedback específico aos clientes e praticar uma frase que resuma seu diferencial.',
      descriptionEn: 'You have some elements (niche, results, or feedback) but still need to crystallize what makes you unique. Next steps: record project results, ask clients for specific feedback, and practice a sentence that sums up your differentiator.',
      methodologyShort: 'O resultado usa fatores como nicho, resultados, elogios dos clientes, competição por preço/valor e clareza do diferencial. A faixa "em construção" indica potencial com espaço para melhorar. O quiz é educativo.',
      methodologyShortEn: 'The result uses factors such as niche, results, client praise, price/value competition, and clarity of differentiator. The "under construction" band indicates potential with room to improve. This quiz is educational.',
      keyFactorsFallback: [
        { id: 'niche_somewhat', label: 'Alguma especialização; falta clareza', labelEn: 'Some specialization; clarity needed' },
        { id: 'results_some', label: 'Resultados parciais ou pouco mensurados', labelEn: 'Partial or under-measured results' },
      ],
      recommendedArticleSlugs: [],
      ctas: [
        { label: 'Simulador de Perda de Renda', labelEn: 'Loss Income Simulator', path: '/ferramentas/simulador-perda-renda', pathEn: '/tools/loss-income-simulator' },
        { label: 'Calculadora de Lucro Real', labelEn: 'Real Profit Calculator', path: '/ferramentas/calculadora-lucro-diario', pathEn: '/tools/daily-profit-calculator' },
        { label: 'Guias e artigos', labelEn: 'Guides and articles', path: '/articles' },
      ],
    },
    {
      id: 'needs_work',
      title: 'Vale a pena fortalecer sua proposta de valor',
      titleEn: 'Worth strengthening your value proposition',
      description: 'Você tende a competir muito por preço e ainda tem dificuldade em mostrar resultados ou explicar seu diferencial. Próximos passos: (1) escolher um nicho ou especialidade para se destacar, (2) começar a medir e registrar resultados dos projetos, (3) pedir feedback específico aos clientes e (4) escrever uma frase que resuma por que alguém deveria te escolher.',
      descriptionEn: 'You tend to compete heavily on price and still have difficulty showing results or explaining your differentiator. Next steps: (1) choose a niche or specialty to stand out, (2) start measuring and recording project results, (3) ask clients for specific feedback, and (4) write a sentence that sums up why someone should choose you.',
      methodologyShort: 'O resultado considera nicho, resultados mensuráveis, feedback, competição por preço e clareza do diferencial. A faixa "fortalecer" indica oportunidade de sair da briga por preço com uma PVU mais clara. O quiz é educativo; para estratégia aprofundada, consulte um profissional.',
      methodologyShortEn: 'The result considers niche, measurable results, feedback, price competition, and clarity of differentiator. The "strengthen" band indicates an opportunity to get out of the price war with a clearer UVP. This quiz is educational; for in-depth strategy, consult a professional.',
      keyFactorsFallback: [
        { id: 'niche_no', label: 'Atuação genérica', labelEn: 'Generic positioning' },
        { id: 'results_no', label: 'Poucos resultados mensuráveis', labelEn: 'Few measurable results' },
        { id: 'price_main', label: 'Competição muito em torno de preço', labelEn: 'Competition mainly around price' },
      ],
      recommendedArticleSlugs: [],
      ctas: [
        { label: 'Simulador de Orçamento', labelEn: 'Budget Simulator', path: '/ferramentas/simulador-orcamento', pathEn: '/tools/driver-budget-simulator' },
        { label: 'Calculadora de Lucro Real', labelEn: 'Real Profit Calculator', path: '/ferramentas/calculadora-lucro-diario', pathEn: '/tools/daily-profit-calculator' },
        { label: 'Guias e artigos', labelEn: 'Guides and articles', path: '/articles' },
      ],
    },
  ],
};

/** Resolve result by score for score-based quizzes (risco-burnout, proposta-valor-unica) */
function getResultByScore(totalScore: number, def: QuizDefinition): QuizResultVariant {
  const range = def.scoreRanges?.find((r) => totalScore >= r.min && totalScore <= r.max);
  const resultId = range?.resultId ?? def.scoreRanges?.[0]?.resultId ?? def.results[0]?.id;
  return def.results.find((r) => r.id === resultId) ?? def.results[0];
}

/** Map answers to key factors from a factor map (questionId.optionId -> KeyFactor) */
function getKeyFactorsFromMap(answers: Record<string, string>, map: Record<string, KeyFactor>): KeyFactor[] {
  const seen = new Set<string>();
  const factors: KeyFactor[] = [];
  for (const [qId, optId] of Object.entries(answers)) {
    const key = `${qId}.${optId}`;
    const factor = map[key];
    if (factor && !seen.has(factor.id)) {
      seen.add(factor.id);
      factors.push(factor);
    }
  }
  return factors.slice(0, 4);
}

export function getKeyFactorsForResult(
  quizSlug: string,
  resultId: string,
  answers: Record<string, string>
): KeyFactor[] {
  const def = getQuizBySlug(quizSlug);
  if (!def) return [];
  if (quizSlug === 'risco-burnout') {
    const factors = getKeyFactorsFromMap(answers, riscoBurnoutFactorMap);
    if (factors.length >= 1) return factors;
  }
  if (quizSlug === 'proposta-valor-unica') {
    const factors = getKeyFactorsFromMap(answers, propostaValorUnicaFactorMap);
    if (factors.length >= 1) return factors;
  }
  const result = def.results.find((r) => r.id === resultId);
  return result?.keyFactorsFallback ?? [];
}

export function getQuizBySlug(slug: string): QuizDefinition | null {
  if (slug === 'risco-burnout') return quizRiscoBurnout;
  if (slug === 'proposta-valor-unica') return quizPropostaValorUnica;
  return null;
}

export function getQuizResultById(quizSlug: string, resultId: string): QuizResultVariant | null {
  const def = getQuizBySlug(quizSlug);
  if (!def) return null;
  return def.results.find((r) => r.id === resultId) ?? null;
}

export function computeQuizResult(
  slug: QuizSlug,
  answers: Record<string, string>
): { result: QuizResultVariant; totalScore?: number } {
  const def = getQuizBySlug(slug);
  if (!def) throw new Error(`Quiz not found: ${slug}`);

  if (slug === 'risco-burnout' || slug === 'proposta-valor-unica') {
    let totalScore = 0;
    def.questions.forEach((q) => {
      const chosen = answers[q.id];
      const opt = q.options.find((o) => o.id === chosen);
      if (opt?.score != null) totalScore += opt.score;
    });
    const result = getResultByScore(totalScore, def);
    return { result, totalScore };
  }

  throw new Error(`Unknown quiz: ${slug}`);
}

export const quizList: { slug: QuizSlug; title: string; titleEn?: string; description: string; descriptionEn?: string }[] = [
  {
    slug: 'risco-burnout',
    title: quizRiscoBurnout.title,
    titleEn: quizRiscoBurnout.titleEn,
    description: quizRiscoBurnout.description,
    descriptionEn: quizRiscoBurnout.descriptionEn,
  },
  {
    slug: 'proposta-valor-unica',
    title: quizPropostaValorUnica.title,
    titleEn: quizPropostaValorUnica.titleEn,
    description: quizPropostaValorUnica.description,
    descriptionEn: quizPropostaValorUnica.descriptionEn,
  },
];
