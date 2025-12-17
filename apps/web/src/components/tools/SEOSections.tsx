'use client';

import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface SEOSectionsProps {
  locale: string;
  intro: {
    title: string;
    content: string;
  };
  whyMatters: {
    title: string;
    points: Array<{
      icon: 'money' | 'time' | 'alert' | 'chart' | 'shield' | 'target';
      title: string;
      description: string;
    }>;
  };
  commonMistakes: {
    title: string;
    mistakes: Array<{
      mistake: string;
      consequence: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  faq: {
    title: string;
    items: FAQItem[];
  };
}

const iconMap = {
  money: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  time: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  alert: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  chart: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  shield: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  target: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
};

function FAQAccordion({ items, locale }: { items: FAQItem[]; locale: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-slate-800/60 rounded-xl border border-slate-700/50 overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-700/30 transition-colors"
            aria-expanded={openIndex === index}
          >
            <span className="font-medium text-white pr-4">{item.question}</span>
            <svg
              className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === index && (
            <div className="px-5 pb-4 text-slate-300 leading-relaxed">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function SEOSections({
  locale,
  intro,
  whyMatters,
  commonMistakes,
  cta,
  faq,
}: SEOSectionsProps) {
  return (
    <div className="space-y-16">
      {/* Intro Section */}
      <section className="bg-slate-800/40 rounded-3xl border border-slate-700/50 p-8">
        <h2 className="text-2xl font-bold text-white mb-4">{intro.title}</h2>
        <p className="text-slate-300 leading-relaxed text-lg">{intro.content}</p>
      </section>

      {/* Why It Matters Section */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-8 text-center">{whyMatters.title}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyMatters.points.map((point, index) => (
            <div
              key={index}
              className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 mb-4">
                {iconMap[point.icon]}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{point.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-3xl border border-red-500/20 p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
          {commonMistakes.title}
        </h2>
        <div className="space-y-4">
          {commonMistakes.mistakes.map((item, index) => (
            <div key={index} className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <div>
                  <p className="text-white font-medium mb-1">{item.mistake}</p>
                  <p className="text-slate-400 text-sm">{item.consequence}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl border border-emerald-500/30 p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">{cta.title}</h2>
        <p className="text-slate-300 mb-6 max-w-2xl mx-auto">{cta.description}</p>
        <a
          href={cta.buttonLink}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25"
        >
          {cta.buttonText}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-8 text-center">{faq.title}</h2>
        <FAQAccordion items={faq.items} locale={locale} />
      </section>
    </div>
  );
}

// Pre-built content for each calculator
export const dailyProfitSEO = {
  'pt-BR': {
    intro: {
      title: 'Você sabe quanto realmente ganha por hora?',
      content: 'A maioria dos motoristas de aplicativo olha apenas para o faturamento bruto do dia e acredita que está ganhando bem. Mas a realidade é diferente. Quando você desconta combustível, manutenção do veículo, taxas das plataformas e outros custos operacionais, o lucro real por hora trabalhada pode ser surpreendentemente baixo — às vezes menor que o salário mínimo. Esta calculadora foi criada para revelar seu ganho verdadeiro e ajudar você a tomar decisões mais inteligentes sobre quando, onde e quanto trabalhar.',
    },
    whyMatters: {
      title: 'Por que calcular o lucro real importa?',
      points: [
        {
          icon: 'money' as const,
          title: 'Evite a ilusão do faturamento',
          description: 'R$300 por dia parece muito, mas pode virar R$15/hora após custos. Saber o número real muda suas decisões.',
        },
        {
          icon: 'time' as const,
          title: 'Valorize seu tempo',
          description: 'Se você está ganhando menos que o salário mínimo por hora, talvez seja hora de mudar de estratégia ou plataforma.',
        },
        {
          icon: 'chart' as const,
          title: 'Compare períodos de trabalho',
          description: 'Descubra se vale mais a pena trabalhar de manhã, à noite, ou aos finais de semana.',
        },
        {
          icon: 'target' as const,
          title: 'Defina metas realistas',
          description: 'Com o lucro real em mãos, você pode calcular quantas horas precisa trabalhar para atingir seus objetivos.',
        },
        {
          icon: 'alert' as const,
          title: 'Identifique problemas cedo',
          description: 'Se sua margem está caindo, você percebe antes de ter prejuízo e pode ajustar sua operação.',
        },
        {
          icon: 'shield' as const,
          title: 'Planeje sua proteção',
          description: 'Sabendo quanto realmente ganha, você pode planejar reservas de emergência e seguros adequados.',
        },
      ],
    },
    commonMistakes: {
      title: 'Erros comuns que destroem seu lucro',
      mistakes: [
        {
          mistake: 'Ignorar a depreciação do veículo',
          consequence: 'Seu carro perde valor a cada km rodado. Isso é dinheiro que você está "gastando" sem perceber.',
        },
        {
          mistake: 'Não contabilizar manutenção preventiva',
          consequence: 'Troca de óleo, pneus, freios — tudo isso deve entrar no cálculo diário, não só quando a conta chega.',
        },
        {
          mistake: 'Esquecer os custos "invisíveis"',
          consequence: 'Celular, internet, alimentação fora de casa, estacionamento — pequenos gastos que somam alto no final do mês.',
        },
        {
          mistake: 'Calcular lucro sem considerar impostos',
          consequence: 'Se você é MEI ou precisa declarar renda, parte do seu ganho vai para impostos.',
        },
        {
          mistake: 'Aceitar qualquer corrida',
          consequence: 'Corridas curtas ou para áreas distantes podem dar prejuízo. Calcule antes de aceitar.',
        },
      ],
    },
    cta: {
      title: 'Quer proteger seus ganhos?',
      description: 'Agora que você sabe quanto realmente ganha, que tal garantir que um imprevisto não tire tudo isso? Conheça opções de seguro feitas para motoristas de aplicativo.',
      buttonText: 'Conhecer Seguros para Motoristas',
      buttonLink: '/pt-BR/seguros/seguros-para-motoristas',
    },
    faq: {
      title: 'Perguntas Frequentes',
      items: [
        {
          question: 'Quanto um motorista de Uber ganha por hora em média?',
          answer: 'O ganho varia muito por cidade e horário, mas após descontar todos os custos, a média real fica entre R$10 e R$25 por hora. Motoristas em horários de pico e áreas movimentadas conseguem valores maiores.',
        },
        {
          question: 'Devo incluir o custo do carro na calculadora?',
          answer: 'Sim! Se você financia o carro ou poderia vendê-lo, o custo de depreciação deve entrar no cálculo. Use a Calculadora de Custos Ocultos para descobrir esse valor.',
        },
        {
          question: 'Como sei se estou tendo prejuízo?',
          answer: 'Se seu lucro por hora está abaixo do salário mínimo (cerca de R$6,36/hora), você está efetivamente tendo prejuízo, pois poderia ganhar mais em um emprego CLT sem os riscos.',
        },
        {
          question: 'Vale a pena trabalhar em dias de chuva ou feriados?',
          answer: 'Geralmente sim, pois a demanda aumenta e as tarifas dinâmicas compensam. Mas use esta calculadora para confirmar com seus números reais.',
        },
        {
          question: 'Como aumentar meu lucro real por hora?',
          answer: 'Foque em: reduzir tempo parado entre corridas, trabalhar em horários de pico, manter o carro econômico, e recusar corridas que não compensam financeiramente.',
        },
      ],
    },
  },
  'en-US': {
    intro: {
      title: 'Do you know how much you really earn per hour?',
      content: 'Most rideshare drivers look at their gross daily earnings and think they\'re doing well. But reality tells a different story. When you subtract fuel, vehicle maintenance, platform fees, and other operating costs, your real hourly profit can be surprisingly low — sometimes below minimum wage. This calculator was designed to reveal your true earnings and help you make smarter decisions about when, where, and how much to work.',
    },
    whyMatters: {
      title: 'Why does calculating real profit matter?',
      points: [
        {
          icon: 'money' as const,
          title: 'Avoid the revenue illusion',
          description: '$200 per day sounds great, but might become $12/hour after costs. Knowing the real number changes your decisions.',
        },
        {
          icon: 'time' as const,
          title: 'Value your time',
          description: 'If you\'re earning less than minimum wage per hour, it might be time to change your strategy or platform.',
        },
        {
          icon: 'chart' as const,
          title: 'Compare work periods',
          description: 'Find out if it\'s more profitable to work mornings, nights, or weekends.',
        },
        {
          icon: 'target' as const,
          title: 'Set realistic goals',
          description: 'With your real profit in hand, you can calculate how many hours you need to work to reach your objectives.',
        },
        {
          icon: 'alert' as const,
          title: 'Identify problems early',
          description: 'If your margin is dropping, you\'ll notice before losing money and can adjust your operation.',
        },
        {
          icon: 'shield' as const,
          title: 'Plan your protection',
          description: 'Knowing how much you really earn, you can plan adequate emergency reserves and insurance.',
        },
      ],
    },
    commonMistakes: {
      title: 'Common mistakes that destroy your profit',
      mistakes: [
        {
          mistake: 'Ignoring vehicle depreciation',
          consequence: 'Your car loses value with every mile driven. That\'s money you\'re "spending" without realizing it.',
        },
        {
          mistake: 'Not accounting for preventive maintenance',
          consequence: 'Oil changes, tires, brakes — all should be factored into daily calculations, not just when the bill arrives.',
        },
        {
          mistake: 'Forgetting "invisible" costs',
          consequence: 'Phone, data plan, eating out, parking — small expenses that add up significantly by month\'s end.',
        },
        {
          mistake: 'Calculating profit without considering taxes',
          consequence: 'As a self-employed worker, part of your earnings go to taxes.',
        },
        {
          mistake: 'Accepting every ride',
          consequence: 'Short trips or rides to distant areas might result in losses. Calculate before accepting.',
        },
      ],
    },
    cta: {
      title: 'Want to protect your earnings?',
      description: 'Now that you know how much you really earn, how about making sure an unexpected event doesn\'t take it all away? Discover insurance options made for rideshare drivers.',
      buttonText: 'Explore Driver Insurance',
      buttonLink: '/en-US/insurance/insurance-for-drivers',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'How much does an Uber driver earn per hour on average?',
          answer: 'Earnings vary greatly by city and time, but after deducting all costs, the real average falls between $10 and $25 per hour. Drivers during peak hours and busy areas achieve higher values.',
        },
        {
          question: 'Should I include the car cost in the calculator?',
          answer: 'Yes! If you\'re financing the car or could sell it, depreciation costs should be factored in. Use the Hidden Costs Calculator to discover this value.',
        },
        {
          question: 'How do I know if I\'m losing money?',
          answer: 'If your hourly profit is below minimum wage (about $7.25/hour federally), you\'re effectively losing money, as you could earn more in a regular job without the risks.',
        },
        {
          question: 'Is it worth working on rainy days or holidays?',
          answer: 'Usually yes, as demand increases and surge pricing compensates. But use this calculator to confirm with your real numbers.',
        },
        {
          question: 'How can I increase my real hourly profit?',
          answer: 'Focus on: reducing idle time between rides, working during peak hours, maintaining fuel efficiency, and declining rides that don\'t pay well.',
        },
      ],
    },
  },
};

// Loss Income Simulator SEO Content
export const lossIncomeSEO = {
  'pt-BR': {
    intro: {
      title: 'Você já pensou quanto perderia se não pudesse trabalhar?',
      content: 'Acidentes acontecem. Doenças surgem sem aviso. E quando você depende do trabalho por aplicativo, cada dia parado significa dinheiro perdido. Diferente de um empregado CLT, você não tem auxílio-doença ou licença remunerada. Este simulador mostra exatamente quanto você perderia de renda se ficasse impossibilitado de trabalhar por dias, semanas ou meses — e por que ter uma proteção adequada pode ser a diferença entre superar um imprevisto ou enfrentar uma crise financeira.',
    },
    whyMatters: {
      title: 'Por que simular a perda de renda é crucial?',
      points: [
        {
          icon: 'alert' as const,
          title: 'Sem rede de proteção',
          description: 'Como autônomo, você não tem INSS automático, FGTS ou seguro desemprego. Um acidente pode zerar sua renda instantaneamente.',
        },
        {
          icon: 'money' as const,
          title: 'Contas não param',
          description: 'Aluguel, financiamento do carro, alimentação — as despesas continuam mesmo quando você não pode trabalhar.',
        },
        {
          icon: 'time' as const,
          title: 'Recuperação leva tempo',
          description: 'Uma fratura pode te afastar por 2-3 meses. Você consegue cobrir 90 dias de despesas sem trabalhar?',
        },
        {
          icon: 'chart' as const,
          title: 'Visualize o impacto real',
          description: 'Ver o número exato de quanto perderia muda sua perspectiva sobre proteção financeira.',
        },
        {
          icon: 'shield' as const,
          title: 'Planeje sua segurança',
          description: 'Com os números em mãos, você pode decidir quanto investir em reserva de emergência ou seguro.',
        },
        {
          icon: 'target' as const,
          title: 'Compare cenários',
          description: 'Simule diferentes períodos de afastamento e veja como cada um impactaria suas finanças.',
        },
      ],
    },
    commonMistakes: {
      title: 'Erros que deixam motoristas vulneráveis',
      mistakes: [
        {
          mistake: 'Achar que "não vai acontecer comigo"',
          consequence: 'Acidentes de trânsito são a principal causa de afastamento de motoristas. A chance é maior do que você imagina.',
        },
        {
          mistake: 'Não ter reserva de emergência',
          consequence: 'Sem 3-6 meses de despesas guardadas, qualquer imprevisto vira uma crise imediata.',
        },
        {
          mistake: 'Confiar apenas no seguro do carro',
          consequence: 'O seguro do veículo não cobre sua perda de renda. Você fica sem carro E sem dinheiro.',
        },
        {
          mistake: 'Ignorar a saúde',
          consequence: 'Problemas de coluna, estresse, visão — são comuns em motoristas e podem te afastar gradualmente.',
        },
        {
          mistake: 'Não conhecer opções de proteção',
          consequence: 'Existem seguros específicos para autônomos que podem custar menos do que você imagina.',
        },
      ],
    },
    cta: {
      title: 'Não deixe um imprevisto acabar com suas finanças',
      description: 'Agora que você sabe o quanto poderia perder, conheça opções de proteção pensadas para quem trabalha por conta própria.',
      buttonText: 'Ver Opções de Seguro',
      buttonLink: '/pt-BR/seguros/seguros-para-motoristas',
    },
    faq: {
      title: 'Perguntas Frequentes',
      items: [
        {
          question: 'Por quanto tempo um motorista geralmente fica afastado após um acidente?',
          answer: 'Depende da gravidade. Batidas leves: 1-2 semanas. Fraturas simples: 1-2 meses. Fraturas graves ou cirurgias: 3-6 meses. Lesões permanentes podem encerrar a carreira.',
        },
        {
          question: 'O INSS cobre motoristas de aplicativo?',
          answer: 'Apenas se você contribuir como MEI ou contribuinte individual. Mesmo assim, há carência de 12 meses para auxílio-doença e o valor é limitado a 1 salário mínimo.',
        },
        {
          question: 'Quanto custa um seguro de perda de renda?',
          answer: 'Varia muito conforme cobertura e seguradora. Há opções a partir de R$50-100/mês que garantem renda durante afastamento.',
        },
        {
          question: 'Vale mais a pena guardar dinheiro ou fazer seguro?',
          answer: 'O ideal é ter os dois: uma reserva de emergência para imprevistos menores e um seguro para eventos mais graves que exijam afastamento longo.',
        },
        {
          question: 'E se eu tiver um acidente enquanto estou offline?',
          answer: 'Depende do seu seguro. Seguros pessoais geralmente cobrem 24h. Já a cobertura das plataformas só vale quando você está online e em corrida.',
        },
      ],
    },
  },
  'en-US': {
    intro: {
      title: 'Have you thought about how much you would lose if you couldn\'t work?',
      content: 'Accidents happen. Illness strikes without warning. And when you depend on gig work, every day off means lost money. Unlike a regular employee, you don\'t have sick pay or paid leave. This simulator shows exactly how much income you would lose if you couldn\'t work for days, weeks, or months — and why having adequate protection can be the difference between overcoming an unexpected event or facing a financial crisis.',
    },
    whyMatters: {
      title: 'Why is simulating income loss crucial?',
      points: [
        {
          icon: 'alert' as const,
          title: 'No safety net',
          description: 'As a gig worker, you don\'t have automatic benefits or unemployment insurance. An accident can zero your income instantly.',
        },
        {
          icon: 'money' as const,
          title: 'Bills don\'t stop',
          description: 'Rent, car payments, groceries — expenses continue even when you can\'t work.',
        },
        {
          icon: 'time' as const,
          title: 'Recovery takes time',
          description: 'A fracture can keep you off work for 2-3 months. Can you cover 90 days of expenses without working?',
        },
        {
          icon: 'chart' as const,
          title: 'Visualize the real impact',
          description: 'Seeing the exact number of what you would lose changes your perspective on financial protection.',
        },
        {
          icon: 'shield' as const,
          title: 'Plan your security',
          description: 'With the numbers in hand, you can decide how much to invest in emergency reserves or insurance.',
        },
        {
          icon: 'target' as const,
          title: 'Compare scenarios',
          description: 'Simulate different absence periods and see how each would impact your finances.',
        },
      ],
    },
    commonMistakes: {
      title: 'Mistakes that leave drivers vulnerable',
      mistakes: [
        {
          mistake: 'Thinking "it won\'t happen to me"',
          consequence: 'Traffic accidents are the leading cause of driver absence. The chance is higher than you think.',
        },
        {
          mistake: 'Not having an emergency fund',
          consequence: 'Without 3-6 months of expenses saved, any unexpected event becomes an immediate crisis.',
        },
        {
          mistake: 'Relying only on car insurance',
          consequence: 'Vehicle insurance doesn\'t cover your income loss. You end up without a car AND without money.',
        },
        {
          mistake: 'Ignoring health',
          consequence: 'Back problems, stress, vision issues — are common among drivers and can gradually sideline you.',
        },
        {
          mistake: 'Not knowing protection options',
          consequence: 'There are specific insurance plans for gig workers that may cost less than you think.',
        },
      ],
    },
    cta: {
      title: 'Don\'t let an unexpected event destroy your finances',
      description: 'Now that you know how much you could lose, discover protection options designed for self-employed workers.',
      buttonText: 'See Insurance Options',
      buttonLink: '/en-US/insurance/insurance-for-drivers',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'How long does a driver typically stay off work after an accident?',
          answer: 'Depends on severity. Minor collisions: 1-2 weeks. Simple fractures: 1-2 months. Serious fractures or surgeries: 3-6 months. Permanent injuries can end a career.',
        },
        {
          question: 'Does workers\' comp cover rideshare drivers?',
          answer: 'Generally no, as gig workers are classified as independent contractors. You need your own disability insurance.',
        },
        {
          question: 'How much does income protection insurance cost?',
          answer: 'Varies widely by coverage and insurer. Options start around $50-100/month that guarantee income during absence.',
        },
        {
          question: 'Is it better to save money or get insurance?',
          answer: 'Ideally both: an emergency fund for minor unexpected events and insurance for more serious situations requiring longer absence.',
        },
        {
          question: 'What if I have an accident while I\'m offline?',
          answer: 'Depends on your insurance. Personal insurance usually covers 24/7. Platform coverage only applies when you\'re online and on a trip.',
        },
      ],
    },
  },
};

// Cost Per Trip Calculator SEO Content
export const costPerTripSEO = {
  'pt-BR': {
    intro: {
      title: 'Você sabe se suas corridas estão realmente dando lucro?',
      content: 'Aceitar uma corrida parece simples: aparece no app, você aceita. Mas nem toda corrida vale a pena. Quando você considera combustível, desgaste do veículo e a taxa da plataforma, algumas corridas podem dar prejuízo. Esta calculadora revela o custo real de cada corrida e mostra o valor mínimo que você deveria aceitar para não perder dinheiro. Pare de trabalhar no escuro — saiba exatamente quando vale a pena apertar "aceitar".',
    },
    whyMatters: {
      title: 'Por que calcular o custo por corrida é essencial?',
      points: [
        {
          icon: 'money' as const,
          title: 'Nem toda corrida é lucrativa',
          description: 'Corridas curtas ou para áreas distantes podem custar mais do que você recebe. Saiba antes de aceitar.',
        },
        {
          icon: 'target' as const,
          title: 'Defina seu valor mínimo',
          description: 'Descubra o valor mínimo de corrida que você deve aceitar para garantir lucro.',
        },
        {
          icon: 'chart' as const,
          title: 'Tome decisões rápidas',
          description: 'Com o custo por km na cabeça, você decide em segundos se a corrida compensa.',
        },
        {
          icon: 'time' as const,
          title: 'Otimize seu tempo',
          description: 'Recusar corridas ruins libera você para aceitar as que realmente pagam bem.',
        },
        {
          icon: 'alert' as const,
          title: 'Evite o "efeito manada"',
          description: 'Muitos motoristas aceitam tudo e só descobrem no fim do mês que trabalharam de graça em várias corridas.',
        },
        {
          icon: 'shield' as const,
          title: 'Proteja sua margem',
          description: 'Saber seu custo é o primeiro passo para garantir que você sempre lucra.',
        },
      ],
    },
    commonMistakes: {
      title: 'Erros que fazem motoristas perder dinheiro em corridas',
      mistakes: [
        {
          mistake: 'Aceitar qualquer corrida que aparece',
          consequence: 'Corridas curtas de R$5-7 podem dar prejuízo quando você calcula combustível, tempo parado e desgaste.',
        },
        {
          mistake: 'Ignorar a distância até o passageiro',
          consequence: 'Rodar 5km para buscar alguém que vai fazer uma corrida de 2km é receita para prejuízo.',
        },
        {
          mistake: 'Não considerar o retorno',
          consequence: 'Levar alguém para uma área sem demanda significa voltar vazio — dobra seu custo por km.',
        },
        {
          mistake: 'Focar apenas no faturamento bruto',
          consequence: 'R$150 no dia parece bom, mas se você rodou 200km, pode ter lucrado muito pouco.',
        },
        {
          mistake: 'Esquecer custos "invisíveis"',
          consequence: 'Desgaste de pneus, freios, suspensão — cada km rodado tem um custo que não aparece na hora.',
        },
      ],
    },
    cta: {
      title: 'Quer aumentar seu lucro por corrida?',
      description: 'Agora que você sabe calcular o custo de cada corrida, veja dicas e guias para maximizar seus ganhos.',
      buttonText: 'Ver Guias para Motoristas',
      buttonLink: '/pt-BR/guias',
    },
    faq: {
      title: 'Perguntas Frequentes',
      items: [
        {
          question: 'Qual é o custo médio por km para um motorista de aplicativo?',
          answer: 'Varia conforme o veículo, mas a média é de R$0,50 a R$0,80 por km quando você inclui combustível, manutenção, depreciação e desgaste.',
        },
        {
          question: 'Devo recusar corridas curtas?',
          answer: 'Depende. Se você está parado e a corrida é perto, pode aceitar. Mas se precisa se deslocar muito para uma corrida de R$5-7, geralmente não compensa.',
        },
        {
          question: 'Como sei se uma corrida vai dar prejuízo?',
          answer: 'Se o valor líquido (após taxa da plataforma) for menor que seu custo por km multiplicado pela distância total, você terá prejuízo.',
        },
        {
          question: 'Vale a pena aceitar corridas longas?',
          answer: 'Geralmente sim, pois o custo fixo de cada corrida (tempo de espera, deslocamento) se dilui em mais km. Mas verifique se há demanda no destino.',
        },
        {
          question: 'Como a taxa da plataforma afeta meu lucro?',
          answer: 'A taxa (geralmente 20-25%) sai do valor que você recebe. Uma corrida de R$20 com taxa de 25% vira R$15 para você — e desses R$15 ainda saem os custos.',
        },
      ],
    },
  },
  'en-US': {
    intro: {
      title: 'Do you know if your rides are actually profitable?',
      content: 'Accepting a ride seems simple: it appears in the app, you accept it. But not every ride is worth it. When you factor in fuel, vehicle wear, and platform fees, some rides can result in losses. This calculator reveals the real cost of each trip and shows the minimum fare you should accept to not lose money. Stop working in the dark — know exactly when it\'s worth hitting "accept".',
    },
    whyMatters: {
      title: 'Why is calculating cost per trip essential?',
      points: [
        {
          icon: 'money' as const,
          title: 'Not every ride is profitable',
          description: 'Short rides or trips to distant areas may cost more than you earn. Know before accepting.',
        },
        {
          icon: 'target' as const,
          title: 'Set your minimum fare',
          description: 'Discover the minimum ride value you should accept to ensure profit.',
        },
        {
          icon: 'chart' as const,
          title: 'Make quick decisions',
          description: 'With cost per mile in mind, you decide in seconds if the ride is worth it.',
        },
        {
          icon: 'time' as const,
          title: 'Optimize your time',
          description: 'Declining bad rides frees you to accept ones that actually pay well.',
        },
        {
          icon: 'alert' as const,
          title: 'Avoid the "accept everything" trap',
          description: 'Many drivers accept everything and only discover at month\'s end they worked for free on several rides.',
        },
        {
          icon: 'shield' as const,
          title: 'Protect your margin',
          description: 'Knowing your cost is the first step to ensuring you always profit.',
        },
      ],
    },
    commonMistakes: {
      title: 'Mistakes that make drivers lose money on rides',
      mistakes: [
        {
          mistake: 'Accepting every ride that appears',
          consequence: 'Short $3-5 rides may result in losses when you calculate fuel, idle time, and wear.',
        },
        {
          mistake: 'Ignoring the distance to the passenger',
          consequence: 'Driving 3 miles to pick up someone for a 1-mile ride is a recipe for loss.',
        },
        {
          mistake: 'Not considering the return',
          consequence: 'Taking someone to an area with no demand means returning empty — doubles your cost per mile.',
        },
        {
          mistake: 'Focusing only on gross revenue',
          consequence: '$100 per day sounds good, but if you drove 150 miles, you may have profited very little.',
        },
        {
          mistake: 'Forgetting "invisible" costs',
          consequence: 'Tire, brake, suspension wear — every mile driven has a cost that doesn\'t appear immediately.',
        },
      ],
    },
    cta: {
      title: 'Want to increase your profit per ride?',
      description: 'Now that you know how to calculate the cost of each ride, see tips and guides to maximize your earnings.',
      buttonText: 'View Driver Guides',
      buttonLink: '/en-US/guides',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'What is the average cost per mile for a rideshare driver?',
          answer: 'Varies by vehicle, but the average is $0.30 to $0.50 per mile when you include fuel, maintenance, depreciation, and wear.',
        },
        {
          question: 'Should I decline short rides?',
          answer: 'Depends. If you\'re idle and the ride is nearby, you might accept. But if you need to travel far for a $3-5 ride, it usually doesn\'t pay off.',
        },
        {
          question: 'How do I know if a ride will result in a loss?',
          answer: 'If the net value (after platform fee) is less than your cost per mile times total distance, you\'ll have a loss.',
        },
        {
          question: 'Is it worth accepting long rides?',
          answer: 'Usually yes, as the fixed cost of each ride (wait time, pickup) spreads over more miles. But check if there\'s demand at the destination.',
        },
        {
          question: 'How does the platform fee affect my profit?',
          answer: 'The fee (usually 20-25%) comes out of what you receive. A $20 ride with 25% fee becomes $15 for you — and costs still come out of that $15.',
        },
      ],
    },
  },
};

// Fuel Calculator SEO Content
export const fuelCalculatorSEO = {
  'pt-BR': {
    intro: {
      title: 'Gasolina ou etanol: qual compensa mais para você?',
      content: 'A dúvida é comum: devo abastecer com gasolina ou etanol? A regra dos 70% que todo mundo repete nem sempre funciona na prática. Depende do consumo real do seu veículo, que varia com trânsito, ar-condicionado e estilo de direção. Esta calculadora faz a conta exata para você, considerando os preços atuais e o consumo específico do seu carro — sem achismos, só matemática.',
    },
    whyMatters: {
      title: 'Por que calcular o combustível certo faz diferença?',
      points: [
        {
          icon: 'money' as const,
          title: 'Economia real no bolso',
          description: 'Escolher errado pode custar R$200-400 por mês a mais. Em um ano, isso é quase R$5.000.',
        },
        {
          icon: 'chart' as const,
          title: 'Preços mudam toda semana',
          description: 'O que compensava ontem pode não compensar hoje. Calcule sempre antes de abastecer.',
        },
        {
          icon: 'target' as const,
          title: 'Consumo varia por veículo',
          description: 'A "regra dos 70%" é uma média. Seu carro pode render mais ou menos com etanol.',
        },
        {
          icon: 'time' as const,
          title: 'Decisão em segundos',
          description: 'Com esta ferramenta, você descobre a melhor opção enquanto está no posto.',
        },
        {
          icon: 'alert' as const,
          title: 'Evite decisões por impulso',
          description: 'Abastecer "no feeling" ou pelo preço por litro engana — o que importa é custo por km.',
        },
        {
          icon: 'shield' as const,
          title: 'Planeje seus custos',
          description: 'Saber quanto vai gastar por mês com combustível ajuda no planejamento financeiro.',
        },
      ],
    },
    commonMistakes: {
      title: 'Erros comuns ao escolher combustível',
      mistakes: [
        {
          mistake: 'Seguir a "regra dos 70%" cegamente',
          consequence: 'Essa regra é uma média. Se seu carro rende bem com etanol, pode compensar mesmo acima de 70%.',
        },
        {
          mistake: 'Olhar só o preço por litro',
          consequence: 'O que importa é custo por km rodado. Gasolina mais cara pode sair mais barata se render mais.',
        },
        {
          mistake: 'Não conhecer o consumo real do seu carro',
          consequence: 'O consumo varia muito com trânsito e estilo de direção. Use valores reais, não os do manual.',
        },
        {
          mistake: 'Misturar combustíveis sem critério',
          consequence: 'Misturar pode afetar o consumo de formas imprevisíveis. Escolha um e complete.',
        },
        {
          mistake: 'Ignorar a qualidade do combustível',
          consequence: 'Combustível adulterado pode danificar o motor e aumentar o consumo a longo prazo.',
        },
      ],
    },
    cta: {
      title: 'Quer economizar ainda mais?',
      description: 'Além do combustível certo, conheça outras formas de reduzir seus custos como motorista de aplicativo.',
      buttonText: 'Ver Dicas de Economia',
      buttonLink: '/pt-BR/guias',
    },
    faq: {
      title: 'Perguntas Frequentes',
      items: [
        {
          question: 'A regra dos 70% realmente funciona?',
          answer: 'É uma boa aproximação, mas não é exata. A regra diz que etanol compensa se custar até 70% do preço da gasolina. Mas isso assume consumo 30% maior com etanol, que varia por veículo.',
        },
        {
          question: 'Como descubro o consumo real do meu carro?',
          answer: 'Encha o tanque, zere o odômetro, rode normalmente, e na próxima vez que abastecer, divida os km rodados pelos litros abastecidos. Faça isso algumas vezes para ter uma média.',
        },
        {
          question: 'Etanol danifica o motor?',
          answer: 'Não, carros flex são projetados para isso. Mas etanol pode ressecar algumas borrachas se o carro ficar muito tempo parado.',
        },
        {
          question: 'Vale trocar de posto para economizar centavos?',
          answer: 'Depende da distância. Se você vai gastar combustível para ir a outro posto, calcule se a economia compensa o deslocamento.',
        },
        {
          question: 'Posso misturar gasolina e etanol?',
          answer: 'Sim, carros flex aceitam qualquer proporção. Mas o computador de bordo precisa de alguns km para se ajustar à nova mistura.',
        },
      ],
    },
  },
  'en-US': {
    intro: {
      title: 'Gas or ethanol: which one pays off for you?',
      content: 'The question is common: should I fill up with gasoline or ethanol? The 70% rule everyone repeats doesn\'t always work in practice. It depends on your vehicle\'s actual fuel economy, which varies with traffic, air conditioning, and driving style. This calculator does the exact math for you, considering current prices and your car\'s specific consumption — no guessing, just math.',
    },
    whyMatters: {
      title: 'Why does choosing the right fuel matter?',
      points: [
        {
          icon: 'money' as const,
          title: 'Real savings in your pocket',
          description: 'Choosing wrong can cost $100-200 more per month. In a year, that\'s almost $2,000.',
        },
        {
          icon: 'chart' as const,
          title: 'Prices change every week',
          description: 'What paid off yesterday may not pay off today. Always calculate before filling up.',
        },
        {
          icon: 'target' as const,
          title: 'Consumption varies by vehicle',
          description: 'The "70% rule" is an average. Your car may perform better or worse with ethanol.',
        },
        {
          icon: 'time' as const,
          title: 'Decision in seconds',
          description: 'With this tool, you find the best option while at the gas station.',
        },
        {
          icon: 'alert' as const,
          title: 'Avoid impulse decisions',
          description: 'Filling up "by feeling" or by price per gallon is misleading — what matters is cost per mile.',
        },
        {
          icon: 'shield' as const,
          title: 'Plan your costs',
          description: 'Knowing how much you\'ll spend on fuel per month helps with financial planning.',
        },
      ],
    },
    commonMistakes: {
      title: 'Common mistakes when choosing fuel',
      mistakes: [
        {
          mistake: 'Following the "70% rule" blindly',
          consequence: 'This rule is an average. If your car performs well with ethanol, it may pay off even above 70%.',
        },
        {
          mistake: 'Looking only at price per gallon',
          consequence: 'What matters is cost per mile driven. More expensive gas can be cheaper if it gets better mileage.',
        },
        {
          mistake: 'Not knowing your car\'s real consumption',
          consequence: 'Consumption varies greatly with traffic and driving style. Use real values, not manual specs.',
        },
        {
          mistake: 'Mixing fuels without criteria',
          consequence: 'Mixing can affect consumption in unpredictable ways. Choose one and fill up completely.',
        },
        {
          mistake: 'Ignoring fuel quality',
          consequence: 'Adulterated fuel can damage the engine and increase consumption long-term.',
        },
      ],
    },
    cta: {
      title: 'Want to save even more?',
      description: 'Besides the right fuel, discover other ways to reduce your costs as a rideshare driver.',
      buttonText: 'See Money-Saving Tips',
      buttonLink: '/en-US/guides',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'Does the 70% rule really work?',
          answer: 'It\'s a good approximation, but not exact. The rule says ethanol pays off if it costs up to 70% of gas price. But this assumes 30% worse mileage with ethanol, which varies by vehicle.',
        },
        {
          question: 'How do I find my car\'s real fuel economy?',
          answer: 'Fill the tank, reset the odometer, drive normally, and next time you fill up, divide miles driven by gallons used. Do this several times for an average.',
        },
        {
          question: 'Does ethanol damage the engine?',
          answer: 'No, flex-fuel cars are designed for it. But ethanol can dry out some rubber parts if the car sits idle for too long.',
        },
        {
          question: 'Is it worth going to another station to save a few cents?',
          answer: 'Depends on distance. If you\'ll spend gas going to another station, calculate if savings offset the trip.',
        },
        {
          question: 'Can I mix gasoline and ethanol?',
          answer: 'Yes, flex-fuel cars accept any proportion. But the computer needs a few miles to adjust to the new mix.',
        },
      ],
    },
  },
};

// Monthly Goal Simulator SEO Content
export const monthlyGoalSEO = {
  'pt-BR': {
    intro: {
      title: 'Quanto você precisa trabalhar para alcançar sua meta?',
      content: 'Ter uma meta é importante. Mas saber exatamente como alcançá-la é o que transforma sonho em realidade. Quantas horas por dia? Quantas corridas por semana? Este simulador transforma sua meta de renda em um plano concreto — com números reais baseados no seu ganho médio. Pare de trabalhar no escuro e tenha clareza sobre o esforço necessário para atingir seus objetivos financeiros.',
    },
    whyMatters: {
      title: 'Por que planejar sua meta importa?',
      points: [
        {
          icon: 'target' as const,
          title: 'Transforme metas em ação',
          description: '"Quero ganhar R$5.000" vira "preciso fazer 15 corridas por dia, 6 dias por semana". Ação concreta.',
        },
        {
          icon: 'time' as const,
          title: 'Saiba se é realista',
          description: 'Sua meta exige 14 horas por dia? Talvez precise ajustar expectativas ou aumentar o ganho por corrida.',
        },
        {
          icon: 'chart' as const,
          title: 'Acompanhe seu progresso',
          description: 'Com números claros, você sabe se está no caminho certo ou precisa acelerar.',
        },
        {
          icon: 'money' as const,
          title: 'Calcule variações',
          description: 'Se aumentar suas horas em 20%, quanto mais vai ganhar? Simule diferentes cenários.',
        },
        {
          icon: 'shield' as const,
          title: 'Evite burnout',
          description: 'Metas impossíveis levam à exaustão. Planejamento realista te mantém saudável e produtivo.',
        },
        {
          icon: 'alert' as const,
          title: 'Identifique gargalos',
          description: 'Se sua meta exige mais horas do que você tem, precisa aumentar o ganho por hora.',
        },
      ],
    },
    commonMistakes: {
      title: 'Erros que impedem motoristas de atingir metas',
      mistakes: [
        {
          mistake: 'Ter metas vagas',
          consequence: '"Quero ganhar mais" não leva a lugar nenhum. Defina um número específico e um prazo.',
        },
        {
          mistake: 'Ignorar sazonalidade',
          consequence: 'Demanda varia no mês. Início e fim de mês costumam ser mais fracos.',
        },
        {
          mistake: 'Não ajustar a estratégia',
          consequence: 'Se não está atingindo a meta, continuar fazendo igual não vai mudar o resultado.',
        },
        {
          mistake: 'Focar só em horas trabalhadas',
          consequence: 'Às vezes trabalhar menos em horários melhores rende mais do que trabalhar muito em horários ruins.',
        },
        {
          mistake: 'Esquecer dos custos',
          consequence: 'Sua meta é de faturamento ou de lucro líquido? Faz toda diferença no cálculo.',
        },
      ],
    },
    cta: {
      title: 'Quer aumentar seu ganho por hora?',
      description: 'Se sua meta exige muitas horas, talvez o segredo seja ganhar mais por corrida. Veja estratégias comprovadas.',
      buttonText: 'Ver Estratégias de Ganho',
      buttonLink: '/pt-BR/guias',
    },
    faq: {
      title: 'Perguntas Frequentes',
      items: [
        {
          question: 'Qual é uma meta realista para um motorista de aplicativo?',
          answer: 'Varia muito por cidade, mas a média nacional fica entre R$3.000 e R$6.000 mensais trabalhando período integral. Motoristas em capitais podem ganhar mais.',
        },
        {
          question: 'Quantas horas devo trabalhar por dia?',
          answer: 'A maioria dos motoristas full-time trabalha 8-10 horas por dia. Acima de 12 horas, o rendimento cai pela fadiga e risco de acidentes.',
        },
        {
          question: 'Como aumentar meu ganho por hora?',
          answer: 'Foque em: horários de pico, áreas de alta demanda, manter taxa de aceitação que libere promoções, e recusar corridas que não compensam.',
        },
        {
          question: 'Devo trabalhar todos os dias da semana?',
          answer: 'Não necessariamente. Finais de semana geralmente pagam melhor. Trabalhar 6 dias bem escolhidos pode render mais que 7 dias sem estratégia.',
        },
        {
          question: 'Minha meta deve ser de faturamento bruto ou líquido?',
          answer: 'Sempre pense em lucro líquido (após custos). Uma meta de R$5.000 brutos pode virar R$3.000 líquidos após combustível, manutenção e taxas.',
        },
      ],
    },
  },
  'en-US': {
    intro: {
      title: 'How much do you need to work to reach your goal?',
      content: 'Having a goal is important. But knowing exactly how to achieve it is what turns dreams into reality. How many hours per day? How many rides per week? This simulator transforms your income goal into a concrete plan — with real numbers based on your average earnings. Stop working in the dark and gain clarity about the effort needed to reach your financial objectives.',
    },
    whyMatters: {
      title: 'Why does goal planning matter?',
      points: [
        {
          icon: 'target' as const,
          title: 'Turn goals into action',
          description: '"I want to earn $4,000" becomes "I need 15 rides per day, 6 days per week". Concrete action.',
        },
        {
          icon: 'time' as const,
          title: 'Know if it\'s realistic',
          description: 'Does your goal require 14 hours per day? Maybe you need to adjust expectations or increase earnings per ride.',
        },
        {
          icon: 'chart' as const,
          title: 'Track your progress',
          description: 'With clear numbers, you know if you\'re on track or need to accelerate.',
        },
        {
          icon: 'money' as const,
          title: 'Calculate variations',
          description: 'If you increase hours by 20%, how much more will you earn? Simulate different scenarios.',
        },
        {
          icon: 'shield' as const,
          title: 'Avoid burnout',
          description: 'Impossible goals lead to exhaustion. Realistic planning keeps you healthy and productive.',
        },
        {
          icon: 'alert' as const,
          title: 'Identify bottlenecks',
          description: 'If your goal requires more hours than you have, you need to increase earnings per hour.',
        },
      ],
    },
    commonMistakes: {
      title: 'Mistakes that prevent drivers from reaching goals',
      mistakes: [
        {
          mistake: 'Having vague goals',
          consequence: '"I want to earn more" leads nowhere. Set a specific number and deadline.',
        },
        {
          mistake: 'Ignoring seasonality',
          consequence: 'Demand varies during the month. Beginning and end of month are usually slower.',
        },
        {
          mistake: 'Not adjusting strategy',
          consequence: 'If you\'re not reaching the goal, continuing the same won\'t change results.',
        },
        {
          mistake: 'Focusing only on hours worked',
          consequence: 'Sometimes working less during better hours earns more than working a lot during slow hours.',
        },
        {
          mistake: 'Forgetting about costs',
          consequence: 'Is your goal gross revenue or net profit? Makes a huge difference in calculations.',
        },
      ],
    },
    cta: {
      title: 'Want to increase your hourly earnings?',
      description: 'If your goal requires too many hours, maybe the secret is earning more per ride. See proven strategies.',
      buttonText: 'See Earning Strategies',
      buttonLink: '/en-US/guides',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'What is a realistic goal for a rideshare driver?',
          answer: 'Varies greatly by city, but the national average falls between $2,500 and $5,000 monthly working full-time. Drivers in major cities can earn more.',
        },
        {
          question: 'How many hours should I work per day?',
          answer: 'Most full-time drivers work 8-10 hours per day. Above 12 hours, performance drops due to fatigue and accident risk.',
        },
        {
          question: 'How can I increase my hourly earnings?',
          answer: 'Focus on: peak hours, high-demand areas, maintaining acceptance rates that unlock bonuses, and declining rides that don\'t pay well.',
        },
        {
          question: 'Should I work every day of the week?',
          answer: 'Not necessarily. Weekends usually pay better. Working 6 well-chosen days can earn more than 7 days without strategy.',
        },
        {
          question: 'Should my goal be gross or net income?',
          answer: 'Always think net profit (after costs). A $4,000 gross goal might become $2,500 net after fuel, maintenance, and fees.',
        },
      ],
    },
  },
};

