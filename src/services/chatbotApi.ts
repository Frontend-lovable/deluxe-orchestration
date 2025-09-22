import { API_CONFIG } from "@/config/api";
import { useMutation } from "@tanstack/react-query";

// Chatbot API service
export interface ChatRequest {
  message: string;
  session_id: string | null;
}

export interface ChatResponse {
  response: string;
  session_id: string;
}

// Session management utility
export class SessionManager {
  private static readonly SESSION_KEY = "chatbot_session_id";

  static getSessionId(): string | null {
    return localStorage.getItem(this.SESSION_KEY);
  }

  static setSessionId(sessionId: string): void {
    localStorage.setItem(this.SESSION_KEY, sessionId);
  }
}

// API function for sending chat messages
export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const API_BASE_URL = API_CONFIG.CHATBOT_API_URL;
  console.log('Sending request to:', API_BASE_URL);
  
  try {
    const requestBody: ChatRequest = {
      message,
      session_id: SessionManager.getSessionId()
    };

    console.log('Request body:', requestBody);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(API_BASE_URL, {
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
    console.log('Response URL:', response.url);

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

    // Read response as text first to inspect it
    const responseText = await response.text();
    console.log('Raw response text:', responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));

    // Get final content type
    const finalContentType = response.headers.get('content-type');
    console.log('Final Content-Type:', finalContentType);

    // Check if response is JSON by content type AND by trying to parse it
    if (!finalContentType || !finalContentType.includes('application/json')) {
      console.log('Non-JSON content type detected:', finalContentType);
      throw new Error(`API returned non-JSON response (Content-Type: ${finalContentType}). Expected application/json but received: ${responseText.substring(0, 100)}`);
    }

    // Try to parse as JSON
    let data: ChatResponse;
    try {
      data = JSON.parse(responseText);
      console.log('Success response:', data);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Failed to parse response text:', responseText);
      throw new Error(`API returned invalid JSON. Response text: ${responseText.substring(0, 200)}`);
    }
      
    // Store session ID for future requests
    if (data.session_id) {
      SessionManager.setSessionId(data.session_id);
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

// TanStack Query hook for sending chat messages
export function useChatMessage() {
  return useMutation({
    mutationFn: sendChatMessage,
    onError: (error) => {
      console.error('Chat error:', error);
    },
    onSuccess: (data) => {
      console.log('Chat success:', data);
    },
  });
}