import { useState, useCallback } from 'react';
import { postsApi, type CreatePostRequest } from '../api/posts';
import { uploadApi } from '../api/upload';

export const useCreatePost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createPost = useCallback(async (postData: CreatePostRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await postsApi.createPost(postData);
      setSuccess(true);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create post';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const result = await uploadApi.uploadImage(file);
      return result.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload image';
      setError(message);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    createPost,
    uploadImage,
    isLoading,
    isUploading,
    error,
    success,
    reset: () => {
      setError(null);
      setSuccess(false);
    }
  };
};