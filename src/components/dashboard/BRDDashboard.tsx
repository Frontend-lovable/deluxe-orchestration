import { useState } from "react";
import { BRDProgress } from "../brd/BRDProgress";
import { ChatInterface } from "../chat/ChatInterface";
import { FileUploadSection } from "../files/FileUploadSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
}
export const BRDDashboard = ({
  onBack
}: BRDDashboardProps) => {
  const [selectedSection, setSelectedSection] = useState<string>("Executive Summary");
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const sectionOrder = ["Executive Summary", "Stakeholders", "Business Objectives", "Functional Requirements", "Data Requirements", "Security Requirements"];
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
  return <div className="p-4 sm:p-6 lg:p-8 bg-white">
      <div className="mb-6 lg:mb-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-accent">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold sm:text-base">Payment Gateway</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-stretch">
        <div className="lg:col-span-3 order-1 lg:order-1">
          <BRDProgress selectedSection={selectedSection} onSectionChange={setSelectedSection} completedSections={completedSections} />
        </div>
        
        <div className="lg:col-span-6 order-3 lg:order-2">
          <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
            <ChatInterface title={sectionContent[selectedSection as keyof typeof sectionContent]?.title || "BRD Assistant"} subtitle={sectionContent[selectedSection as keyof typeof sectionContent]?.subtitle || "Discuss your business requirements"} initialMessage={sectionContent[selectedSection as keyof typeof sectionContent]?.initialMessage || "Hello! 👋 I'm your BRD Assistant."} placeholder={sectionContent[selectedSection as keyof typeof sectionContent]?.placeholder || "Type your message..."} onReviewed={handleSectionReviewed} />
          </div>
        </div>
        
        <div className="lg:col-span-3 order-2 lg:order-3">
          <FileUploadSection />
        </div>
      </div>
    </div>;
};