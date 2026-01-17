'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useToast } from '@/contexts/ToastContext';
import { Send, Loader2 } from 'lucide-react';

const contactSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  subject: yup.string().required('Subject is required').min(3, 'Subject must be at least 3 characters'),
  message: yup.string().required('Message is required').min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = yup.InferType<typeof contactSchema>;

interface ContactFormProps {
  locale: string;
}

export default function ContactForm({ locale }: ContactFormProps) {
  const toast = useToast();
  const isPtBr = locale === 'pt-BR';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      toast.success(
        isPtBr
          ? 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
          : 'Message sent successfully! We will get back to you soon.'
      );
      reset();
    } catch (error: any) {
      toast.error(
        error.message ||
          (isPtBr
            ? 'Erro ao enviar mensagem. Tente novamente.'
            : 'Error sending message. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        {isPtBr ? 'Envie sua Mensagem' : 'Send us a Message'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              {isPtBr ? 'Nome' : 'Name'} *
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors ${
                errors.name ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder={isPtBr ? 'Seu nome completo' : 'Your full name'}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              {isPtBr ? 'Email' : 'Email'} *
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors ${
                errors.email ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder={isPtBr ? 'seu@email.com' : 'your@email.com'}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
            {isPtBr ? 'Assunto' : 'Subject'} *
          </label>
          <input
            type="text"
            id="subject"
            {...register('subject')}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors ${
              errors.subject ? 'border-red-300' : 'border-slate-300'
            }`}
            placeholder={
              isPtBr
                ? 'Ex: Dúvida sobre seguros'
                : 'E.g., Question about insurance'
            }
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
            {isPtBr ? 'Mensagem' : 'Message'} *
          </label>
          <textarea
            id="message"
            {...register('message')}
            rows={8}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none transition-colors ${
              errors.message ? 'border-red-300' : 'border-slate-300'
            }`}
            placeholder={
              isPtBr
                ? 'Escreva sua mensagem aqui...'
                : 'Write your message here...'
            }
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto px-8 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{isPtBr ? 'Enviando...' : 'Sending...'}</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>{isPtBr ? 'Enviar Mensagem' : 'Send Message'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
