import { useState, useRef, useEffect } from "react";
import { Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessage } from "./ChatMessage";
import { streamChatMessage } from "@/services/chatbotApi";
import { toast } from "sonner";
interface ChatMessageType {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: string;
  isTyping?: boolean;
  isLoading?: boolean;
}
interface ChatInterfaceProps {
  title: string;
  subtitle: string;
  initialMessage?: string;
  placeholder?: string;
  onReviewed?: () => void;
  externalMessages?: ChatMessageType[];
  onMessagesChange?: (messages: ChatMessageType[]) => void;
}
export const ChatInterface = ({
  title,
  subtitle,
  initialMessage,
  placeholder = "Type your message about business requirements...",
  onReviewed,
  externalMessages,
  onMessagesChange
}: ChatInterfaceProps) => {
  const [internalMessages, setInternalMessages] = useState<ChatMessageType[]>([...(initialMessage ? [{
    id: "1",
    content: initialMessage,
    isBot: true,
    timestamp: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }] : [])]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use external messages if provided, otherwise use internal state
  const messages = externalMessages || internalMessages;
  const setMessages = onMessagesChange || setInternalMessages;

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    const currentMessage = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Add bot message placeholder that will be updated with streaming content
    const botMessageId = `bot-${Date.now()}`;
    const botMessage: ChatMessageType = {
      id: botMessageId,
      content: "",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      isLoading: true
    };
    setMessages(prev => [...prev, botMessage]);

    try {
      let accumulatedContent = "";
      
      // Stream the response
      for await (const chunk of streamChatMessage(currentMessage)) {
        accumulatedContent += chunk;
        
        // Update the bot message with accumulated content
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, content: accumulatedContent, isLoading: false, isTyping: false }
              : msg
          )
        );
      }

      setIsLoading(false);

      // Check if the message is "reviewed" and trigger the callback
      if (currentMessage.trim().toLowerCase() === "reviewed" && onReviewed) {
        onReviewed();
      }
    } catch (error) {
      console.error('Chat error:', error);
      setIsLoading(false);
      
      // Remove loading message and add error message
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => msg.id !== botMessageId);
        const errorMessage: ChatMessageType = {
          id: `error-${Date.now()}`,
          content: "Sorry, I couldn't process your message right now. This might be due to network issues or the API not being publicly accessible. Please try again later.",
          isBot: true,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        };
        return [...withoutLoading, errorMessage];
      });
      
      toast.error("Failed to send message. Please check your connection and try again.");
    }
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
        <div className="flex-1 mb-4 overflow-y-auto max-h-full pr-2" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 transparent'
        }}>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-sm">Start a conversation...</p>
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Input 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)} 
            placeholder={placeholder}
            onKeyPress={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={isLoading}
            className="flex-1" 
            style={{ backgroundColor: '#fff' }}
          />
          <Button 
            onClick={handleSend} 
            size="sm" 
            className="px-3"
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>;
};