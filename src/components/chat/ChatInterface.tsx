import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
}

export const ChatInterface = ({ 
  title, 
  subtitle, 
  initialMessage,
  placeholder = "Type your message about business requirements..."
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

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              AI
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 space-y-4 mb-4 overflow-y-auto scrollbar-hide">
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