import { useState, useRef, useEffect } from "react";
import { Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessage } from "./ChatMessage";
import { useChatMessage } from "@/services/chatbotApi";
import { toast } from "sonner";
interface ChatMessageType {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: string;
  isTyping?: boolean;
}
interface ChatInterfaceProps {
  title: string;
  subtitle: string;
  initialMessage?: string;
  placeholder?: string;
  onReviewed?: () => void;
  externalMessage?: string;
}
export const ChatInterface = ({
  title,
  subtitle,
  initialMessage,
  placeholder = "Type your message about business requirements...",
  onReviewed,
  externalMessage
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([...(initialMessage ? [{
    id: "1",
    content: initialMessage,
    isBot: true,
    timestamp: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }] : [])]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // TanStack Query mutation for sending chat messages
  const chatMutation = useChatMessage();

  // Handle external messages (like BRD content)
  useEffect(() => {
    if (externalMessage) {
      const brdMessage: ChatMessageType = {
        id: `brd-${Date.now()}`,
        content: externalMessage,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        isTyping: true
      };
      setMessages(prev => [...prev, brdMessage]);
    }
  }, [externalMessage]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || chatMutation.isPending) return;
    
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

    // Add loading message
    const loadingMessage: ChatMessageType = {
      id: `loading-${Date.now()}`,
      content: "...",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setMessages(prev => [...prev, loadingMessage]);

    // Use TanStack Query mutation
    chatMutation.mutate(currentMessage, {
      onSuccess: (response) => {
        console.log('=== CHAT SUCCESS DEBUG ===');
        console.log('Full response object:', JSON.stringify(response, null, 2));
        console.log('Response type:', typeof response);
        
        // Try different possible response fields
        const responseData = response as any;
        const responseContent = responseData?.response || 
                               responseData?.message || 
                               responseData?.answer || 
                               responseData?.text || 
                               responseData?.content ||
                               'No response received';
        
        console.log('Extracted content:', responseContent);
        console.log('=== END CHAT DEBUG ===');
        
        // Remove loading message and add actual response with typing effect
        setMessages(prev => {
          const withoutLoading = prev.filter(msg => !msg.id.startsWith('loading-'));
          const botMessage: ChatMessageType = {
            id: `bot-${Date.now()}`,
            content: responseContent,
            isBot: true,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            }),
            isTyping: true
          };
          return [...withoutLoading, botMessage];
        });

        // Check if the message is "reviewed" and trigger the callback
        if (currentMessage.trim().toLowerCase() === "reviewed" && onReviewed) {
          onReviewed();
        }
      },
      onError: (error) => {
        console.error('Chat error:', error);
        
        // Remove loading message and add error message
        setMessages(prev => {
          const withoutLoading = prev.filter(msg => !msg.id.startsWith('loading-'));
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
    });
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
            disabled={chatMutation.isPending}
            className="flex-1" 
            style={{ backgroundColor: '#fff' }}
          />
          <Button 
            onClick={handleSend} 
            size="sm" 
            className="px-3"
            disabled={chatMutation.isPending || !inputValue.trim()}
          >
            {chatMutation.isPending ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>;
};