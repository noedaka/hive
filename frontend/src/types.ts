export interface SignInFormData {
    username: string;
    password: string;
}

export interface SignInFormErrors {
    username?: string;
    password?: string;
    general?: string;
}

export interface SignUpFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpFormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export interface ServerPostResponse {
  post: {
    ID: number;
    title: string;
    content: string;
    image_url: string;
    created_at: string;
    author_id: number;
  };
  author_name: string;
  like_count: number;
  comments?: ServerCommentResponse[];
}

export interface ServerCommentResponse {
  comment: {
    ID: number;
    content: string;
    created_at: string;
    author_id: number;
    post_id: number;
  };
  author_name: string;
}

export interface Post {
  id: string | number;
  author: { userName: string };
  text: string;
  postImg: string;
  likes: number;
  title?: string;
  created_at?: string;
  isLiked?: boolean;
}

export interface Comment {
  id: string | number;
  author: { userName: string };
  text: string;
  date: string;
}

const API_BASE_URL = 'http://localhost:8080';

export const transformServerPostResponseToPost = (response: ServerPostResponse): Post => {
  let imageUrl = response.post.image_url || '';
  
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
    if (!imageUrl.startsWith('/')) {
      imageUrl = '/' + imageUrl;
    }
    if (!imageUrl.startsWith('http')) {
      imageUrl = API_BASE_URL + imageUrl;
    }
  }
  
  return {
    id: response.post.ID,
    author: { userName: response.author_name },
    text: response.post.content,
    postImg: imageUrl,
    likes: response.like_count,
    title: response.post.title,
    created_at: response.post.created_at
  };
};

export interface CreatePostFormData {
  title: string;
  content: string;
  image: File | null;
  imageUrl: string; 
}

export interface CreatePostErrors {
  title?: string;
  content?: string;
  image?: string;
  general?: string;
}