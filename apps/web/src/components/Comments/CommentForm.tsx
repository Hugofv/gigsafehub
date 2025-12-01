'use client';

import React, { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { createComment } from '@/services/comments';

interface CommentFormProps {
  articleId: string;
  onCommentSubmitted: () => void;
  locale: string;
}

export default function CommentForm({ articleId, onCommentSubmitted, locale }: CommentFormProps) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createComment(articleId, formData);
      toast.success(
        locale === 'pt-BR'
          ? 'Comentário enviado com sucesso!'
          : 'Comment submitted successfully!'
      );
      setFormData({ name: '', email: '', message: '' });
      onCommentSubmitted();
    } catch (error: any) {
      toast.error(
        error.message ||
          (locale === 'pt-BR'
            ? 'Erro ao enviar comentário. Tente novamente.'
            : 'Error submitting comment. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.message.trim();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
      <h3 className="text-2xl font-bold text-slate-900 mb-4">
        {locale === 'pt-BR' ? 'Deixe um comentário' : 'Leave a comment'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              {locale === 'pt-BR' ? 'Nome' : 'Name'} *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder={locale === 'pt-BR' ? 'Seu nome' : 'Your name'}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              {locale === 'pt-BR' ? 'Email' : 'Email'} *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder={locale === 'pt-BR' ? 'seu@email.com' : 'your@email.com'}
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
            {locale === 'pt-BR' ? 'Mensagem' : 'Message'} *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
            placeholder={
              locale === 'pt-BR'
                ? 'Escreva seu comentário aqui...'
                : 'Write your comment here...'
            }
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full md:w-auto px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting
            ? locale === 'pt-BR'
              ? 'Enviando...'
              : 'Submitting...'
            : locale === 'pt-BR'
              ? 'Enviar comentário'
              : 'Submit comment'}
        </button>
      </form>
    </div>
  );
}

