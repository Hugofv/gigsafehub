import React from 'react';
import { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  noStore(); // Prevent metadata streaming - ensures metadata is in <head> on reload
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const title = locale === 'pt-BR'
    ? 'Sobre Nós - GigSafeHub'
    : 'About Us - GigSafeHub';
  const description = locale === 'pt-BR'
    ? 'Conheça a missão e visão do GigSafeHub. Capacitamos trabalhadores da economia gig com informações transparentes e ferramentas de segurança financeira.'
    : 'Learn about GigSafeHub\'s mission and vision. We empower gig economy workers with transparent information and financial security tools.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/${locale}/about`,
      siteName: 'GigSafeHub',
      locale: locale === 'pt-BR' ? 'pt_BR' : 'en_US',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/about`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

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

// Force dynamic rendering to ensure metadata is always generated on reload
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Always revalidate
