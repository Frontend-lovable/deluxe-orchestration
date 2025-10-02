import { Card } from "@/components/ui/card";
import { FileText, Users, Target, Settings, Database, Shield } from "lucide-react";

interface BRDSection {
  title: string;
  description: string;
}

interface BRDSectionTabsProps {
  sections: BRDSection[];
  onSectionClick: (title: string, description: string) => void;
}

const getIconForSection = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("executive") || lowerTitle.includes("summary")) {
    return <FileText className="w-4 h-4" />;
  } else if (lowerTitle.includes("stakeholder")) {
    return <Users className="w-4 h-4" />;
  } else if (lowerTitle.includes("business") || lowerTitle.includes("objective")) {
    return <Target className="w-4 h-4" />;
  } else if (lowerTitle.includes("functional")) {
    return <Settings className="w-4 h-4" />;
  } else if (lowerTitle.includes("data")) {
    return <Database className="w-4 h-4" />;
  } else if (lowerTitle.includes("security")) {
    return <Shield className="w-4 h-4" />;
  }
  return <FileText className="w-4 h-4" />;
};

export const BRDSectionTabs = ({ sections, onSectionClick }: BRDSectionTabsProps) => {
  if (!sections || sections.length === 0) return null;

  return (
    <Card className="p-4 bg-white border border-border mt-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Document Overview</h3>
      <div className="space-y-2">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => onSectionClick(section.title, section.description)}
            className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="text-muted-foreground group-hover:text-foreground mt-0.5">
                {getIconForSection(section.title)}
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