const API_BASE_URL = 'http://localhost:8080';

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export interface RegisterCredentials {
  login: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const token = response.headers.get('Authorization');
        if (token && token.startsWith('Bearer ')) {
          localStorage.setItem('authToken', token.replace('Bearer ', ''));
          return { success: true, token: token.replace('Bearer ', '') };
        }
        return { success: false, error: 'Token not found in response' };
      }

      switch (response.status) {
        case 400:
          return { success: false, error: 'Invalid request format' };
        case 401:
          return { success: false, error: 'Invalid username or password' };
        case 500:
          return { success: false, error: 'Server error' };
        default:
          return { success: false, error: `Unknown error: ${response.status}` };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Register response status:', response.status);
      
      if (response.status === 201) {
        const token = response.headers.get('Authorization');
        if (token && token.startsWith('Bearer ')) {
          const cleanToken = token.replace('Bearer ', '');
          localStorage.setItem('authToken', cleanToken);
          return { success: true, token: cleanToken };
        }
        return { success: false, error: 'Token not found in response' };
      }

      switch (response.status) {
        case 400:
          try {
            const data = await response.json();
            return { success: false, error: data.message || 'Invalid request format' };
          } catch {
            return { success: false, error: 'Invalid request format' };
          }
        case 409:
          return { success: false, error: 'Username already exists' };
        case 500:
          return { success: false, error: 'Server error' };
        default:
          return { success: false, error: `Unknown error: ${response.status}` };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  },

  logout(): void {
    localStorage.removeItem('authToken');
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },
};
