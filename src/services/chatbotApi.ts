import { API_CONFIG } from "@/config/api";

// Chatbot API service
export interface ChatRequest {
  message: string;
  session_id: string | null;
  include_context: boolean;
  max_tokens: number;
  temperature: number;
}

export interface ChatResponse {
  response: string;
  session_id: string;
}

export class ChatbotService {
  private static readonly API_BASE_URL = API_CONFIG.CHATBOT_API_URL;
  private static readonly SESSION_KEY = "chatbot_session_id";

  static getSessionId(): string | null {
    return localStorage.getItem(this.SESSION_KEY);
  }

  static setSessionId(sessionId: string): void {
    localStorage.setItem(this.SESSION_KEY, sessionId);
  }

  static async sendMessage(message: string): Promise<ChatResponse> {
    console.log('Sending message to API:', this.API_BASE_URL);
    
    try {
      const requestBody: ChatRequest = {
        message,
        session_id: this.getSessionId(),
        ...API_CONFIG.DEFAULT_PARAMS
      };

      console.log('Request payload:', requestBody);

      // Extended timeout for VPN connections
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds for VPN

      const response = await fetch(`${this.API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers that might be needed for your internal API
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
        // Disable cache for dynamic responses
        cache: 'no-cache',
        // Handle credentials if needed
        credentials: 'omit'
      });

      clearTimeout(timeoutId);
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }

      const data: ChatResponse = await response.json();
      console.log('API Response:', data);
      
      // Store session ID for future requests
      if (data.session_id) {
        this.setSessionId(data.session_id);
        console.log('Session ID stored:', data.session_id);
      }

      return data;
    } catch (error) {
      console.error('Detailed error calling chatbot API:', {
        error,
        url: `${this.API_BASE_URL}/chat`,
        timestamp: new Date().toISOString()
      });
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout after 60 seconds. Your VPN connection might be slow.');
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Network error: Cannot reach the API through VPN. Please check your VPN connection and ensure the internal load balancer is accessible.');
        }
        if (error.message.includes('CORS')) {
          throw new Error('CORS error: Please ensure your API has the correct CORS headers configured.');
        }
      }
      
      throw error instanceof Error ? error : new Error('Unknown API error occurred.');
    }
  }
}