import { useState, useEffect } from "react";
import { BRDProgress } from "../brd/BRDProgress";
import { ChatInterface } from "../chat/ChatInterface";
import { FileUploadSection } from "../files/FileUploadSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
const defaultSectionContent = {
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

const templateSectionContent = {
  "Document Overview": {
    title: "Document Overview Assistant",
    subtitle: "Define the document structure and purpose",
    initialMessage: "Hello! 👋 Let's create a comprehensive document overview for your BRD.\n\nWe'll establish:\n• Document scope and purpose\n• Target audience\n• Document structure\n• Review process\n• Version control approach\n\nWhat type of project is this BRD for?",
    placeholder: "Tell me about your document overview..."
  },
  "Purpose": {
    title: "Purpose Assistant",
    subtitle: "Define the project purpose and objectives",
    initialMessage: "Hello! 👋 Let's define the purpose of your project.\n\nWe should clarify:\n• Why this project is needed\n• What problem it solves\n• Expected outcomes\n• Success indicators\n• Business justification\n\nWhat is the main purpose of your project?",
    placeholder: "Describe the project purpose..."
  },
  "Background / Context": {
    title: "Background & Context Assistant",
    subtitle: "Provide project background information",
    initialMessage: "Hello! 👋 Let's document the background and context for your project.\n\nWe'll cover:\n• Current situation\n• Historical context\n• Market conditions\n• Technology landscape\n• Organizational factors\n\nWhat background information is relevant to your project?",
    placeholder: "Share the project background..."
  },
  "Stakeholders": {
    title: "Stakeholder Analysis Assistant",
    subtitle: "Identify and document key stakeholders",
    initialMessage: "Hello! 👋 Let's identify all stakeholders for your project.\n\nWe'll document:\n• Primary stakeholders\n• Secondary stakeholders\n• Their roles and responsibilities\n• Influence and interest levels\n• Communication preferences\n\nWho are the key stakeholders involved?",
    placeholder: "List your stakeholders..."
  },
  "Scope": {
    title: "Scope Definition Assistant",
    subtitle: "Define project scope and boundaries",
    initialMessage: "Hello! 👋 Let's define the scope of your project.\n\nWe'll establish:\n• What's included in the project\n• What's explicitly excluded\n• Project boundaries\n• Deliverables\n• Assumptions about scope\n\nWhat is included in your project scope?",
    placeholder: "Define the project scope..."
  },
  "Business Objectives & ROI": {
    title: "Business Objectives & ROI Assistant",
    subtitle: "Define business goals and return on investment",
    initialMessage: "Hello! 👋 Let's establish the business objectives and ROI for your project.\n\nWe'll define:\n• Primary business objectives\n• Success metrics and KPIs\n• Expected ROI\n• Cost-benefit analysis\n• Value proposition\n\nWhat are your main business objectives?",
    placeholder: "Describe business objectives and ROI..."
  },
  "Functional Requirements": {
    title: "Functional Requirements Assistant",
    subtitle: "Document what the system must do",
    initialMessage: "Hello! 👋 Let's document the functional requirements for your system.\n\nWe'll cover:\n• Core functionality\n• User interactions\n• System processes\n• Input/output requirements\n• Business rules\n\nWhat key functions must your system perform?",
    placeholder: "List functional requirements..."
  },
  "Non-Functional Requirements": {
    title: "Non-Functional Requirements Assistant",
    subtitle: "Define performance and quality requirements",
    initialMessage: "Hello! 👋 Let's establish non-functional requirements for your system.\n\nWe'll address:\n• Performance requirements\n• Security standards\n• Usability criteria\n• Reliability expectations\n• Scalability needs\n\nWhat performance standards must be met?",
    placeholder: "Define non-functional requirements..."
  },
  "User Stories / Use Cases": {
    title: "User Stories & Use Cases Assistant",
    subtitle: "Document user scenarios and interactions",
    initialMessage: "Hello! 👋 Let's create user stories and use cases for your system.\n\nWe'll develop:\n• User personas\n• User journeys\n• Use case scenarios\n• Acceptance criteria\n• User interactions\n\nWho are your primary users and what do they need to do?",
    placeholder: "Describe user stories and use cases..."
  },
  "Assumptions": {
    title: "Assumptions Assistant",
    subtitle: "Document project assumptions",
    initialMessage: "Hello! 👋 Let's document the assumptions for your project.\n\nWe'll identify:\n• Technical assumptions\n• Business assumptions\n• Resource assumptions\n• Timeline assumptions\n• External dependencies\n\nWhat assumptions are you making about this project?",
    placeholder: "List project assumptions..."
  },
  "Constraints": {
    title: "Constraints Assistant", 
    subtitle: "Identify project limitations and restrictions",
    initialMessage: "Hello! 👋 Let's identify constraints that may limit your project.\n\nWe'll document:\n• Budget constraints\n• Time limitations\n• Resource restrictions\n• Technical constraints\n• Regulatory requirements\n\nWhat constraints might impact your project?",
    placeholder: "Describe project constraints..."
  },
  "Acceptance Criteria / KPIs": {
    title: "Acceptance Criteria & KPIs Assistant",
    subtitle: "Define success metrics and acceptance criteria",
    initialMessage: "Hello! 👋 Let's establish acceptance criteria and KPIs for your project.\n\nWe'll define:\n• Success metrics\n• Performance indicators\n• Quality standards\n• Acceptance tests\n• Measurement methods\n\nHow will you measure project success?",
    placeholder: "Define acceptance criteria and KPIs..."
  },
  "Timeline / Milestones": {
    title: "Timeline & Milestones Assistant",
    subtitle: "Plan project timeline and key milestones",
    initialMessage: "Hello! 👋 Let's create a timeline and identify key milestones for your project.\n\nWe'll establish:\n• Project phases\n• Key milestones\n• Dependencies\n• Critical path\n• Resource allocation\n\nWhat are the key milestones for your project?",
    placeholder: "Outline timeline and milestones..."
  },
  "Risks and Dependencies": {
    title: "Risks & Dependencies Assistant",
    subtitle: "Identify project risks and external dependencies",
    initialMessage: "Hello! 👋 Let's identify risks and dependencies for your project.\n\nWe'll document:\n• Potential risks\n• Risk mitigation strategies\n• External dependencies\n• Critical dependencies\n• Contingency plans\n\nWhat risks or dependencies do you foresee?",
    placeholder: "Describe risks and dependencies..."
  },
  "Approval & Review": {
    title: "Approval & Review Assistant",
    subtitle: "Define approval process and review criteria",
    initialMessage: "Hello! 👋 Let's establish the approval and review process for your project.\n\nWe'll define:\n• Approval workflow\n• Review criteria\n• Sign-off requirements\n• Governance structure\n• Change management process\n\nWhat approval process will you follow?",
    placeholder: "Describe approval and review process..."
  },
  "Glossary & Appendix": {
    title: "Glossary & Appendix Assistant",
    subtitle: "Define terms and additional documentation",
    initialMessage: "Hello! 👋 Let's create a glossary and appendix for your BRD.\n\nWe'll include:\n• Key terminology\n• Acronyms and definitions\n• Reference documents\n• Supporting materials\n• Additional resources\n\nWhat terms or additional materials should be included?",
    placeholder: "Add glossary terms and appendix items..."
  }
};
interface BRDDashboardProps {
  onBack?: () => void;
  selectedProject?: any;
  createBRDTrigger?: number;
}

interface SectionContent {
  title: string;
  subtitle: string;
  initialMessage: string;
  placeholder: string;
}

interface ParsedBRDSection {
  title: string;
  content: string;
}

// Function to parse BRD content and extract sections
const parseBRDContent = (brdContent: string): ParsedBRDSection[] => {
  const sections: ParsedBRDSection[] = [];
  const lines = brdContent.split('\n');
  
  const sectionMapping: { [key: string]: string[] } = {
    "Document Overview": ["document overview", "## 1. document overview"],
    "Purpose": ["## 2. purpose"],
    "Background / Context": ["## 3. background", "background / context", "background/context"],
    "Stakeholders": ["## 4. stakeholders"],
    "Scope": ["## 5. scope"],
    "Business Objectives & ROI": ["## 6. business objectives", "business objectives & roi", "business objectives and roi"],
    "Functional Requirements": ["## 7. functional requirements"],
    "Non-Functional Requirements": ["## 8. non-functional requirements"],
    "User Stories / Use Cases": ["## 9. user stories", "user stories / use cases"],
    "Assumptions": ["## 10. assumptions"],
    "Constraints": ["## 11. constraints"],
    "Acceptance Criteria / KPIs": ["## 12. acceptance criteria", "acceptance criteria / kpis"],
    "Timeline / Milestones": ["## 13. timeline", "timeline / milestones"],
    "Risks and Dependencies": ["## 14. risks and dependencies", "risks & dependencies"],
    "Approval & Review": ["## 15. approval", "approval & review"],
    "Glossary & Appendix": ["## 16. glossary", "glossary & appendix"]
  };

  for (const [sectionTitle, keywords] of Object.entries(sectionMapping)) {
    let startIndex = -1;
    let endIndex = -1;

    // Find the start of the section
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();
      if (keywords.some(keyword => line.includes(keyword.toLowerCase()))) {
        startIndex = i;
        break;
      }
    }

    if (startIndex !== -1) {
      // Find the end of the section (next ## heading or end of content)
      for (let i = startIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('## ') && i > startIndex) {
          endIndex = i;
          break;
        }
      }
      
      if (endIndex === -1) endIndex = lines.length;

      // Extract content between start and end
      const sectionLines = lines.slice(startIndex, endIndex);
      const content = sectionLines.join('\n').trim();
      
      if (content.length > 0) {
        sections.push({
          title: sectionTitle,
          content: content
        });
      }
    }
  }

  return sections;
};
export const BRDDashboard = ({
  onBack,
  selectedProject,
  createBRDTrigger
}: BRDDashboardProps) => {
  const [selectedSection, setSelectedSection] = useState<string>("Executive Summary");
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [useTemplateSections, setUseTemplateSections] = useState<boolean>(false);
  const [brdContent, setBrdContent] = useState<string>('');
  const [parsedSections, setParsedSections] = useState<ParsedBRDSection[]>([]);
  const [sectionDescriptions, setSectionDescriptions] = useState<{ [key: string]: string }>({});
  
  const defaultSectionOrder = ["Executive Summary", "Stakeholders", "Business Objectives", "Functional Requirements", "Data Requirements", "Security Requirements"];
  const templateSectionOrder = ["Document Overview", "Purpose", "Background / Context", "Stakeholders", "Scope", "Business Objectives & ROI", "Functional Requirements", "Non-Functional Requirements", "User Stories / Use Cases", "Assumptions", "Constraints", "Acceptance Criteria / KPIs", "Timeline / Milestones", "Risks and Dependencies", "Approval & Review", "Glossary & Appendix"];
  
  const sectionOrder = useTemplateSections ? templateSectionOrder : defaultSectionOrder;
  const sectionContent = useTemplateSections ? templateSectionContent : defaultSectionContent;
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

  const handleCreateBRD = () => {
    setUseTemplateSections(true);
    setSelectedSection("Document Overview");
    setCompletedSections([]);
  };

  // Watch for external BRD creation trigger from header
  useEffect(() => {
    if (createBRDTrigger && createBRDTrigger > 0) {
      handleCreateBRD();
    }
  }, [createBRDTrigger]);

  // Parse BRD content when it changes
  useEffect(() => {
    if (brdContent) {
      const parsed = parseBRDContent(brdContent);
      setParsedSections(parsed);
      
      // Create descriptions mapping
      const descriptions: { [key: string]: string } = {};
      parsed.forEach(section => {
        // Extract first paragraph as description
        const lines = section.content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
        const description = lines.slice(0, 3).join(' ').substring(0, 200) + '...';
        descriptions[section.title] = description || `Content for ${section.title}`;
      });
      setSectionDescriptions(descriptions);
    }
  }, [brdContent]);

  // Get current section content for chat
  const getCurrentSectionContent = () => {
    const currentParsedSection = parsedSections.find(section => section.title === selectedSection);
    if (currentParsedSection) {
      return currentParsedSection.content;
    }
    return sectionContent[selectedSection as keyof typeof sectionContent]?.initialMessage || "Hello! 👋 I'm your BRD Assistant.";
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
            hasProjectAndTemplate={!!selectedProject} 
            useTemplateSections={useTemplateSections}
            sectionDescriptions={sectionDescriptions}
          />
        </div>
        
        <div className="lg:col-span-6 order-3 lg:order-2">
          <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
            <ChatInterface title={sectionContent[selectedSection as keyof typeof sectionContent]?.title || "BRD Assistant"} subtitle={sectionContent[selectedSection as keyof typeof sectionContent]?.subtitle || "Discuss your business requirements"} initialMessage={getCurrentSectionContent()} placeholder={sectionContent[selectedSection as keyof typeof sectionContent]?.placeholder || "Type your message..."} onReviewed={handleSectionReviewed} externalMessage={brdContent} />
          </div>
        </div>
        
        <div className="lg:col-span-3 order-2 lg:order-3">
          <FileUploadSection onCreateBRD={handleCreateBRD} onBRDGenerated={setBrdContent} />
        </div>
      </div>
    </div>;
};