// Hidden Costs Calculator SEO Content
export const hiddenCostsSEO = {
  'pt-BR': {
    intro: {
      title: 'Você está ignorando custos que comem seu lucro?',
      content: 'Combustível e taxas da plataforma são óbvios. Mas e a depreciação do carro? O desgaste dos pneus? A manutenção que você vai precisar fazer? Esses custos "invisíveis" corroem seu lucro silenciosamente. Muitos motoristas descobrem tarde demais que estavam trabalhando com margem negativa. Esta calculadora revela todos os custos que você pode estar esquecendo — para que você saiba de verdade quanto está ganhando.',
    },
    whyMatters: {
      title: 'Por que conhecer os custos ocultos é vital?',
      points: [
        {
          icon: 'alert' as const,
          title: 'Evite surpresas desagradáveis',
          description: 'Aquela manutenção de R$2.000 não veio do nada — você foi acumulando o custo km por km.',
        },
        {
          icon: 'money' as const,
          title: 'Calcule seu lucro real',
          description: 'Sem conhecer todos os custos, você não sabe se está lucrando ou perdendo dinheiro.',
        },
        {
          icon: 'chart' as const,
          title: 'Precifique corretamente',
          description: 'Saber seu custo real por km ajuda a decidir quais corridas aceitar.',
        },
        {
          icon: 'time' as const,
          title: 'Planeje trocas e manutenções',
          description: 'Com o custo por km, você sabe quanto reservar por mês para manutenção.',
        },
        {
          icon: 'shield' as const,
          title: 'Proteja seu patrimônio',
          description: 'Seu carro é sua ferramenta de trabalho. Conhecer a depreciação ajuda a planejar a troca.',
        },
        {
          icon: 'target' as const,
          title: 'Compare com outras opções',
          description: 'Será que vale mais a pena alugar um carro? Só com os números você pode comparar.',
        },
      ],
    },
    commonMistakes: {
      title: 'Custos que motoristas ignoram (e não deveriam)',
      mistakes: [
        {
          mistake: 'Ignorar a depreciação do veículo',
          consequence: 'Seu carro perde R$0,10-0,30 por km rodado. Em 50.000 km/ano, são R$5.000-15.000 de desvalorização.',
        },
        {
          mistake: 'Esquecer o seguro pessoal',
          consequence: 'O seguro do carro não cobre você. Um afastamento pode acabar com suas economias.',
        },
        {
          mistake: 'Não contabilizar celular e internet',
          consequence: 'Plano de dados, suporte de celular, carregador — são R$100-200/mês fácil.',
        },
        {
          mistake: 'Subestimar manutenção preventiva',
          consequence: 'Óleo, filtros, pneus, freios — cada item tem custo por km que deve entrar no cálculo.',
        },
        {
          mistake: 'Ignorar custos de saúde',
          consequence: 'Plano de saúde, consultas, problemas de coluna — são custos reais do trabalho.',
        },
      ],
    },
    cta: {
      title: 'Quer reduzir seus custos operacionais?',
      description: 'Agora que você conhece todos os custos, veja como otimizá-los sem comprometer qualidade.',
      buttonText: 'Ver Dicas de Redução de Custos',
      buttonLink: '/pt-BR/guias',
    },
    faq: {
      title: 'Perguntas Frequentes',
      items: [
        {
          question: 'Quanto custa a depreciação por km rodado?',
          answer: 'Varia muito pelo modelo e ano do carro. Em média, carros populares perdem R$0,10-0,20 por km. Carros mais novos e caros podem perder R$0,30+ por km.',
        },
        {
          question: 'Devo incluir o financiamento como custo?',
          answer: 'Se você usa o carro só para trabalho, sim. A parcela do financiamento é um custo operacional. Se usa também pessoalmente, calcule a proporção.',
        },
        {
          question: 'Como calcular o custo de manutenção por km?',
          answer: 'Some todas as manutenções do último ano e divida pela km rodada. Inclua óleo, filtros, pneus, freios, e reparos. A média fica entre R$0,08-0,15 por km.',
        },
        {
          question: 'Vale a pena trocar de carro por um mais econômico?',
          answer: 'Faça as contas. Se a economia de combustível e manutenção supera o custo da troca (incluindo depreciação), pode valer a pena.',
        },
        {
          question: 'Quanto devo guardar por mês para manutenção?',
          answer: 'Multiplique sua km mensal pelo custo de manutenção por km (R$0,08-0,15). Para 3.000 km/mês, reserve R$240-450 mensais.',
        },
      ],
    },
  },
  'en-US': {
    intro: {
      title: 'Are you ignoring costs that eat into your profit?',
      content: 'Fuel and platform fees are obvious. But what about car depreciation? Tire wear? Maintenance you\'ll need to do? These "invisible" costs silently erode your profit. Many drivers discover too late they were working at a negative margin. This calculator reveals all the costs you might be forgetting — so you truly know how much you\'re earning.',
    },
    whyMatters: {
      title: 'Why is knowing hidden costs vital?',
      points: [
        {
          icon: 'alert' as const,
          title: 'Avoid unpleasant surprises',
          description: 'That $1,500 repair didn\'t come from nowhere — you were accumulating the cost mile by mile.',
        },
        {
          icon: 'money' as const,
          title: 'Calculate your real profit',
          description: 'Without knowing all costs, you don\'t know if you\'re profiting or losing money.',
        },
        {
          icon: 'chart' as const,
          title: 'Price correctly',
          description: 'Knowing your real cost per mile helps decide which rides to accept.',
        },
        {
          icon: 'time' as const,
          title: 'Plan replacements and maintenance',
          description: 'With cost per mile, you know how much to set aside monthly for maintenance.',
        },
        {
          icon: 'shield' as const,
          title: 'Protect your asset',
          description: 'Your car is your work tool. Knowing depreciation helps plan replacement.',
        },
        {
          icon: 'target' as const,
          title: 'Compare with other options',
          description: 'Is it better to rent a car? Only with numbers can you compare.',
        },
      ],
    },
    commonMistakes: {
      title: 'Costs drivers ignore (but shouldn\'t)',
      mistakes: [
        {
          mistake: 'Ignoring vehicle depreciation',
          consequence: 'Your car loses $0.05-0.20 per mile driven. At 30,000 miles/year, that\'s $1,500-6,000 in depreciation.',
        },
        {
          mistake: 'Forgetting personal insurance',
          consequence: 'Car insurance doesn\'t cover you. A work absence can wipe out your savings.',
        },
        {
          mistake: 'Not accounting for phone and data',
          consequence: 'Data plan, phone mount, charger — easily $50-100/month.',
        },
        {
          mistake: 'Underestimating preventive maintenance',
          consequence: 'Oil, filters, tires, brakes — each item has a cost per mile that should factor in.',
        },
        {
          mistake: 'Ignoring health costs',
          consequence: 'Health insurance, checkups, back problems — are real costs of the job.',
        },
      ],
    },
    cta: {
      title: 'Want to reduce your operating costs?',
      description: 'Now that you know all costs, see how to optimize them without compromising quality.',
      buttonText: 'See Cost Reduction Tips',
      buttonLink: '/en-US/guides',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'How much does depreciation cost per mile?',
          answer: 'Varies greatly by model and year. On average, economy cars lose $0.05-0.15 per mile. Newer and more expensive cars can lose $0.20+ per mile.',
        },
        {
          question: 'Should I include car payments as a cost?',
          answer: 'If you use the car only for work, yes. The car payment is an operating cost. If also used personally, calculate the proportion.',
        },
        {
          question: 'How do I calculate maintenance cost per mile?',
          answer: 'Add all maintenance from the last year and divide by miles driven. Include oil, filters, tires, brakes, and repairs. Average falls between $0.05-0.10 per mile.',
        },
        {
          question: 'Is it worth switching to a more fuel-efficient car?',
          answer: 'Do the math. If fuel and maintenance savings exceed the cost of switching (including depreciation), it may be worth it.',
        },
        {
          question: 'How much should I set aside monthly for maintenance?',
          answer: 'Multiply monthly miles by maintenance cost per mile ($0.05-0.10). For 2,000 miles/month, set aside $100-200 monthly.',
        },
      ],
    },
  },
};

