import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTypingEffect } from "@/hooks/useTypingEffect";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    isBot: boolean;
    timestamp: string;
    isTyping?: boolean;
    isLoading?: boolean;
  };
}

// Simple function to display text without any formatting
const formatChatContent = (text: string) => {
  // Safety check for undefined, null, or empty values
  if (!text || text.trim() === '') {
    return <p className="leading-relaxed">No content</p>;
  }
  
  return <p className="leading-relaxed whitespace-pre-wrap">{text}</p>;
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const { displayedText, isTyping } = useTypingEffect(
    message.isTyping ? message.content : '', 
    15
  );

  const contentToDisplay = message.isTyping && displayedText ? displayedText : message.content;

  return (
    <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex ${message.isBot ? 'flex-row' : 'flex-row-reverse'} items-end gap-2 max-w-[80%]`}>
        {message.isBot && (
          <Avatar className="w-6 h-6 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              AI
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className="space-y-1">
          <div className={`
            px-4 py-3 rounded-2xl max-w-full
            ${message.isBot 
              ? 'bg-muted text-foreground rounded-bl-md' 
              : 'bg-primary text-white rounded-br-md'
            }
          `}>
            <div className={`text-sm break-words ${message.isBot ? 'text-foreground' : 'text-white [&_*]:text-white'}`}>
              {message.isLoading ? (
                <span className="inline-flex gap-1 align-middle items-center h-4">
                  <span className="inline-block w-2 h-2 bg-current rounded-full animate-thinking" style={{ animationDelay: '0s' }} />
                  <span className="inline-block w-2 h-2 bg-current rounded-full animate-thinking" style={{ animationDelay: '0.2s' }} />
                  <span className="inline-block w-2 h-2 bg-current rounded-full animate-thinking" style={{ animationDelay: '0.4s' }} />
                </span>
              ) : (
                <>
                  {formatChatContent(contentToDisplay)}
                  {message.isTyping && isTyping && (
                    <span className="inline-flex gap-1 ml-2 align-middle items-center h-4">
                      <span className="inline-block w-2 h-2 bg-current rounded-full animate-thinking" style={{ animationDelay: '0s' }} />
                      <span className="inline-block w-2 h-2 bg-current rounded-full animate-thinking" style={{ animationDelay: '0.2s' }} />
                      <span className="inline-block w-2 h-2 bg-current rounded-full animate-thinking" style={{ animationDelay: '0.4s' }} />
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className={`text-xs text-muted-foreground px-2 ${
            message.isBot ? 'text-left' : 'text-right'
          }`}>
            {message.timestamp}
          </div>
        </div>

       
      </div>
    </div>
  );
};