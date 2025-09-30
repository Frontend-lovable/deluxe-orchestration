import { CheckCircle, Circle, Users, Target, List, Database, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const defaultBrdSections = [{
  icon: CheckCircle,
  title: "Executive Summary",
  description: "High level overview of the project",
  status: "pending"
}, {
  icon: Users,
  title: "Stakeholders",
  description: "Key people and roles involved",
  status: "pending"
}, {
  icon: Target,
  title: "Business Objectives",
  description: "Goals and success criteria",
  status: "pending"
}, {
  icon: List,
  title: "Functional Requirements",
  description: "What the system must do",
  status: "pending"
}, {
  icon: Database,
  title: "Data Requirements",
  description: "Data storage and processing needs",
  status: "pending"
}, {
  icon: Shield,
  title: "Security Requirements",
  description: "Security and compliance needs",
  status: "pending"
}];

const templateBrdSections = [{
  icon: CheckCircle,
  title: "Document Overview",
  description: "Document purpose and structure",
  status: "pending"
}, {
  icon: Target,
  title: "Purpose",
  description: "Project purpose and goals",
  status: "pending"
}, {
  icon: List,
  title: "Background / Context",
  description: "Project background information",
  status: "pending"
}, {
  icon: Users,
  title: "Stakeholders",
  description: "Key people and roles involved",
  status: "pending"
}, {
  icon: Circle,
  title: "Scope",
  description: "Project scope and boundaries",
  status: "pending"
}, {
  icon: Target,
  title: "Business Objectives & ROI",
  description: "Business goals and return on investment",
  status: "pending"
}, {
  icon: List,
  title: "Functional Requirements",
  description: "What the system must do",
  status: "pending"
}, {
  icon: Shield,
  title: "Non-Functional Requirements",
  description: "Performance and quality requirements",
  status: "pending"
}, {
  icon: Users,
  title: "User Stories / Use Cases",
  description: "User scenarios and interactions",
  status: "pending"
}, {
  icon: CheckCircle,
  title: "Assumptions",
  description: "Project assumptions and dependencies",
  status: "pending"
}, {
  icon: Circle,
  title: "Constraints", 
  description: "Project limitations and restrictions",
  status: "pending"
}, {
  icon: Target,
  title: "Acceptance Criteria / KPIs",
  description: "Success metrics and criteria",
  status: "pending"
}, {
  icon: List,
  title: "Timeline / Milestones",
  description: "Project timeline and key milestones",
  status: "pending"
}, {
  icon: Shield,
  title: "Risks and Dependencies",
  description: "Project risks and external dependencies",
  status: "pending"
}, {
  icon: CheckCircle,
  title: "Approval & Review",
  description: "Approval process and review criteria",
  status: "pending"
}, {
  icon: Database,
  title: "Glossary & Appendix",
  description: "Terms and additional documentation",
  status: "pending"
}];
interface BRDProgressProps {
  selectedSection: string;
  onSectionChange: (section: string) => void;
  completedSections: string[];
  hasProjectAndTemplate?: boolean;
  useTemplateSections?: boolean;
  dynamicSections?: Array<{title: string, content: string, description?: string}>;
}

export const BRDProgress = ({ selectedSection, onSectionChange, completedSections, hasProjectAndTemplate = false, useTemplateSections = false, dynamicSections = [] }: BRDProgressProps) => {
  // Use dynamic sections from API if available, otherwise use template sections
  let brdSections = useTemplateSections ? templateBrdSections : defaultBrdSections;
  
  // If we have dynamic sections from API, transform them to match the display format
  if (dynamicSections && dynamicSections.length > 0) {
    const iconMap: Record<string, any> = {
      'Document Overview': CheckCircle,
      'Purpose': Target,
      'Background / Context': List,
      'Stakeholders': Users,
      'Scope': Circle,
      'Business Objectives & ROI': Target,
      'Functional Requirements': List,
      'Non-Functional Requirements': Shield,
      'User Stories / Use Cases': Users,
      'Assumptions': CheckCircle,
      'Constraints': Circle,
      'Acceptance Criteria / KPIs': Target,
      'Timeline / Milestones': List,
      'Risks and Dependencies': Shield,
      'Approval & Review': CheckCircle,
      'Glossary & Appendix': Database
    };
    
    // Deduplicate sections by title, keeping only the first occurrence
    const uniqueSections = new Map<string, typeof dynamicSections[0]>();
    dynamicSections.forEach(section => {
      if (!uniqueSections.has(section.title)) {
        uniqueSections.set(section.title, section);
      }
    });
    
    brdSections = Array.from(uniqueSections.values()).map(section => ({
      icon: iconMap[section.title] || CheckCircle,
      title: section.title,
      description: section.description || section.content.substring(0, 50) + '...',
      status: 'pending'
    }));
  }
  
  const completedCount = completedSections.length;
  return <Card className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-[hsl(var(--heading-primary))]">
            BRD Progress
            <div className="w-8 h-1 bg-primary rounded"></div>
          </CardTitle>
          {hasProjectAndTemplate && (
            <div className="text-sm text-muted-foreground">
              {completedCount}/{brdSections.length} sections
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-3">
        {!hasProjectAndTemplate && !useTemplateSections ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <div className="text-sm mb-2">Please select a project and BRD template to begin</div>
              <div className="text-xs">Use the dropdowns in the header to get started</div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pr-2">
            {brdSections.map(section => <div 
                key={section.title} 
                onClick={() => onSectionChange(section.title)}
                className={`flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer ${
                  selectedSection === section.title ? 'bg-accent border-2 border-primary' : 'border border-[#ccc] rounded-[4px]'
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{section.title}</div>
                  <div className="text-xs" style={{color: '#727272'}}>
                    {section.description}
                  </div>
                </div>
                {completedSections.includes(section.title) && (
                  <div className="flex-shrink-0">
                    <div 
                      className="px-2 py-1 rounded-md text-xs font-medium"
                      style={{ 
                        color: '#008236', 
                        backgroundColor: '#DBFCE7' 
                      }}
                    >
                      Done
                    </div>
                  </div>
                )}
              </div>)}
          </div>
        )}
      </CardContent>
    </Card>;
};