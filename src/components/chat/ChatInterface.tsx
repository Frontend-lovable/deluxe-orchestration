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
  onReviewed?: () => void;
}
export const ChatInterface = ({
  title,
  subtitle,
  initialMessage,
  placeholder = "Type your message about business requirements...",
  onReviewed
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([...(initialMessage ? [{
    id: "1",
    content: initialMessage,
    isBot: true,
    timestamp: "2:05:11 PM"
  }] : [])]);
  const [inputValue, setInputValue] = useState("");
  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setMessages([...messages, newMessage]);

    // Check if the message is "reviewed" and trigger the callback
    if (inputValue.trim().toLowerCase() === "reviewed" && onReviewed) {
      onReviewed();
    }
    setInputValue("");
  };
  return <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              AI
            </AvatarFallback>
          </Avatar>
          <div>
            
            
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 space-y-4 mb-4 overflow-y-auto max-h-full pr-2" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 transparent'
      }}>
          {messages.map(message => <div key={message.id} className="space-y-2" style={{ backgroundColor: '#F6F6F6', padding: '20px', borderRadius: '8px', width: '480px' }}>
              <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${message.isBot ? 'bg-secondary text-secondary-foreground' : 'bg-transparent text-foreground border border-border'}`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
              <div className={`text-xs ${message.isBot ? 'text-left' : 'text-left'}`} style={{ color: '#8F8F8F', fontSize: '12px' }}>
                {message.timestamp}
              </div>
            </div>)}
        </div>
        
        <div className="flex gap-2">
          <Input value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder={placeholder} onKeyPress={e => e.key === 'Enter' && handleSend()} className="flex-1" style={{
          backgroundColor: '#fff'
        }} />
          <Button onClick={handleSend} size="sm" className="px-3">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>;
};