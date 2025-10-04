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
  if (!text) return null;
  
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let currentParagraph: string[] = [];
  let inTable = false;
  let tableRows: string[] = [];
  let inList = false;
  let listItems: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const content = currentParagraph.map(line => line.trim()).join(' ');
      elements.push(
        <p key={`p-${key++}`} className="mb-3 last:mb-0 leading-relaxed text-sm">
          {formatInlineContent(content)}
        </p>
      );
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <div key={`list-${key++}`} className="mb-3 space-y-1.5">
          {listItems.map((item, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-primary mt-1 flex-shrink-0">•</span>
              <span className="flex-1 text-sm">{formatInlineContent(item)}</span>
            </div>
          ))}
        </div>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushTable = () => {
    if (tableRows.length > 1) {
      const headerRow = tableRows[0].split('|').filter(cell => cell.trim());
      const dataRows = tableRows.slice(2).map(row => 
        row.split('|').filter(cell => cell.trim())
      );

      elements.push(
        <div key={`table-${key++}`} className="mb-4 overflow-x-auto">
          <table className="min-w-full border-collapse border border-border rounded-lg overflow-hidden">
            <thead className="bg-primary/10">
              <tr>
                {headerRow.map((header, i) => (
                  <th key={i} className="border border-border px-4 py-2.5 text-left font-semibold text-sm">
                    {formatInlineContent(header.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="border border-border px-4 py-2.5 text-sm">
                      {formatInlineContent(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  lines.forEach((line, index) => {
    // Code block detection
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        flushParagraph();
        flushList();
        flushTable();
        elements.push(
          <pre key={`code-${key++}`} className="bg-muted/50 rounded-lg p-4 mb-3 overflow-x-auto">
            <code className="text-xs font-mono">{codeBlockContent.join('\n')}</code>
          </pre>
        );
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        flushParagraph();
        flushList();
        flushTable();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    // Table detection (markdown tables with |)
    if (line.trim().includes('|') && line.trim().split('|').length > 2) {
      flushParagraph();
      flushList();
      inTable = true;
      tableRows.push(line);
      return;
    } else if (inTable && line.trim() === '') {
      flushTable();
      return;
    } else if (inTable && !line.trim().includes('|')) {
      flushTable();
    }

    // Markdown headers with enhanced styling
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      flushParagraph();
      flushList();
      flushTable();
      const level = headerMatch[1].length;
      const content = headerMatch[2];
      const headingClasses = {
        1: 'text-xl font-bold mb-4 mt-5 text-heading-primary border-b border-border pb-2',
        2: 'text-lg font-bold mb-3 mt-4 text-heading-primary',
        3: 'text-base font-semibold mb-2 mt-3 text-heading-secondary',
        4: 'text-sm font-semibold mb-2 mt-2',
        5: 'text-sm font-medium mb-1.5 mt-2',
        6: 'text-sm font-medium mb-1 mt-1'
      };
      elements.push(
        <div key={`h${level}-${key++}`} className={headingClasses[level as keyof typeof headingClasses]}>
          {formatInlineContent(content)}
        </div>
      );
      return;
    }

    // Detect "Field: Value" pattern for descriptions
    const fieldValueMatch = line.match(/^([A-Za-z\s]+):\s*(.+)$/);
    if (fieldValueMatch && !line.startsWith('http') && !line.includes('//')) {
      flushParagraph();
      flushList();
      const [, field, value] = fieldValueMatch;
      elements.push(
        <div key={`field-${key++}`} className="mb-2 flex gap-2">
          <span className="font-semibold text-sm min-w-fit">{field}:</span>
          <span className="text-sm flex-1">{formatInlineContent(value)}</span>
        </div>
      );
      return;
    }

    // Bullet lists (-, *, •)
    if (line.match(/^[\s]*[-*•]\s+/)) {
      flushParagraph();
      flushTable();
      const content = line.replace(/^[\s]*[-*•]\s+/, '');
      inList = true;
      listItems.push(content);
      return;
    } else if (inList && line.trim() === '') {
      flushList();
      return;
    } else if (inList && !line.match(/^[\s]*[-*•]\s+/)) {
      flushList();
    }

    // Numbered lists
    if (line.match(/^[\s]*\d+\.\s+/)) {
      flushParagraph();
      flushList();
      flushTable();
      const match = line.match(/^[\s]*(\d+)\.\s+(.*)$/);
      if (match) {
        elements.push(
          <div key={`num-${key++}`} className="flex gap-2 mb-2 items-start">
            <span className="font-semibold text-sm text-primary flex-shrink-0">{match[1]}.</span>
            <span className="flex-1 text-sm">{formatInlineContent(match[2])}</span>
          </div>
        );
      }
      return;
    }

    // Empty lines
    if (line.trim() === '') {
      flushParagraph();
      flushList();
      flushTable();
      return;
    }

    // Regular text - accumulate into paragraph
    if (!inList) {
      currentParagraph.push(line);
    }
  });

  flushParagraph();
  flushList();
  flushTable();

  return <div className="space-y-1">{elements}</div>;
};

// Format inline content (bold, italic, code, links)
const formatInlineContent = (text: string) => {
  const parts: (string | JSX.Element)[] = [];
  const replacements: { type: string; content: string; url?: string }[] = [];
  let processedText = text;

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

  // Split by placeholders and maintain proper spacing
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
      // Push text directly as string - React handles it correctly
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
      <div className={`flex ${message.isBot ? 'flex-row' : 'flex-row-reverse'} items-end gap-2 max-w-[85%]`}>
        {message.isBot && (
          <Avatar className="w-6 h-6 bg-primary flex-shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              AI
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className="space-y-1 min-w-0 flex-1">
          <div className={`
            px-4 py-3 rounded-2xl w-full
            ${message.isBot 
              ? 'bg-muted text-foreground rounded-bl-md' 
              : 'bg-primary text-white rounded-br-md'
            }
          `}>
            <div className={`text-sm break-words overflow-wrap-anywhere ${message.isBot ? 'text-foreground' : 'text-white [&_*]:text-white'}`}>
              {message.isLoading ? (
                <span className="inline-flex gap-1 align-middle items-center h-4">
                  <span className="inline-block w-2 h-2 bg-current rounded-full animate-thinking" style={{ animationDelay: '0s' }} />
                  <span className="inline-block w-2 h-2 bg-current rounded-full animate-thinking" style={{ animationDelay: '0.2s' }} />
                  <span className="inline-block w-2 h-2 bg-current rounded-full animate-thinking" style={{ animationDelay: '0.4s' }} />
                </span>
              ) : (
                <>
                  {formatChatContent(message.content)}
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