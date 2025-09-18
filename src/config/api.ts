// API Configuration
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const timeout = import.meta.env.VITE_API_TIMEOUT;

export const API_CONFIG = {
  // API endpoint from environment variables
  CHATBOT_API_URL: apiUrl || "http://deluxe-internet-300914418.us-east-1.elb.amazonaws.com:8000/api/v1",
  
  // Request timeout in milliseconds from environment variables
  TIMEOUT: timeout ? parseInt(timeout) : 30000,
  
  // Default request parameters
  DEFAULT_PARAMS: {
    include_context: true,
    max_tokens: 4000,
    temperature: 0.7
  }
};

// Instructions for making the API accessible:
// 1. Expose your API through a public load balancer or API Gateway
// 2. Add CORS headers to allow browser requests:
//    - Access-Control-Allow-Origin: * (or your domain)
//    - Access-Control-Allow-Methods: POST, OPTIONS
//    - Access-Control-Allow-Headers: Content-Type
// 3. Update the CHATBOT_API_URL above with your public endpoint