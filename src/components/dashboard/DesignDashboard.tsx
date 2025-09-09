import { ChatInterface } from "../chat/ChatInterface";
import { FileUploadSection } from "../files/FileUploadSection";

export const DesignDashboard = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#fff' }}>
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Design Assistant</h1>
        <p className="text-muted-foreground">Technical architecture planning and system design</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <div className="h-[500px] sm:h-[600px]">
            <ChatInterface
              title="Design Assistant"
              subtitle="Technical architecture and system design guidance"
              initialMessage="Hello! 👋 I'm your Design Assistant. I can help you with technical architecture planning, system design, and creating scalable solutions.

What design challenge would you like to tackle?"
              placeholder="Ask about architecture, design patterns, or system planning..."
            />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <FileUploadSection />
        </div>
      </div>
    </div>
  );
};