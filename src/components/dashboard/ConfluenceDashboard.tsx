import { ChatInterface } from "../chat/ChatInterface";
import { FileUploadSection } from "../files/FileUploadSection";

export const ConfluenceDashboard = () => {
  return (
    <div className="p-8" style={{ backgroundColor: '#fff' }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Confluence Integration</h1>
        <p className="text-muted-foreground">Browse and integrate documentation from Confluence</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1">
          <div className="h-[600px]">
            <ChatInterface
              title="Confluence Assistant"
              subtitle="Browse and integrate Confluence documentation"
              initialMessage="Hello! 👋 I'm your Confluence Assistant. I can help you browse, search, and integrate documentation from your Confluence workspace.

What would you like to explore today?"
              placeholder="Ask about Confluence documents or search..."
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