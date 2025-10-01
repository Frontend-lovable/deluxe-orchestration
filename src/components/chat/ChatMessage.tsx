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

// Enhanced function to format and render markdown-like text
const formatChatContent = (text: string) => {
  // Safety check for invalid values
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return <p className="mb-3 last:mb-0 leading-relaxed">No content</p>;
  }
  
  text = text.trim();
  
  // Extra safety: remove any "undefined" that might have slipped through
  text = text.replace(/\s+undefined\s*$/gi, '').replace(/^\s*undefined\s+/gi, '').trim();
  
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let currentParagraph: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const content = currentParagraph.join('\n');
      elements.push(
        <p key={`p-${key++}`} className="mb-3 last:mb-0 leading-relaxed">
          {formatInlineContent(content)}
        </p>
      );
      currentParagraph = [];
    }
  };

  lines.forEach((line, index) => {
    // Code block detection
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        flushParagraph();
        elements.push(
          <pre key={`code-${key++}`} className="bg-muted/50 rounded-md p-3 mb-3 overflow-x-auto">
            <code className="text-xs font-mono">{codeBlockContent.join('\n')}</code>
          </pre>
        );
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        flushParagraph();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    // Headers
    if (line.startsWith('### ')) {
      flushParagraph();
      elements.push(
        <h3 key={`h3-${key++}`} className="font-bold text-sm mb-2 mt-3 first:mt-0">
          {formatInlineContent(line.substring(4))}
        </h3>
      );
      return;
    }
    if (line.startsWith('## ')) {
      flushParagraph();
      elements.push(
        <h2 key={`h2-${key++}`} className="font-bold text-base mb-2 mt-4 first:mt-0">
          {formatInlineContent(line.substring(3))}
        </h2>
      );
      return;
    }
    if (line.startsWith('# ')) {
      flushParagraph();
      elements.push(
        <h1 key={`h1-${key++}`} className="font-bold text-lg mb-3 mt-4 first:mt-0">
          {formatInlineContent(line.substring(2))}
        </h1>
      );
      return;
    }

    // Bullet lists
    if (line.match(/^[\s]*[-*]\s+/)) {
      flushParagraph();
      const content = line.replace(/^[\s]*[-*]\s+/, '');
      elements.push(
        <div key={`bullet-${key++}`} className="flex gap-2 mb-2 ml-2">
          <span className="mt-1.5">•</span>
          <span className="flex-1">{formatInlineContent(content)}</span>
        </div>
      );
      return;
    }

    // Numbered lists
    if (line.match(/^[\s]*\d+\.\s+/)) {
      flushParagraph();
      const match = line.match(/^[\s]*(\d+)\.\s+(.*)$/);
      if (match) {
        elements.push(
          <div key={`num-${key++}`} className="flex gap-2 mb-2 ml-2">
            <span className="font-medium">{match[1]}.</span>
            <span className="flex-1">{formatInlineContent(match[2])}</span>
          </div>
        );
      }
      return;
    }

    // Empty lines
    if (line.trim() === '') {
      flushParagraph();
      return;
    }

    // Regular text - accumulate into paragraph
    currentParagraph.push(line);
  });

  flushParagraph();

  return <div className="space-y-1">{elements}</div>;
};

// Format inline content (bold, italic, code, links)
const formatInlineContent = (text: string) => {
  const parts: (string | JSX.Element)[] = [];
  const replacements: { type: string; content: string; url?: string }[] = [];
  let processedText = text;
  let key = 0;

  // Process inline code first (highest priority)
  processedText = processedText.replace(/`([^`]+)`/g, (match, code) => {
    const placeholder = `__PLACEHOLDER_${replacements.length}__`;
    replacements.push({ type: 'code', content: code });
    return placeholder;
  });

  // Process bold (before italic to handle ** before *)
  processedText = processedText.replace(/\*\*(.+?)\*\*/g, (match, bold) => {
    const placeholder = `__PLACEHOLDER_${replacements.length}__`;
    replacements.push({ type: 'bold', content: bold });
    return placeholder;
  });

  // Process italic
  processedText = processedText.replace(/\*(.+?)\*/g, (match, italic) => {
    const placeholder = `__PLACEHOLDER_${replacements.length}__`;
    replacements.push({ type: 'italic', content: italic });
    return placeholder;
  });

  // Process links
  processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
    const placeholder = `__PLACEHOLDER_${replacements.length}__`;
    replacements.push({ type: 'link', content: linkText, url });
    return placeholder;
  });

  // Split by placeholders
  const tokens = processedText.split(/(__PLACEHOLDER_\d+__)/g);
  
  tokens.forEach((token, index) => {
    const match = token.match(/__PLACEHOLDER_(\d+)__/);
    if (match) {
      const replacement = replacements[parseInt(match[1])];
      if (replacement.type === 'code') {
        parts.push(
          <code key={`inline-${index}`} className="bg-muted/50 px-1.5 py-0.5 rounded text-xs font-mono">
            {replacement.content}
          </code>
        );
      } else if (replacement.type === 'bold') {
        parts.push(<strong key={`inline-${index}`} className="font-semibold">{replacement.content}</strong>);
      } else if (replacement.type === 'italic') {
        parts.push(<em key={`inline-${index}`}>{replacement.content}</em>);
      } else if (replacement.type === 'link') {
        parts.push(
          <a
            key={`inline-${index}`}
            href={replacement.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:no-underline"
          >
            {replacement.content}
          </a>
        );
      }
    } else if (token) {
      parts.push(token);
    }
  });

  return <>{parts}</>;
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