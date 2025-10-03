import { API_CONFIG } from "@/config/api";
import { useMutation } from "@tanstack/react-query";

// Chatbot API service
export interface ChatRequest {
  message: string;
  session_id: string | null;
  include_context?: boolean;
  max_tokens?: number;
  temperature?: number;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  timestamp?: string;
  message_count?: number;
  model_used?: string;
  processing_time?: number;
  message?: string; // Fallback field in case API uses 'message' instead of 'response'
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

// API function for streaming chat messages
export async function* streamChatMessage(message: string, sectionContext?: string): AsyncGenerator<string, void, unknown> {
  const API_BASE_URL = API_CONFIG.CHATBOT_API_URL;
  console.log('Sending streaming request to:', API_BASE_URL);
  
  try {
    // Build enhanced message with context if provided
    let enhancedMessage = message;
    if (sectionContext) {
      enhancedMessage = `BRD Section Content:\n${sectionContext}\n\nUser Query:\n${message}\n\n(Refer to the above subcontent of the Business Requirement Document and user query, then modify the subcontent as per the user's requirement).`;
    }
    
    const requestBody = {
      message: enhancedMessage,
      session_id: SessionManager.getSessionId(),
      include_context: true,
      max_tokens: 2000,
      temperature: 0.7
    };

    console.log('Request body:', requestBody);

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      mode: 'cors',
    });
      
    console.log('Response status:', response.status);

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

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        // Process any remaining buffer
        if (buffer.trim()) {
          const lines = buffer.split('\n');
          for (const line of lines) {
            if (!line.trim() || line.startsWith(':')) continue;
            
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') break;
              
              try {
                const data = JSON.parse(dataStr);
                if (data.session_id) {
                  SessionManager.setSessionId(data.session_id);
                }
                const content = String(
                  data?.response || 
                  data?.message || 
                  data?.answer || 
                  data?.text || 
                  data?.content || 
                  ''
                ).trim();
                
                if (content) {
                  yield content;
                }
              } catch (e) {
                console.error('Failed to parse final SSE data:', e);
              }
            }
          }
        }
        break;
      }
      
      buffer += decoder.decode(value, { stream: true });
      
      // Process complete SSE events from the buffer
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        
        // Handle CRLF line endings
        if (line.endsWith('\r')) {
          line = line.slice(0, -1);
        }
        
        // Skip empty lines and SSE comments
        if (!line.trim() || line.startsWith(':')) continue;
        
        // Parse SSE data lines
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6).trim();
          
          // Check for stream end marker
          if (dataStr === '[DONE]') {
            break;
          }
          
          try {
            const data = JSON.parse(dataStr);
            
            // Store session ID
            if (data.session_id) {
              SessionManager.setSessionId(data.session_id);
            }
            
            // Extract content from various possible field names
            const content = String(
              data?.response || 
              data?.message || 
              data?.answer || 
              data?.text || 
              data?.content || 
              ''
            ).trim();
            
            // Clean up the content (remove outer quotes and unescape)
            let cleanContent = content;
            if (cleanContent.startsWith('"') && cleanContent.endsWith('"') && cleanContent.length > 1) {
              cleanContent = cleanContent.slice(1, -1);
            }
            
            if (cleanContent.includes('\\')) {
              cleanContent = cleanContent
                .replace(/\\"/g, '"')
                .replace(/\\n/g, '\n')
                .replace(/\\t/g, '\t')
                .replace(/\\r/g, '\r')
                .replace(/\\\\/g, '\\');
            }
            
            if (cleanContent) {
              yield cleanContent;
            }
          } catch (e) {
            console.error('Failed to parse SSE data:', dataStr, e);
          }
        }
      }
    }
  } catch (error) {
    console.error('=== API ERROR DEBUG ===');
    console.error('Full error object:', error);
    console.error('=== END ERROR DEBUG ===');
    
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('CORS/Network error: Cannot connect to API. Check if the API allows browser requests and has proper CORS headers.');
      }
      if (error.message.includes('NetworkError')) {
        throw new Error('Network error: Please check your internet connection and try again.');
      }
    }
    
    throw new Error(`API Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
  }
}

// API function for sending chat messages (non-streaming fallback)
export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const API_BASE_URL = API_CONFIG.CHATBOT_API_URL;
  console.log('Sending request to:', API_BASE_URL);
  
  try {
    const requestBody = {
      message,
      session_id: SessionManager.getSessionId(),
      include_context: true,
      max_tokens: 2000,
      temperature: 0.7
    };

    console.log('Request body:', requestBody);

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      mode: 'cors',
    });
      
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
    let data: any;
    try {
      data = JSON.parse(responseText);
      console.log('=== API RESPONSE DEBUG ===');
      console.log('Raw parsed JSON:', JSON.stringify(data, null, 2));
      console.log('Data type:', typeof data);
      console.log('Data keys:', data ? Object.keys(data) : 'No keys');
      
      // Check all possible response fields
      console.log('data.response:', data.response);
      console.log('data.message:', data.message);
      console.log('data.answer:', data.answer);
      console.log('data.text:', data.text);
      console.log('data.content:', data.content);
      console.log('=== END DEBUG ===');
      
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
    console.error('=== API ERROR DEBUG ===');
    console.error('Full error object:', error);
    console.error('Error type:', typeof error);
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error message:', error instanceof Error ? error.message : error);
    console.error('=== END ERROR DEBUG ===');
    
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('CORS/Network error: Cannot connect to API. Check if the API allows browser requests and has proper CORS headers.');
      }
      if (error.message.includes('NetworkError')) {
        throw new Error('Network error: Please check your internet connection and try again.');
      }
    }
    
    throw new Error(`API Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
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