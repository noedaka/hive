import { useState, useEffect, useCallback } from 'react';
import { postsApi } from '../api/posts';
import { type ServerPostResponse, transformServerPostResponseToPost, type Post } from '../types';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const serverResponses: ServerPostResponse[] = await postsApi.getPosts();

      const transformedPosts = serverResponses.map(transformServerPostResponseToPost);
      setPosts(transformedPosts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load posts';
      setError(message);
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    isLoading,
    error,
    refetch: fetchPosts
  };
};