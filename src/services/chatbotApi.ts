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
    try {
      const requestBody: ChatRequest = {
        message,
        session_id: this.getSessionId(),
        ...API_CONFIG.DEFAULT_PARAMS
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(`${this.API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      
      // Store session ID for future requests
      if (data.session_id) {
        this.setSessionId(data.session_id);
      }

      return data;
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout. Please try again.');
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to API. Please check if the API is publicly accessible and CORS is configured.');
        }
      }
      
      throw new Error('Failed to get response from chatbot. Please try again.');
    }
  }
}