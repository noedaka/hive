import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_BASE_URL = 'http://localhost:8080';

export const likesApi = {
  async likePost(postId: number | string): Promise<void> {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/posts/${postId}/like`, {
      method: 'POST',
    });

    if (response.status === 400) {
      throw new Error('Invalid post ID format');
    }

    if (response.status === 401) {
      throw new Error('Authentication required');
    }

    if (response.status === 500) {
      throw new Error('Server error');
    }

    if (!response.ok) {
      throw new Error(`Failed to like post: ${response.status}`);
    }
  },

  async unlikePost(postId: number | string): Promise<void> {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/posts/${postId}/like`, {
      method: 'DELETE',
    });

    if (response.status === 400) {
      throw new Error('Invalid post ID format');
    }

    if (response.status === 401) {
      throw new Error('Authentication required');
    }

    if (response.status === 500) {
      throw new Error('Server error');
    }

    if (!response.ok) {
      throw new Error(`Failed to unlike post: ${response.status}`);
    }
  },
};