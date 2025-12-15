import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_BASE_URL = 'http://localhost:8080';

export interface UploadImageResponse {
  url: string;
}

export const uploadApi = {
  async uploadImage(file: File): Promise<UploadImageResponse> {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid image format. Only JPEG, PNG, GIF and WebP are allowed');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('Image size should be less than 5MB');
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/posts/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error('Invalid file format or file too large');
          case 401:
            throw new Error('Authentication required');
          case 500:
            throw new Error('Server error');
          default:
            throw new Error(`Failed to upload image: ${response.status}`);
        }
      }

      const data: UploadImageResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
};