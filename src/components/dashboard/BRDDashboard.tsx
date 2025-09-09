import { useState } from "react";
import { BRDProgress } from "../brd/BRDProgress";
import { ChatInterface } from "../chat/ChatInterface";
import { FileUploadSection } from "../files/FileUploadSection";

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

export const BRDDashboard = () => {
  const [selectedSection, setSelectedSection] = useState<string>("Executive Summary");
  return (
    <div className="p-8 bg-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Payment Gateway</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-3">
          <BRDProgress 
            selectedSection={selectedSection}
            onSectionChange={setSelectedSection}
          />
        </div>
        
        <div className="lg:col-span-6">
          <div className="h-[600px]">
            <ChatInterface
              title={sectionContent[selectedSection as keyof typeof sectionContent]?.title || "BRD Assistant"}
              subtitle={sectionContent[selectedSection as keyof typeof sectionContent]?.subtitle || "Discuss your business requirements"}
              initialMessage={sectionContent[selectedSection as keyof typeof sectionContent]?.initialMessage || "Hello! 👋 I'm your BRD Assistant."}
              placeholder={sectionContent[selectedSection as keyof typeof sectionContent]?.placeholder || "Type your message..."}
            />
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <FileUploadSection />
        </div>
      </div>
    </div>
  );
};