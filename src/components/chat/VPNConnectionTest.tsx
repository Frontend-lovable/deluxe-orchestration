import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, TestTube } from 'lucide-react';
import { VPNTester } from '@/utils/vpnTest';
import { API_CONFIG } from '@/config/api';

export const VPNConnectionTest = () => {
  const [testing, setTesting] = useState(false);
  const [connectionResult, setConnectionResult] = useState<any>(null);
  const [chatResult, setChatResult] = useState<any>(null);

  const runTests = async () => {
    setTesting(true);
    setConnectionResult(null);
    setChatResult(null);

    try {
      // Test basic VPN connection
      const vpnTest = await VPNTester.testConnection(API_CONFIG.CHATBOT_API_URL);
      setConnectionResult(vpnTest);

      // If VPN is connected, test the chat endpoint
      if (vpnTest.isConnected) {
        const chatTest = await VPNTester.testChatEndpoint(API_CONFIG.CHATBOT_API_URL);
        setChatResult(chatTest);
      }
    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TestTube className="w-4 h-4" />
          VPN & API Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTests} disabled={testing} className="w-full">
          {testing ? 'Testing Connection...' : 'Test VPN & API Connection'}
        </Button>

        {connectionResult && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {connectionResult.isConnected ? (
                <>
                  <Wifi className="w-4 h-4 text-green-500" />
                  <Badge variant="default" className="bg-green-500">VPN Connected</Badge>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <Badge variant="destructive">VPN Disconnected</Badge>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{connectionResult.message}</p>
          </div>
        )}

        {chatResult && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {chatResult.isWorking ? (
                <Badge variant="default" className="bg-blue-500">Chat API Working</Badge>
              ) : (
                <Badge variant="destructive">Chat API Error</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{chatResult.message}</p>
            {chatResult.response && (
              <div className="p-2 bg-muted rounded text-xs">
                <strong>Test Response:</strong>
                <pre className="mt-1">{JSON.stringify(chatResult.response, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};