// VPN Connection Tester for Internal API
export class VPNTester {
  static async testConnection(apiUrl: string): Promise<{
    isConnected: boolean;
    message: string;
    details?: any;
  }> {
    try {
      console.log('Testing VPN connection to:', apiUrl);
      
      // Test with a simple OPTIONS request first
      const optionsResponse = await fetch(apiUrl, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (optionsResponse.ok) {
        return {
          isConnected: true,
          message: 'VPN connection successful - API is reachable',
          details: {
            status: optionsResponse.status,
            headers: Object.fromEntries(optionsResponse.headers.entries())
          }
        };
      } else {
        return {
          isConnected: false,
          message: `VPN connection issue - API returned status ${optionsResponse.status}`,
          details: { status: optionsResponse.status }
        };
      }
    } catch (error) {
      console.error('VPN connection test failed:', error);
      
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        return {
          isConnected: false,
          message: 'VPN connection failed - Cannot reach internal load balancer. Check your VPN connection.',
          details: { error: error.message }
        };
      }
      
      return {
        isConnected: false,
        message: 'VPN connection test error',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }
  
  static async testChatEndpoint(apiUrl: string): Promise<{
    isWorking: boolean;
    message: string;
    response?: any;
  }> {
    try {
      const testMessage = {
        message: "test connection",
        session_id: null,
        include_context: true,
        max_tokens: 100,
        temperature: 0.7
      };
      
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testMessage),
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          isWorking: true,
          message: 'Chat endpoint is working correctly',
          response: data
        };
      } else {
        const errorText = await response.text();
        return {
          isWorking: false,
          message: `Chat endpoint error (${response.status}): ${errorText}`,
        };
      }
    } catch (error) {
      return {
        isWorking: false,
        message: `Chat endpoint test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}