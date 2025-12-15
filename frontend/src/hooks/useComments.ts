import { useState, useCallback } from 'react';
import { commentsApi } from '../api/comments';
import type { Comment } from '../types';

export const useComments = (postId: string | number) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createComment = useCallback(async (content: string): Promise<Comment | null> => {
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return null;
    }

    if (content.length > 1000) {
      setError('Comment must be less than 1000 characters');
      return null;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await commentsApi.createComment(postId, content);

      const newComment: Comment = {
        id: Date.now(), 
        author: { userName: 'You' },
        text: content,
        date: new Date().toISOString(),
      };
      
      return newComment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create comment';
      setError(message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [postId]);

  return {
    createComment,
    isSubmitting,
    error,
  };
};