// Break-Even Calculator SEO Content
export const breakEvenSEO = {
  'pt-BR': {
    intro: {
      title: 'Quanto você precisa faturar para não ter prejuízo?',
      content: 'O ponto de equilíbrio é o número mágico que todo motorista deveria conhecer: é o faturamento mínimo necessário para cobrir todos os seus custos. Abaixo dele, você está perdendo dinheiro. Acima, começa a lucrar. Esta calculadora soma todos os seus custos — fixos e variáveis — e mostra exatamente quanto você precisa faturar por mês, semana e dia para chegar ao zero. É o primeiro passo para sair do vermelho e começar a construir lucro real.',
    },
    whyMatters: {
      title: 'Por que conhecer seu ponto de equilíbrio é fundamental?',
      points: [
        {
          icon: 'target' as const,
          title: 'Saiba sua meta mínima',
          description: 'Antes de pensar em lucro, você precisa cobrir custos. O ponto de equilíbrio é seu piso.',
        },
        {
          icon: 'alert' as const,
          title: 'Identifique prejuízo cedo',
          description: 'Se você não está atingindo o ponto de equilíbrio, está literalmente pagando para trabalhar.',
        },
        {
          icon: 'money' as const,
          title: 'Calcule seu lucro real',
          description: 'Tudo que você fatura ACIMA do ponto de equilíbrio é lucro. Abaixo, é prejuízo.',
        },
        {
          icon: 'chart' as const,
          title: 'Tome decisões estratégicas',
          description: 'Reduzir custos ou aumentar faturamento? O ponto de equilíbrio mostra o que impacta mais.',
        },
        {
          icon: 'time' as const,
          title: 'Planeje folgas com segurança',
          description: 'Saber seu ponto de equilíbrio ajuda a calcular quantos dias você pode folgar sem prejuízo.',
        },
        {
          icon: 'shield' as const,
          title: 'Negocie com conhecimento',
          description: 'Ao trocar de plataforma ou negociar condições, você sabe exatamente seu limite.',
        },
      ],
    },
    commonMistakes: {
      title: 'Erros que mantêm motoristas no prejuízo',
      mistakes: [
        {
          mistake: 'Não conhecer todos os custos fixos',
          consequence: 'IPVA, licenciamento, seguro — se não estão no cálculo, seu ponto de equilíbrio está errado.',
        },
        {
          mistake: 'Ignorar custos variáveis',
          consequence: 'Combustível, manutenção, desgaste — variam com km rodada mas são reais.',
        },
        {
          mistake: 'Confundir faturamento com lucro',
          consequence: 'R$5.000 de faturamento pode significar R$0 de lucro se seus custos forem R$5.000.',
        },
        {
          mistake: 'Não recalcular quando custos mudam',
          consequence: 'Gasolina subiu? Parcela do carro aumentou? Seu ponto de equilíbrio mudou também.',
        },
        {
          mistake: 'Trabalhar sem meta clara',
          consequence: 'Sem saber o mínimo necessário, você não tem como avaliar se está indo bem ou mal.',
        },
      ],
    },
    cta: {
      title: 'Quer sair do ponto de equilíbrio e começar a lucrar?',
      description: 'Agora que você sabe seu mínimo, veja estratégias para aumentar sua margem de lucro.',
      buttonText: 'Ver Estratégias de Lucro',
      buttonLink: '/pt-BR/guias',
    },
    faq: {
      title: 'Perguntas Frequentes',
      items: [
        {
          question: 'Qual é o ponto de equilíbrio médio de um motorista de app?',
          answer: 'Varia muito, mas a maioria dos motoristas precisa faturar entre R$2.500 e R$4.000 por mês só para cobrir custos (sem lucro).',
        },
        {
          question: 'Como reduzir meu ponto de equilíbrio?',
          answer: 'Reduza custos fixos (negocie seguro, considere carro mais barato) ou variáveis (economize combustível, faça manutenção preventiva).',
        },
        {
          question: 'Devo incluir meu salário no ponto de equilíbrio?',
          answer: 'O ponto de equilíbrio básico não inclui. Mas você pode adicionar um "pró-labore" como custo fixo para garantir renda mínima.',
        },
        {
          question: 'E se eu não atingir o ponto de equilíbrio?',
          answer: 'Você está tendo prejuízo real. Precisa trabalhar mais horas, em horários melhores, ou reduzir custos urgentemente.',
        },
        {
          question: 'Com que frequência devo recalcular?',
          answer: 'Sempre que um custo importante mudar: preço do combustível, parcela, seguro, ou se você trocar de carro.',
        },
      ],
    },
  },
  'en-US': {
    intro: {
      title: 'How much do you need to earn to break even?',
      content: 'The break-even point is the magic number every driver should know: it\'s the minimum revenue needed to cover all your costs. Below it, you\'re losing money. Above it, you start profiting. This calculator adds up all your costs — fixed and variable — and shows exactly how much you need to earn per month, week, and day to reach zero. It\'s the first step to getting out of the red and building real profit.',
    },
    whyMatters: {
      title: 'Why is knowing your break-even point fundamental?',
      points: [
        {
          icon: 'target' as const,
          title: 'Know your minimum goal',
          description: 'Before thinking about profit, you need to cover costs. Break-even is your floor.',
        },
        {
          icon: 'alert' as const,
          title: 'Identify losses early',
          description: 'If you\'re not reaching break-even, you\'re literally paying to work.',
        },
        {
          icon: 'money' as const,
          title: 'Calculate your real profit',
          description: 'Everything you earn ABOVE break-even is profit. Below, it\'s loss.',
        },
        {
          icon: 'chart' as const,
          title: 'Make strategic decisions',
          description: 'Reduce costs or increase revenue? Break-even shows what impacts more.',
        },
        {
          icon: 'time' as const,
          title: 'Plan time off safely',
          description: 'Knowing your break-even helps calculate how many days you can take off without loss.',
        },
        {
          icon: 'shield' as const,
          title: 'Negotiate with knowledge',
          description: 'When switching platforms or negotiating conditions, you know exactly your limit.',
        },
      ],
    },
    commonMistakes: {
      title: 'Mistakes that keep drivers in the red',
      mistakes: [
        {
          mistake: 'Not knowing all fixed costs',
          consequence: 'Registration, insurance, taxes — if not in the calculation, your break-even is wrong.',
        },
        {
          mistake: 'Ignoring variable costs',
          consequence: 'Fuel, maintenance, wear — vary with miles but are real.',
        },
        {
          mistake: 'Confusing revenue with profit',
          consequence: '$4,000 revenue can mean $0 profit if your costs are $4,000.',
        },
        {
          mistake: 'Not recalculating when costs change',
          consequence: 'Gas went up? Car payment increased? Your break-even changed too.',
        },
        {
          mistake: 'Working without a clear goal',
          consequence: 'Without knowing the minimum needed, you can\'t evaluate if you\'re doing well or poorly.',
        },
      ],
    },
    cta: {
      title: 'Want to go beyond break-even and start profiting?',
      description: 'Now that you know your minimum, see strategies to increase your profit margin.',
      buttonText: 'See Profit Strategies',
      buttonLink: '/en-US/guides',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'What is the average break-even point for a rideshare driver?',
          answer: 'Varies greatly, but most drivers need to earn between $2,000 and $3,500 per month just to cover costs (no profit).',
        },
        {
          question: 'How can I reduce my break-even point?',
          answer: 'Reduce fixed costs (negotiate insurance, consider cheaper car) or variable costs (save fuel, do preventive maintenance).',
        },
        {
          question: 'Should I include my salary in break-even?',
          answer: 'Basic break-even doesn\'t include it. But you can add a "salary" as a fixed cost to ensure minimum income.',
        },
        {
          question: 'What if I don\'t reach break-even?',
          answer: 'You\'re having real losses. Need to work more hours, at better times, or urgently reduce costs.',
        },
        {
          question: 'How often should I recalculate?',
          answer: 'Whenever an important cost changes: fuel price, car payment, insurance, or if you switch cars.',
        },
      ],
    },
  },
};

