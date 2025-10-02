import { CheckCircle, Circle, Users, Target, List, Database, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BRDSection {
  title: string;
  description: string;
}

interface BRDProgressProps {
  selectedSection: string;
  onSectionChange: (section: string) => void;
  completedSections: string[];
  hasProjectAndTemplate?: boolean;
  disabled?: boolean;
  sections?: BRDSection[];
}

export const BRDProgress = ({ selectedSection, onSectionChange, completedSections, hasProjectAndTemplate = false, disabled = false, sections = [] }: BRDProgressProps) => {
  const completedCount = completedSections.length;
  return <Card className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-[hsl(var(--heading-primary))]">
            BRD Progress
            <div className="w-8 h-1 bg-primary rounded"></div>
          </CardTitle>
          {hasProjectAndTemplate && sections.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {completedCount}/{sections.length} sections
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-3">
        {!hasProjectAndTemplate ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <div className="text-sm mb-2">Please select a project and BRD template to begin</div>
              <div className="text-xs">Use the dropdowns in the header to get started</div>
            </div>
          </div>
        ) : disabled ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <div className="text-sm mb-2">Please upload files to enable BRD Progress</div>
              <div className="text-xs">Upload and submit files to get started</div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pr-2">
            {sections.map(section => <div 
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