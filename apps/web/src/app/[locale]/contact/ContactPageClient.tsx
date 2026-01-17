'use client';

import React from 'react';
import ContactForm from '@/components/ContactForm';
import { Mail, MapPin, Phone } from 'lucide-react';

interface ContactPageClientProps {
  locale: string;
}

export default function ContactPageClient({ locale }: ContactPageClientProps) {
  const isPtBr = locale === 'pt-BR';

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            {isPtBr ? 'Entre em Contato' : 'Get in Touch'}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {isPtBr
              ? 'Tem alguma dúvida, sugestão ou precisa de ajuda? Estamos aqui para ajudar!'
              : 'Have a question, suggestion, or need help? We\'re here to help!'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isPtBr ? 'Informações de Contato' : 'Contact Information'}
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Mail className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {isPtBr ? 'Email' : 'Email'}
                    </h3>
                    <a
                      href="#"
                      className="text-brand-600 hover:text-brand-700 transition-colors"
                      rel="nofollow"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = 'mailto:contato@gigsafehub.com';
                      }}
                    >
                      contato@gigsafehub.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <MapPin className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {isPtBr ? 'Localização' : 'Location'}
                    </h3>
                    <p className="text-slate-600">
                      {isPtBr ? 'Brasil' : 'Brazil'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Phone className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {isPtBr ? 'Horário de Atendimento' : 'Business Hours'}
                    </h3>
                    <p className="text-slate-600">
                      {isPtBr
                        ? 'Segunda a Sexta, 9h às 18h (BRT)'
                        : 'Monday to Friday, 9 AM to 6 PM (BRT)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-brand-50 rounded-xl border border-brand-200 p-6">
              <h3 className="font-semibold text-brand-900 mb-2">
                {isPtBr ? 'Resposta Rápida' : 'Quick Response'}
              </h3>
              <p className="text-brand-700 text-sm">
                {isPtBr
                  ? 'Geralmente respondemos em até 24 horas úteis.'
                  : 'We typically respond within 24 business hours.'}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
