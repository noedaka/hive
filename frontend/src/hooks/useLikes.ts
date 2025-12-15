import { useState, useCallback, useEffect } from 'react';
import { likesApi } from '../api/likes';

export const useLike = (postId: number | string, initialLikes: number) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
    if (likedPosts[postId]) {
      setIsLiked(true);
    }
  }, [postId]);

  const toggleLike = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const previousLikes = likes;
    const previousIsLiked = isLiked;
    
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : likes - 1;

    setIsLiked(newIsLiked);
    setLikes(newLikes);

    try {
      if (newIsLiked) {
        await likesApi.likePost(postId);
      } else {
        await likesApi.unlikePost(postId);
      }

      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
      if (newIsLiked) {
        likedPosts[postId] = true;
      } else {
        delete likedPosts[postId];
      }
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

    } catch (err) {
      setIsLiked(previousIsLiked);
      setLikes(previousLikes);
      
      const message = err instanceof Error ? err.message : 'Failed to toggle like';
      setError(message);
      console.error('Like error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [postId, isLiked, likes]);

  return {
    likes,
    isLiked,
    isLoading,
    error,
    toggleLike,
  };
};