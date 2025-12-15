import { useState, useEffect, useCallback } from 'react';
import { postsApi } from '../api/posts';
import { 
  type ServerPostResponse, 
  transformServerPostResponseToPost,
  transformServerCommentResponseToComment,
  type Post, 
  type Comment 
} from '../types';

export const usePost = (postId: string | undefined) => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    if (!postId) {
      setError('Post ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const serverResponse: ServerPostResponse = await postsApi.getPost(postId);

      const transformedPost = transformServerPostResponseToPost(serverResponse);
      setPost(transformedPost);

      if (serverResponse.comments && Array.isArray(serverResponse.comments)) {
        const transformedComments = serverResponse.comments.map(
          transformServerCommentResponseToComment
        );
        setComments(transformedComments);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load post';
      setError(message);
      console.error('Error fetching post:', err);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId, fetchPost]);

  return {
    post,
    comments,
    isLoading,
    error,
    refetch: fetchPost
  };
};