import { useState, useRef, useEffect } from "react";
import { Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessage } from "./ChatMessage";
import { streamChatMessage } from "@/services/chatbotApi";
import { toast } from "sonner";
import { useAppState } from "@/contexts/AppStateContext";
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
  disabled?: boolean;
  sectionContext?: string;
}
export const ChatInterface = ({
  title,
  subtitle,
  initialMessage,
  placeholder = "Type your message about business requirements...",
  onReviewed,
  externalMessages,
  onMessagesChange,
  disabled = false,
  sectionContext
}: ChatInterfaceProps) => {
  const { setIsBRDApproved, brdSections } = useAppState();
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
  const hasInitialized = useRef(false);

  // Initialize external messages with initial message if they're empty
  useEffect(() => {
    if (!hasInitialized.current && externalMessages !== undefined && externalMessages.length === 0 && initialMessage && onMessagesChange) {
      hasInitialized.current = true;
      onMessagesChange([{
        id: "1",
        content: initialMessage,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }]);
    }
  }, [externalMessages, initialMessage, onMessagesChange]);

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
    const currentMessages = messages;
    setMessages([...currentMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Check if message is "approved" and return custom response without API call
    if (currentMessage.trim().toLowerCase() === "approved") {
      const botMessage: ChatMessageType = {
        id: `bot-${Date.now()}`,
        content: "All sections have been approved. You can download the BRD and push it to Confluence.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setMessages([...currentMessages, userMessage, botMessage]);
      setIsLoading(false);
      setIsBRDApproved(true);
      return;
    }

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
    setMessages([...currentMessages, userMessage, botMessage]);

    let updatedMessages = [...currentMessages, userMessage, botMessage];
    
    try {
      let accumulatedContent = "";
      
      // Stream the response
      for await (const chunk of streamChatMessage(currentMessage, sectionContext)) {
        accumulatedContent += chunk;
        
        // Update the bot message with accumulated content
        updatedMessages = updatedMessages.map(msg => 
          msg.id === botMessageId 
            ? { ...msg, content: accumulatedContent, isLoading: false, isTyping: false }
            : msg
        );
        setMessages(updatedMessages);
      }

      setIsLoading(false);

      // Check if the message is "reviewed" and trigger the callback
      if (currentMessage.trim().toLowerCase() === "reviewed" && onReviewed) {
        onReviewed();
      }

      // Check if the message is "approved" and enable BRD actions
      if (currentMessage.trim().toLowerCase() === "approved") {
        setIsBRDApproved(true);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setIsLoading(false);
      
      // Remove loading message and add error message
      const withoutLoading = updatedMessages.filter(msg => msg.id !== botMessageId);
      const errorMessage: ChatMessageType = {
        id: `error-${Date.now()}`,
        content: "Sorry, I couldn't process your message right now. This might be due to network issues or the API not being publicly accessible. Please try again later.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setMessages([...withoutLoading, errorMessage]);
      
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
          {disabled ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-sm">Please upload and submit files to enable chat</p>
            </div>
          ) : messages.length === 0 ? (
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
            placeholder={disabled ? "Upload files to enable chat..." : placeholder}
            onKeyPress={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={isLoading || disabled}
            className="flex-1" 
            style={{ backgroundColor: '#fff' }}
          />
          <Button 
            onClick={handleSend} 
            size="sm" 
            className="px-3"
            disabled={isLoading || !inputValue.trim() || disabled}
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