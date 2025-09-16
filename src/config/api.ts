// API Configuration for VPN-connected internal API
export const API_CONFIG = {
  // Internal AWS Load Balancer URL (accessible via VPN)
  CHATBOT_API_URL: "http://internal-ai-sandbox-internal-702602954.us-east-1.elb.amazonaws.com:8000/api/v1",
  
  // Extended timeout for VPN connections (60 seconds)
  TIMEOUT: 60000,
  
  // Default request parameters matching your API
  DEFAULT_PARAMS: {
    include_context: true,
    max_tokens: 4000,
    temperature: 0.7
  },
  
  // Debug mode for troubleshooting VPN connections
  DEBUG: true
};

// Instructions for making the API accessible:
// 1. Expose your API through a public load balancer or API Gateway
// 2. Add CORS headers to allow browser requests:
//    - Access-Control-Allow-Origin: * (or your domain)
//    - Access-Control-Allow-Methods: POST, OPTIONS
//    - Access-Control-Allow-Headers: Content-Type
// 3. Update the CHATBOT_API_URL above with your public endpoint