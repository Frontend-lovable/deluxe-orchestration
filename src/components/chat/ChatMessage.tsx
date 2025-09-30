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

// Function to parse markdown and return React elements
const parseMarkdown = (text: string): JSX.Element => {
  if (!text) return <></>;

  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];
  let tableRows: string[][] = [];
  let inTable = false;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc pl-5 my-2 space-y-1">
          {listItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      elements.push(
        <table key={`table-${elements.length}`} className="border-collapse border border-border my-3 w-full">
          <tbody>
            {tableRows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="border border-border px-2 py-1">
                    {cell.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
      tableRows = [];
      inTable = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Handle headers
    if (trimmedLine.startsWith('## ')) {
      flushList();
      flushTable();
      elements.push(
        <h3 key={`h3-${index}`} className="font-bold text-base mt-3 mb-2">
          {trimmedLine.substring(3)}
        </h3>
      );
    } else if (trimmedLine.startsWith('# ')) {
      flushList();
      flushTable();
      elements.push(
        <h2 key={`h2-${index}`} className="font-bold text-lg mt-3 mb-2">
          {trimmedLine.substring(2)}
        </h2>
      );
    }
    // Handle bullet points
    else if (trimmedLine.match(/^[-*]\s+(.+)$/)) {
      flushTable();
      const match = trimmedLine.match(/^[-*]\s+(.+)$/);
      if (match) {
        listItems.push(match[1]);
      }
    }
    // Handle table rows
    else if (trimmedLine.includes('|')) {
      flushList();
      // Skip separator rows like |---|---|
      if (!trimmedLine.match(/^\|[-:\s|]+\|$/)) {
        const cells = trimmedLine.split('|').filter(cell => cell.trim());
        if (cells.length > 0) {
          tableRows.push(cells);
          inTable = true;
        }
      }
    }
    // Handle bold text
    else if (trimmedLine.includes('**')) {
      flushList();
      flushTable();
      const parts = trimmedLine.split('**');
      const formatted = parts.map((part, idx) =>
        idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
      );
      elements.push(<p key={`p-${index}`} className="my-1">{formatted}</p>);
    }
    // Handle empty lines
    else if (trimmedLine === '') {
      flushList();
      flushTable();
      elements.push(<br key={`br-${index}`} />);
    }
    // Handle regular text
    else {
      flushList();
      flushTable();
      elements.push(<p key={`p-${index}`} className="my-1">{line}</p>);
    }
  });

  // Flush any remaining items
  flushList();
  flushTable();

  return <>{elements}</>;
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const { displayedText, isTyping } = useTypingEffect(
    message.isTyping ? message.content : '', 
    15
  );

  // Determine which content to display
  const contentToDisplay = message.isTyping ? (displayedText || message.content) : message.content;
  const parsedContent = parseMarkdown(contentToDisplay || '');

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
            <div className={`text-sm break-words ${!message.isBot ? 'text-white' : ''}`}>
              {parsedContent}
              {message.isTyping && isTyping && (
                <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
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