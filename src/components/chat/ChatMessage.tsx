import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTypingEffect } from "@/hooks/useTypingEffect";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    isBot: boolean;
    timestamp: string;
    isTyping?: boolean;
  };
}

// Function to format text with proper spacing and structure
const formatChatText = (text: string): string => {
  if (!text) return '';
  
  return text
    // Convert markdown headers to formatted text
    .replace(/^## (.*$)/gm, '\n$1\n')
    .replace(/^# (.*$)/gm, '\n$1\n')
    // Add spacing around bullet points
    .replace(/^- (.*$)/gm, '• $1')
    .replace(/^\* (.*$)/gm, '• $1')
    // Add proper paragraph spacing
    .replace(/\n\n/g, '\n\n')
    // Clean up extra newlines at start/end
    .trim();
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const { displayedText, isTyping } = useTypingEffect(
    message.isTyping ? message.content : '', 
    15
  );

  const rawContent = message.isTyping ? displayedText : message.content;
  const content = formatChatText(rawContent || "I encountered an error while processing your request. Please try again.");

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
            px-4 py-2 rounded-2xl max-w-full
            ${message.isBot 
              ? 'bg-muted text-muted-foreground rounded-bl-md' 
              : 'bg-primary rounded-br-md'
            }
          `}>
            <p className={`text-sm whitespace-pre-wrap break-words ${!message.isBot ? 'text-white' : ''}`} style={!message.isBot ? { color: '#fff !important' } : {}}>
              {content}
              {message.isTyping && isTyping && (
                <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
              )}
            </p>
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