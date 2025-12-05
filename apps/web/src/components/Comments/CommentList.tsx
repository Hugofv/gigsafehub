'use client';

import React from 'react';
import { parseLocalDate } from '@/lib/dateUtils';
import type { Comment } from '@/services/comments';

interface CommentListProps {
  comments: Comment[];
  locale: string;
}

export default function CommentList({ comments, locale }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 text-center">
        <p className="text-slate-500">
          {locale === 'pt-BR'
            ? 'Ainda não há comentários. Seja o primeiro a comentar!'
            : 'No comments yet. Be the first to comment!'}
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    // For comments, we want to show date and time
    // Comments have timestamps, so we parse them normally but format as local
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900">
          {locale === 'pt-BR' ? 'Comentários' : 'Comments'} ({comments.length})
        </h3>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-brand-600 font-semibold text-lg">
                    {comment.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{comment.name}</h4>
                  <time className="text-sm text-slate-500">{formatDate(comment.createdAt)}</time>
                </div>
              </div>
            </div>
            <p className="text-slate-700 whitespace-pre-wrap">{comment.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

