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
    console.log('Sending request to:', `${this.API_BASE_URL}/chat`);
    
    try {
      const requestBody: ChatRequest = {
        message,
        session_id: this.getSessionId(),
        ...API_CONFIG.DEFAULT_PARAMS
      };

      console.log('Request body:', requestBody);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(`${this.API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
        mode: 'cors',
      });

      clearTimeout(timeoutId);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = 'Unable to read error response';
        }
        console.log('Error response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.log('Non-JSON response received:', responseText);
        throw new Error('API returned non-JSON response. Please check if the API endpoint is correct.');
      }

      const data: ChatResponse = await response.json();
      console.log('Success response:', data);
      
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