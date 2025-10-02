import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, Users, Target, Settings, Database, Shield } from "lucide-react";

interface BRDSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface BRDSectionTabsProps {
  onSectionClick: (title: string, description: string) => void;
}

const sections: BRDSection[] = [
  {
    id: "executive-summary",
    title: "Executive Summary",
    description: "High level overview of the project",
    icon: <FileText className="w-4 h-4" />
  },
  {
    id: "stakeholders",
    title: "Stakeholders",
    description: "Key people and roles involved",
    icon: <Users className="w-4 h-4" />
  },
  {
    id: "business-objectives",
    title: "Business Objectives",
    description: "Goals and success criteria",
    icon: <Target className="w-4 h-4" />
  },
  {
    id: "functional-requirements",
    title: "Functional Requirements",
    description: "What the system must do",
    icon: <Settings className="w-4 h-4" />
  },
  {
    id: "data-requirements",
    title: "Data Requirements",
    description: "Data storage and processing needs",
    icon: <Database className="w-4 h-4" />
  },
  {
    id: "security-requirements",
    title: "Security Requirements",
    description: "Security and compliance needs",
    icon: <Shield className="w-4 h-4" />
  }
];

export const BRDSectionTabs = ({ onSectionClick }: BRDSectionTabsProps) => {
  return (
    <Card className="p-4 bg-white border border-border">
      <h3 className="text-sm font-semibold text-foreground mb-3">Document Overview</h3>
      <div className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionClick(section.title, section.description)}
            className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="text-muted-foreground group-hover:text-foreground mt-0.5">
                {section.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground mb-0.5">
                  {section.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {section.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};