import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_BASE_URL = 'http://localhost:8080';

export interface CreateCommentRequest {
  content: string;
}

export const commentsApi = {
  async createComment(postId: number | string, content: string): Promise<void> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.status === 201) {
        return;
      }

      switch (response.status) {
        case 400:
          throw new Error('Invalid request format or post ID');
        case 401:
          throw new Error('Authentication required');
        case 500:
          throw new Error('Failed to create comment');
        default:
          throw new Error(`Failed to create comment: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },
};