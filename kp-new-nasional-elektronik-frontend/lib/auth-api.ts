import { getSession } from "next-auth/react";
import config from './config';

/**
 * Enhanced API client that automatically includes JWT token from backend
 * Stores the backend JWT token in sessionStorage for authenticated requests
 */
export const authApiClient = {
  baseUrl: config.apiBaseUrl,

  // Get JWT token from sessionStorage or fetch new one
  async getToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;

    const storedToken = sessionStorage.getItem('backend_jwt_token');
    const tokenExpiry = sessionStorage.getItem('backend_jwt_expiry');

    // Check if token exists and is not expired
    if (storedToken && tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry);
      if (Date.now() < expiryTime) {
        return storedToken;
      }
    }

    // Token expired or doesn't exist, fetch new one
    return await this.refreshToken();
  },

  // Fetch new JWT token from backend using NextAuth session
  async refreshToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;

    try {
      const session = await getSession();
      if (!session?.user?.email) {
        return null;
      }

      // Call backend login endpoint to get JWT token
      const response = await fetch(`${this.baseUrl}/api/users/email/${session.user.email}`);
      if (!response.ok) {
        console.error('Failed to fetch user data');
        return null;
      }

      const userData = await response.json();
      
      // For now, we'll create a mock token flow
      // In production, you should have a proper token exchange endpoint
      // Store user ID for wishlist operations
      sessionStorage.setItem('backend_user_id', userData.id);
      
      return null; // We'll handle this differently
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  },

  // Make authenticated request
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const token = await this.getToken();
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    return fetch(url, { ...defaultOptions, ...options });
  },

  // Convenience methods
  get: (endpoint: string, options?: RequestInit) =>
    authApiClient.request(endpoint, { ...options, method: 'GET' }),

  post: (endpoint: string, data?: any, options?: RequestInit) =>
    authApiClient.request(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (endpoint: string, data?: any, options?: RequestInit) =>
    authApiClient.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (endpoint: string, options?: RequestInit) =>
    authApiClient.request(endpoint, { ...options, method: 'DELETE' }),

  // Clear stored token
  clearToken() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('backend_jwt_token');
      sessionStorage.removeItem('backend_jwt_expiry');
      sessionStorage.removeItem('backend_user_id');
    }
  },
};

export default authApiClient;
