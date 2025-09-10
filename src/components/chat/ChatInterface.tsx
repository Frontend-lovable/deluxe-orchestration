import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { invokeClaude, type BedrockCreds } from "@/lib/bedrock";

interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: string;
}

interface ChatInterfaceProps {
  title: string;
  subtitle: string;
  initialMessage?: string;
  placeholder?: string;
  onReviewed?: () => void;
}

export const ChatInterface = ({ 
  title, 
  subtitle, 
  initialMessage,
  placeholder = "Type your message about business requirements...",
  onReviewed
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    ...(initialMessage ? [{
      id: "1",
      content: initialMessage,
      isBot: true,
      timestamp: "2:05:11 PM"
    }] : [])
  ]);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();
  const [awsCreds, setAwsCreds] = useState<BedrockCreds | null>(null);
  const [isCredsOpen, setIsCredsOpen] = useState(false);
  const [region, setRegion] = useState("us-east-1");
  const [modelId, setModelId] = useState("anthropic.claude-3-haiku-20240307-v1:0");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [sessionToken, setSessionToken] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("bedrockCreds");
    if (raw) {
      try {
        const saved = JSON.parse(raw) as BedrockCreds;
        setAwsCreds(saved);
        setRegion(saved.region);
        setModelId(saved.modelId);
        setAccessKeyId(saved.accessKeyId);
        setSecretAccessKey(saved.secretAccessKey);
        setSessionToken(saved.sessionToken ?? "");
      } catch {}
    }
  }, []);

  const saveCreds = () => {
    if (!accessKeyId || !secretAccessKey || !region || !modelId) {
      toast({
        title: "Missing fields",
        description: "Please fill Access Key, Secret, Region and Model ID.",
        variant: "destructive",
      });
      return;
    }
    const creds: BedrockCreds = {
      accessKeyId,
      secretAccessKey,
      sessionToken: sessionToken || undefined,
      region,
      modelId,
    };
    localStorage.setItem("bedrockCreds", JSON.stringify(creds));
    setAwsCreds(creds);
    setIsCredsOpen(false);
    toast({
      title: "AWS connected (dev)",
      description: "Credentials saved locally for this browser.",
    });
  };

  const clearCreds = () => {
    localStorage.removeItem("bedrockCreds");
    setAwsCreds(null);
    toast({
      title: "Disconnected",
      description: "Removed locally stored credentials.",
    });
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Add the user message immediately
    setMessages((prev) => [...prev, newMessage]);

    // Check "reviewed" keyword behavior
    if (inputValue.trim().toLowerCase() === "reviewed" && onReviewed) {
      onReviewed();
    }

    // Clear the input
    setInputValue("");

    // Require temporary creds in dev mode
    if (!awsCreds) {
      toast({
        title: "Connect AWS first",
        description: "Click 'Connect AWS (dev)' to add temporary Bedrock credentials.",
        variant: "destructive",
      });
      return;
    }

    // Placeholder bot message while waiting
    const botId = `bot-${Date.now()}`;
    const placeholder: ChatMessage = {
      id: botId,
      content: "Thinking…",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, placeholder]);

    try {
      const conv = [...messages, newMessage].map((m) => ({
        role: m.isBot ? ("assistant" as const) : ("user" as const),
        content: m.content,
      }));

      const reply = await invokeClaude({ creds: awsCreds, messages: conv });

      setMessages((prev) =>
        prev.map((m) => (m.id === botId ? { ...m, content: reply || "[No response]" } : m)),
      );
    } catch (err: any) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId
            ? {
                ...m,
                content:
                  `Error: ${err?.message ?? "Failed to call Bedrock (CORS likely in browser). Use a proxy for production."}`,
              }
            : m,
        ),
      );
      toast({
        title: "Bedrock error",
        description:
          "Open console for details. In browser, CORS may block Bedrock. For production, use a backend proxy.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 bg-primary">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-base font-bold text-[hsl(var(--heading-primary))]">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          <Dialog open={isCredsOpen} onOpenChange={setIsCredsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                {awsCreds ? "AWS Connected (dev)" : "Connect AWS (dev)"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect AWS Bedrock (dev-only)</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="region">Region</Label>
                  <Input id="region" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="us-east-1" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="model">Model ID</Label>
                  <Input id="model" value={modelId} onChange={(e) => setModelId(e.target.value)} placeholder="anthropic.claude-3-haiku-20240307-v1:0" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="accessKey">Access Key ID</Label>
                  <Input id="accessKey" value={accessKeyId} onChange={(e) => setAccessKeyId(e.target.value)} />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="secretKey">Secret Access Key</Label>
                  <Input id="secretKey" type="password" value={secretAccessKey} onChange={(e) => setSecretAccessKey(e.target.value)} />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="session">Session Token (STS)</Label>
                  <Input id="session" type="password" value={sessionToken} onChange={(e) => setSessionToken(e.target.value)} />
                </div>
              </div>
              <DialogFooter className="flex items-center justify-between">
                <Button variant="ghost" onClick={clearCreds}>Clear</Button>
                <Button onClick={saveCreds}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0">
        <div 
          className="flex-1 space-y-4 mb-4 overflow-y-auto max-h-full pr-2"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 transparent'
          }}
        >
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.isBot 
                    ? 'bg-secondary text-secondary-foreground' 
                    : 'bg-primary text-primary-foreground'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
              <div className={`text-xs text-muted-foreground ${
                message.isBot ? 'text-left' : 'text-right'
              }`}>
                {message.timestamp}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
            style={{ backgroundColor: '#fff' }}
          />
          <Button 
            onClick={handleSend}
            size="sm"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};