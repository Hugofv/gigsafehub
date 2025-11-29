import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Sobre Nós
          </h1>
          <p className="text-xl text-slate-600">
            Conheça a missão e visão do GigSafeHub
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Nossa Missão</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              O GigSafeHub foi criado para capacitar trabalhadores da economia gig com informações
              transparentes e ferramentas de segurança financeira. Acreditamos que todo freelancer
              merece acesso a análises imparciais e comparações detalhadas de produtos financeiros.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">O Que Fazemos</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Revisamos e comparamos produtos financeiros especificamente projetados para freelancers,
              incluindo seguros, bancos digitais, ferramentas fiscais e investimentos. Nossa equipe
              de especialistas avalia cada produto com base em segurança, custos, recursos e adequação
              para diferentes tipos de profissionais.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Nossos Valores</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>Transparência total em todas as análises</li>
              <li>Independência - não somos influenciados por afiliados</li>
              <li>Foco no trabalhador da economia gig</li>
              <li>Dados atualizados e verificados</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

