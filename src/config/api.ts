// API Configuration
// Direct API endpoint without proxy
export const API_CONFIG = {
  // Using proxy to avoid CORS issues
  CHATBOT_API_URL: "/api/v1/chat",
  
  // Request timeout in milliseconds
  TIMEOUT: 30000
};

// Instructions for making the API accessible:
// 1. Expose your API through a public load balancer or API Gateway
// 2. Add CORS headers to allow browser requests:
//    - Access-Control-Allow-Origin: * (or your domain)
//    - Access-Control-Allow-Methods: POST, OPTIONS
//    - Access-Control-Allow-Headers: Content-Type
// 3. Update the CHATBOT_API_URL above with your public endpoint