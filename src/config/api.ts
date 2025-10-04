// API Configuration
// Dynamically determines base URL based on environment
const isProduction = import.meta.env.PROD;
const PRODUCTION_BASE = "http://deluxe-internet-300914418.us-east-1.elb.amazonaws.com:8000";
const API_PATH = "/api/v1";

export const API_CONFIG = {
  // Base URL for all API endpoints
  // In development: uses proxy (/api/v1)
  // In production: uses full production URL
  BASE_URL: isProduction ? `${PRODUCTION_BASE}${API_PATH}` : API_PATH,
  
  // Chat API URL
  CHATBOT_API_URL: isProduction ? `${PRODUCTION_BASE}${API_PATH}/chat` : `${API_PATH}/chat`,
  
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