// Driver Budget Simulator SEO Content
export const driverBudgetSEO = {
  'pt-BR': {
    intro: {
      title: 'Você sabe exatamente para onde vai seu dinheiro?',
      content: 'Motoristas de aplicativo têm dezenas de despesas: do IPVA ao plano de celular, da gasolina ao lanche na rua. Quando você não tem clareza sobre todas elas, o dinheiro some e você não sabe explicar para onde foi. Este simulador organiza TODAS as suas despesas — pessoais e profissionais — em um só lugar, mostrando exatamente quanto você precisa faturar para sobreviver e quanto sobra para realizar seus objetivos.',
    },
    whyMatters: {
      title: 'Por que ter um orçamento completo é essencial?',
      points: [
        {
          icon: 'chart' as const,
          title: 'Visão completa das finanças',
          description: 'Custos do carro, despesas pessoais, gastos do trabalho — tudo em um só lugar.',
        },
        {
          icon: 'money' as const,
          title: 'Saiba seu mínimo para sobreviver',
          description: 'Quanto você PRECISA faturar por mês para pagar todas as contas?',
        },
        {
          icon: 'target' as const,
          title: 'Planeje metas reais',
          description: 'Com as despesas mapeadas, você sabe quanto pode guardar ou investir.',
        },
        {
          icon: 'alert' as const,
          title: 'Identifique gastos excessivos',
          description: 'Ver todos os gastos juntos revela onde você pode economizar.',
        },
        {
          icon: 'time' as const,
          title: 'Planeje folgas e férias',
          description: 'Sabendo suas despesas, você calcula quanto precisa guardar para tirar uns dias.',
        },
        {
          icon: 'shield' as const,
          title: 'Prepare-se para imprevistos',
          description: 'Um orçamento sólido te permite criar reserva de emergência.',
        },
      ],
    },
    commonMistakes: {
      title: 'Erros de orçamento que quebram motoristas',
      mistakes: [
        {
          mistake: 'Misturar finanças pessoais e do trabalho',
          consequence: 'Sem separação, você não sabe se o trabalho está dando lucro ou se você está cobrindo prejuízo com outras rendas.',
        },
        {
          mistake: 'Esquecer despesas anuais',
          consequence: 'IPVA, licenciamento, seguro — se não reservar mensalmente, a conta chega e você não tem.',
        },
        {
          mistake: 'Não ter margem para imprevistos',
          consequence: 'Uma multa, um reparo, uma doença — sem margem, qualquer imprevisto vira crise.',
        },
        {
          mistake: 'Gastar todo o faturamento',
          consequence: 'Motoristas bem-sucedidos guardam pelo menos 10-20% do que ganham.',
        },
        {
          mistake: 'Não revisar o orçamento regularmente',
          consequence: 'Preços mudam, situações mudam. Um orçamento desatualizado é quase inútil.',
        },
      ],
    },
    cta: {
      title: 'Quer organizar suas finanças de vez?',
      description: 'Este simulador é o primeiro passo. Veja guias completos sobre finanças para motoristas de aplicativo.',
      buttonText: 'Ver Guias Financeiros',
      buttonLink: '/pt-BR/guias',
    },
    faq: {
      title: 'Perguntas Frequentes',
      items: [
        {
          question: 'Quanto um motorista de app deveria gastar por mês?',
          answer: 'Varia muito por cidade e estilo de vida. Mas a maioria precisa de R$3.000-5.000 mensais para cobrir custos pessoais + profissionais.',
        },
        {
          question: 'Devo separar conta pessoal e do trabalho?',
          answer: 'Idealmente sim. Ter contas separadas facilita muito o controle e você sabe exatamente quanto o trabalho está rendendo.',
        },
        {
          question: 'Quanto devo guardar para emergências?',
          answer: 'O ideal é ter 3-6 meses de despesas guardadas. Comece com uma meta de 1 mês e vá aumentando.',
        },
        {
          question: 'Como lidar com meses ruins?',
          answer: 'Com orçamento controlado e reserva de emergência, meses ruins não viram crise. Por isso o planejamento é tão importante.',
        },
        {
          question: 'Vale a pena fazer um MEI?',
          answer: 'Para a maioria dos motoristas, sim. Permite emitir nota, pagar INSS reduzido, e ter CNPJ para algumas vantagens.',
        },
      ],
    },
  },
  'en-US': {
    intro: {
      title: 'Do you know exactly where your money goes?',
      content: 'Rideshare drivers have dozens of expenses: from vehicle registration to phone plan, from gas to snacks on the road. When you don\'t have clarity on all of them, money disappears and you can\'t explain where it went. This simulator organizes ALL your expenses — personal and professional — in one place, showing exactly how much you need to earn to survive and how much is left to achieve your goals.',
    },
    whyMatters: {
      title: 'Why is having a complete budget essential?',
      points: [
        {
          icon: 'chart' as const,
          title: 'Complete financial overview',
          description: 'Car costs, personal expenses, work expenses — all in one place.',
        },
        {
          icon: 'money' as const,
          title: 'Know your survival minimum',
          description: 'How much do you NEED to earn per month to pay all bills?',
        },
        {
          icon: 'target' as const,
          title: 'Plan real goals',
          description: 'With expenses mapped, you know how much you can save or invest.',
        },
        {
          icon: 'alert' as const,
          title: 'Identify excessive spending',
          description: 'Seeing all expenses together reveals where you can save.',
        },
        {
          icon: 'time' as const,
          title: 'Plan time off and vacation',
          description: 'Knowing your expenses, you calculate how much to save for days off.',
        },
        {
          icon: 'shield' as const,
          title: 'Prepare for emergencies',
          description: 'A solid budget allows you to build an emergency fund.',
        },
      ],
    },
    commonMistakes: {
      title: 'Budget mistakes that break drivers',
      mistakes: [
        {
          mistake: 'Mixing personal and work finances',
          consequence: 'Without separation, you don\'t know if work is profitable or if you\'re covering losses with other income.',
        },
        {
          mistake: 'Forgetting annual expenses',
          consequence: 'Registration, insurance, taxes — if you don\'t save monthly, the bill arrives and you don\'t have it.',
        },
        {
          mistake: 'Having no margin for emergencies',
          consequence: 'A ticket, a repair, an illness — without margin, any unexpected event becomes a crisis.',
        },
        {
          mistake: 'Spending all revenue',
          consequence: 'Successful drivers save at least 10-20% of what they earn.',
        },
        {
          mistake: 'Not reviewing budget regularly',
          consequence: 'Prices change, situations change. An outdated budget is almost useless.',
        },
      ],
    },
    cta: {
      title: 'Want to organize your finances for good?',
      description: 'This simulator is the first step. See complete guides on finances for rideshare drivers.',
      buttonText: 'See Financial Guides',
      buttonLink: '/en-US/guides',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'How much should a rideshare driver spend per month?',
          answer: 'Varies greatly by city and lifestyle. But most need $2,500-4,000 monthly to cover personal + professional costs.',
        },
        {
          question: 'Should I separate personal and work accounts?',
          answer: 'Ideally yes. Having separate accounts makes control much easier and you know exactly how much work is yielding.',
        },
        {
          question: 'How much should I save for emergencies?',
          answer: 'Ideal is 3-6 months of expenses saved. Start with a 1-month goal and increase gradually.',
        },
        {
          question: 'How to handle bad months?',
          answer: 'With controlled budget and emergency fund, bad months don\'t become crises. That\'s why planning is so important.',
        },
        {
          question: 'Is it worth becoming an LLC?',
          answer: 'For most drivers, it can help with taxes and liability protection. Consult a tax professional for your situation.',
        },
      ],
    },
  },
};

