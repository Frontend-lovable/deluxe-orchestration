import { BRDProgress } from "../brd/BRDProgress";
import { ChatInterface } from "../chat/ChatInterface";
import { FileUploadSection } from "../files/FileUploadSection";

export const BRDDashboard = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Payment Gateway</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <BRDProgress />
        </div>
        
        <div className="lg:col-span-1">
          <div className="h-[600px]">
            <ChatInterface
              title="BRD Assistant"
              subtitle="Discuss your business requirements and get help in creating your BRD"
              initialMessage="Hello! 👋 I'm your BRD Assistant. I'm here to help you create a business requirement document.

Please select a template to proceed."
              placeholder="Type your message about business requirements..."
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