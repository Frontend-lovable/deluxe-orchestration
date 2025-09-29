import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
 
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
	host: "::",
	port: 8080,
	allowedHosts: process.env.ALLOWED_HOSTS?.split(',') || [],
	proxy: {
	  '/confluence-api': {
		target: 'https://siriusai-team-test.atlassian.net',
		changeOrigin: true,
		rewrite: (path) => path.replace(/^\/confluence-api/, ''),
		configure: (proxy, options) => {
		  proxy.on('proxyReq', (proxyReq, req, res) => {
			proxyReq.setHeader('Authorization', 'Basic c2h1YmhhbS5zaW5naEBzaXJpdXNhaS5jb206QVRBVFQzeEZmR0YwS28zR3F4cXFvTGc1MFhCWVFqazBXcHVwT1JXUjFhdUMzWHpJZnNnQUkxejZSalBRWnhudGlsWHRQMHJjRFdrWThfSWNmSEFUTERjcWFpaVkycWs2dVhKWFllbFN1YkI4QlNRWWxBOU00R1VOdi1Wb1FSSEVRSEg0V0NkZXdRWHU5aDZZUDVQcGxUMW80S2dVQnhkTEZpOU4wZURYZHJfZnBNbTk3aTAycGpzPURFN0JDQjY4');
			proxyReq.setHeader('Cookie', 'atlassian.xsrf.token=f32abaf62147e552ff7e6e565564268648a4979d_lin');
		  });
		}
	  }
	}
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
	alias: {
  	"@": path.resolve(__dirname, "./src"),
	},
  },
}));