import { useState, useEffect } from "react";
import { BRDProgress } from "../brd/BRDProgress";
import { ChatInterface } from "../chat/ChatInterface";
import { FileUploadSection } from "../files/FileUploadSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAppState } from "@/contexts/AppStateContext";
const sectionContent = {
  "Executive Summary": {
    title: "Executive Summary Assistant",
    subtitle: "Get help creating a comprehensive executive summary for your BRD",
    initialMessage: "Hello! 👋 I'm here to help you create an executive summary for your Payment Gateway project.\n\nAn executive summary should provide a high-level overview including:\n• Project purpose and scope\n• Key stakeholders\n• Business value and ROI\n• Timeline and budget overview\n\nWhat specific aspect would you like to focus on first?",
    placeholder: "Ask about executive summary requirements..."
  },
  "Stakeholders": {
    title: "Stakeholder Analysis Assistant",
    subtitle: "Identify and document key stakeholders for your project",
    initialMessage: "Hello! 👋 Let's identify the key stakeholders for your Payment Gateway project.\n\nWe should document:\n• Primary stakeholders (project sponsors, end users)\n• Secondary stakeholders (IT teams, compliance)\n• External stakeholders (payment processors, banks)\n• Their roles, responsibilities, and influence levels\n\nWho are the main stakeholders you've identified so far?",
    placeholder: "Describe your stakeholders..."
  },
  "Business Objectives": {
    title: "Business Objectives Assistant",
    subtitle: "Define clear business goals and success criteria",
    initialMessage: "Hello! 👋 Let's define the business objectives for your Payment Gateway project.\n\nWe should establish:\n• Primary business goals\n• Success metrics and KPIs\n• ROI expectations\n• Risk mitigation objectives\n• Compliance requirements\n\nWhat are the main business drivers for this payment gateway?",
    placeholder: "Describe your business objectives..."
  },
  "Functional Requirements": {
    title: "Functional Requirements Assistant",
    subtitle: "Document what the system must do",
    initialMessage: "Hello! 👋 Let's document the functional requirements for your Payment Gateway.\n\nWe should cover:\n• Payment processing capabilities\n• Supported payment methods\n• User interface requirements\n• Integration requirements\n• Transaction handling\n• Reporting features\n\nWhat payment processing features are most critical for your system?",
    placeholder: "Describe functional requirements..."
  },
  "Data Requirements": {
    title: "Data Requirements Assistant",
    subtitle: "Define data storage and processing needs",
    initialMessage: "Hello! 👋 Let's define the data requirements for your Payment Gateway.\n\nWe should document:\n• Transaction data structure\n• Customer data requirements\n• Data storage and retention policies\n• Data flow between systems\n• Backup and recovery requirements\n• Data encryption needs\n\nWhat types of transaction data will your system need to handle?",
    placeholder: "Describe data requirements..."
  },
  "Security Requirements": {
    title: "Security Requirements Assistant",
    subtitle: "Ensure security and compliance standards",
    initialMessage: "Hello! 👋 Let's establish security requirements for your Payment Gateway.\n\nWe must address:\n• PCI DSS compliance\n• Data encryption standards\n• Authentication and authorization\n• Fraud detection and prevention\n• Security monitoring and logging\n• Vulnerability management\n\nWhat security standards does your organization need to comply with?",
    placeholder: "Describe security requirements..."
  }
};
interface BRDDashboardProps {
  onBack?: () => void;
  selectedProject?: any;
  selectedBRDTemplate?: string | null;
}
export const BRDDashboard = ({
  onBack,
  selectedProject,
  selectedBRDTemplate
}: BRDDashboardProps) => {
  const { 
    chatMessages, 
    setChatMessages, 
    selectedProject: contextProject, 
    selectedBRDTemplate: contextTemplate,
    pendingUploadResponse,
    setPendingUploadResponse,
    uploadedFileBatches,
    brdSections,
    setBrdSections
  } = useAppState();
  const [selectedSection, setSelectedSection] = useState<string>("Executive Summary");
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const sectionOrder = ["Executive Summary", "Stakeholders", "Business Objectives", "Functional Requirements", "Data Requirements", "Security Requirements"];

  // Check for pending upload response on mount and add to chat
  useEffect(() => {
    if (pendingUploadResponse) {
      const content = pendingUploadResponse.brd_auto_generated?.content_preview || pendingUploadResponse.message || 'File uploaded successfully';
      
      // Parse the content to extract dynamic sections
      const parsedSections = parseBRDSections(content);
      if (parsedSections.length > 0) {
        setBrdSections(parsedSections);
      }
      
      const botMessage = {
        id: `bot-${Date.now()}`,
        content: content,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      const currentMessages = chatMessages.brd || [];
      // Only add if not already in messages
      const messageExists = currentMessages.some(msg => msg.content === botMessage.content);
      if (!messageExists) {
        setChatMessages("brd", [...currentMessages, botMessage]);
      }
      // Clear the pending response after adding to chat
      setPendingUploadResponse(null);
    }
  }, [pendingUploadResponse, chatMessages.brd, setChatMessages, setPendingUploadResponse, setBrdSections]);

  // Function to parse BRD sections from API response
  const parseBRDSections = (content: string) => {
    const sections = [];
    
    // Try to parse structured content
    // Looking for patterns like "Executive Summary:", "Stakeholders:", etc.
    const sectionPatterns = [
      { title: "Executive Summary", pattern: /Executive Summary[:\n](.*?)(?=\n\n|Stakeholders|$)/is },
      { title: "Stakeholders", pattern: /Stakeholders[:\n](.*?)(?=\n\n|Business Objectives|$)/is },
      { title: "Business Objectives", pattern: /Business Objectives[:\n](.*?)(?=\n\n|Functional Requirements|$)/is },
      { title: "Functional Requirements", pattern: /Functional Requirements[:\n](.*?)(?=\n\n|Data Requirements|$)/is },
      { title: "Data Requirements", pattern: /Data Requirements[:\n](.*?)(?=\n\n|Security Requirements|$)/is },
      { title: "Security Requirements", pattern: /Security Requirements[:\n](.*?)$/is }
    ];

    for (const { title, pattern } of sectionPatterns) {
      const match = content.match(pattern);
      if (match) {
        const sectionContent = match[1]?.trim();
        const description = sectionContent ? 
          sectionContent.split('\n')[0].substring(0, 100) + (sectionContent.length > 100 ? '...' : '') :
          `Details about ${title}`;
        
        sections.push({
          title,
          description,
          content: sectionContent || ''
        });
      }
    }

    return sections;
  };
  const handleSectionReviewed = () => {
    // Mark current section as completed
    if (!completedSections.includes(selectedSection)) {
      setCompletedSections([...completedSections, selectedSection]);
    }

    // Move to next section
    const currentIndex = sectionOrder.indexOf(selectedSection);
    if (currentIndex < sectionOrder.length - 1) {
      const nextSection = sectionOrder[currentIndex + 1];
      setSelectedSection(nextSection);
    }
  };

  const handleFileUploadSuccess = (response?: any) => {
    // Response is already handled by global state and useEffect
  };

  const handleSectionTabClick = (title: string, description: string) => {
    const currentMessages = chatMessages.brd || [];
    const newMessage = {
      id: `section-${Date.now()}`,
      content: `**${title}**\n\n${description}`,
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setChatMessages("brd", [...currentMessages, newMessage]);
  };
  return <div className="p-4 sm:p-6 lg:p-8 bg-white">
      <div className="mb-4 lg:mb-2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-accent">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold sm:text-base">Payment Gateway</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-stretch" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#E6E6E6 transparent'
      }}>
        <div className="lg:col-span-3 order-1 lg:order-1">
          <BRDProgress 
            selectedSection={selectedSection} 
            onSectionChange={setSelectedSection} 
            completedSections={completedSections} 
            hasProjectAndTemplate={!!(contextProject && contextTemplate)} 
            disabled={uploadedFileBatches.length === 0}
            onSectionClick={handleSectionTabClick}
            showDocumentOverview={uploadedFileBatches.length > 0}
            dynamicSections={brdSections}
          />
        </div>
        
        <div className="lg:col-span-6 order-3 lg:order-2">
          <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
            <ChatInterface 
              title={sectionContent[selectedSection as keyof typeof sectionContent]?.title || "BRD Assistant"} 
              subtitle={sectionContent[selectedSection as keyof typeof sectionContent]?.subtitle || "Discuss your business requirements"} 
              initialMessage={sectionContent[selectedSection as keyof typeof sectionContent]?.initialMessage || "Hello! 👋 I'm your BRD Assistant."} 
              placeholder={sectionContent[selectedSection as keyof typeof sectionContent]?.placeholder || "Type your message..."} 
              onReviewed={handleSectionReviewed}
              externalMessages={chatMessages.brd}
              onMessagesChange={(messages) => setChatMessages("brd", messages)}
              disabled={uploadedFileBatches.length === 0}
            />
          </div>
        </div>
        
        <div className="lg:col-span-3 order-2 lg:order-3">
          <FileUploadSection onUploadSuccess={handleFileUploadSuccess} />
        </div>
      </div>
    </div>;
};