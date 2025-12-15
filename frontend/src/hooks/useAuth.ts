import { useState, useCallback, useEffect } from 'react';
import { authApi, type LoginCredentials, type RegisterCredentials } from '../api/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(authApi.isAuthenticated());

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(authApi.isAuthenticated());
    };

    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(handleStorageChange, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authApi.login(credentials);
      
      if (!result.success) {
        setError(result.error || 'Login failed');
        return { success: false, error: result.error };
      }
      
      setIsAuthenticated(true);
      return { success: true, token: result.token };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authApi.register(credentials);
      
      if (!result.success) {
        setError(result.error || 'Registration failed');
        return { success: false, error: result.error };
      }
      
      setIsAuthenticated(true);
      return { success: true, token: result.token };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    login,
    logout,
    register,
    isLoading,
    error,
    isAuthenticated,
    getToken: authApi.getToken,
  };
};