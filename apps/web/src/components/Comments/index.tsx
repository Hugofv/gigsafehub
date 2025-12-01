'use client';

import React, { useEffect, useState } from 'react';
import { getArticleComments, type Comment } from '@/services/comments';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface CommentsSectionProps {
  articleId: string;
  locale: string;
}

export default function CommentsSection({ articleId, locale }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getArticleComments(articleId);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const handleCommentSubmitted = () => {
    // Refresh comments after a new one is submitted
    // Comments are approved by default, so they will appear immediately
    fetchComments();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Comments List */}
      <div>
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">
              {locale === 'pt-BR' ? 'Carregando comentários...' : 'Loading comments...'}
            </p>
          </div>
        ) : (
          <CommentList comments={comments} locale={locale} />
        )}
      </div>

      {/* Comment Form */}
      <CommentForm
        articleId={articleId}
        onCommentSubmitted={handleCommentSubmitted}
        locale={locale}
      />
    </div>
  );
}

