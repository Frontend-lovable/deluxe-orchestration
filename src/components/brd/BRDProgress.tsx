import { CheckCircle, Circle, Users, Target, List, Database, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const brdSections = [
  {
    icon: CheckCircle,
    title: "Executive Summary",
    description: "High level overview of the project",
    status: "done",
  },
  {
    icon: Users,
    title: "Stakeholders",
    description: "Key people and roles involved",
    status: "pending",
  },
  {
    icon: Target,
    title: "Business Objectives",
    description: "Goals and success criteria",
    status: "pending",
  },
  {
    icon: List,
    title: "Functional Requirements",
    description: "What the system must do",
    status: "pending",
  },
  {
    icon: Database,
    title: "Data Requirements",
    description: "Data storage and processing needs",
    status: "pending",
  },
  {
    icon: Shield,
    title: "Security Requirements",
    description: "Security and compliance needs",
    status: "pending",
  },
];

export const BRDProgress = () => {
  const completedSections = brdSections.filter(s => s.status === "done").length;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            BRD Progress
            <div className="w-8 h-1 bg-primary rounded"></div>
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {completedSections}/{brdSections.length} sections
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {brdSections.map((section) => (
            <div key={section.title} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="flex-shrink-0">
                {section.status === "done" ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{section.title}</div>
                <div className="text-xs text-muted-foreground">
                  {section.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};