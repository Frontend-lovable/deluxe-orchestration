// API Configuration and Security Best Practices

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// For frontend-only apps, demonstrate localStorage pattern
// In production with Supabase, you'd use environment variables and edge functions
export class ApiKeyManager {
  private static readonly API_KEY_STORAGE_KEY = 'app_api_key';
  
  static setApiKey(apiKey: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    }
  }
  
  static getApiKey(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.API_KEY_STORAGE_KEY);
    }
    return null;
  }
  
  static removeApiKey(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.API_KEY_STORAGE_KEY);
    }
  }
  
  static hasApiKey(): boolean {
    return !!this.getApiKey();
  }
}

// Request interceptor for adding auth headers
export const createAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  const apiKey = ApiKeyManager.getApiKey();
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  
  return headers;
};

// Retry mechanism with exponential backoff
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = API_CONFIG.RETRY_ATTEMPTS,
  baseDelay: number = API_CONFIG.RETRY_DELAY
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

// Environment-based configuration
export const getEnvironmentConfig = () => {
  const env = import.meta.env.MODE || 'development';
  
  return {
    isDevelopment: env === 'development',
    isProduction: env === 'production',
    enableLogging: env === 'development',
    enableErrorReporting: env === 'production',
  };
};