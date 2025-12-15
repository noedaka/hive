import { fetchWithAuth } from '../utils/fetchWithAuth';
import type { ServerPostResponse } from '../types';

const API_BASE_URL = 'http://localhost:8080';

export interface CreatePostRequest {
  title: string;
  content: string;
  image_url?: string;
}

export const postsApi = {
  async getPosts(): Promise<ServerPostResponse[]> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/posts`);

      if (response.status === 204) {
        return [];
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        if (response.status === 500) {
          throw new Error('Server error');
        }
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const posts: ServerPostResponse[] = await response.json();
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  async getPost(id: number | string): Promise<ServerPostResponse> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/posts/${id}`);

      if (response.status === 404 || response.status === 204) {
        throw new Error('Post not found');
      }

      if (response.status === 400) {
        throw new Error('Invalid post ID format');
      }

      if (!response.ok) {
        if (response.status === 500) {
          throw new Error('Server error');
        }
        throw new Error(`Failed to fetch post: ${response.status}`);
      }

      const post: ServerPostResponse = await response.json();
      return post;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  async createPost(postData: CreatePostRequest): Promise<void> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.status === 201) {
        return;
      }

      switch (response.status) {
        case 400:
          throw new Error('Invalid request format');
        case 401:
          throw new Error('Authentication required');
        case 500:
          throw new Error('Server error');
        default:
          throw new Error(`Failed to create post: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },
};