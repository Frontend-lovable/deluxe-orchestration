import { CheckCircle, Circle, Users, Target, List, Database, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const brdSections = [{
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
interface BRDProgressProps {
  selectedSection: string;
  onSectionChange: (section: string) => void;
  completedSections: string[];
}

export const BRDProgress = ({ selectedSection, onSectionChange, completedSections }: BRDProgressProps) => {
  const completedCount = completedSections.length;
  return <Card className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-[hsl(var(--heading-primary))]">
            BRD Progress
            <div className="w-8 h-1 bg-primary rounded"></div>
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {completedCount}/{brdSections.length} sections
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-3">
        <div className="space-y-3 pr-2">
          {brdSections.map(section => <div 
              key={section.title} 
              onClick={() => onSectionChange(section.title)}
              className={`flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer ${
                selectedSection === section.title ? 'bg-accent border-2 border-primary' : ''
              }`}
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{section.title}</div>
                <div className="text-xs" style={{color: '#727272'}}>
                  {section.description}
                </div>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
};