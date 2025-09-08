import { 
  FileText, 
  BookOpen, 
  Ticket, 
  Palette, 
  Bell, 
  Settings, 
  HelpCircle,
  ChevronRight,
  ArrowLeft,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigationItems = [
  {
    icon: FileText,
    label: "BRD Assistant",
    description: "Create & manage BRDs",
    active: true,
    id: "brd",
  },
  {
    icon: BookOpen,
    label: "Confluence",
    description: "Browse & integrate docs",
    active: false,
    id: "confluence",
  },
  {
    icon: Ticket,
    label: "Jira",
    description: "Project tracking & issues",
    active: false,
    id: "jira",
  },
  {
    icon: Palette,
    label: "Design Assistant",
    description: "Technical architecture planning",
    active: false,
    id: "design",
  },
];

const bottomItems = [
  { icon: Bell, label: "Notifications" },
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Support" },
];

interface SidebarProps {
  onNavigate?: (view: string) => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const Sidebar = ({ onNavigate, showBackButton, onBack }: SidebarProps) => {
  const [isToolsExpanded, setIsToolsExpanded] = useState(true);

  return (
    <div className="w-60 h-screen bg-sidebar-bg border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <img 
            src="https://www.deluxe.com/etc.clientlibs/deluxe/clientlibs/clientlib-commons/resources/images/sprites/view/svg/sprite.view.svg#deluxe_logo_2020" 
            alt="Deluxe"
            className="h-6"
          />
          <div className="text-sm text-muted-foreground">SDLC Orchestration</div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="p-4 border-b border-sidebar-border">
        {showBackButton && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="w-full justify-start mb-3 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            TOOLS
          </Button>
        )}
        {!showBackButton && (
          <Button
            variant="ghost"
            onClick={() => setIsToolsExpanded(!isToolsExpanded)}
            className="w-full justify-between p-0 h-auto mb-3 text-muted-foreground hover:text-foreground"
          >
            <div className="text-xs font-medium uppercase tracking-wide">
              TOOLS
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isToolsExpanded ? 'rotate-0' : '-rotate-90'}`} />
          </Button>
        )}
        {isToolsExpanded && (
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => onNavigate?.(item.id)}
                className={`w-full justify-start h-auto p-3 text-left hover:bg-accent ${
                  item.active ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-start gap-3 w-full">
                  <item.icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="mt-auto p-4 space-y-1">
        {bottomItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start h-9 text-muted-foreground hover:bg-accent"
          >
            <item.icon className="w-4 h-4 mr-3" />
            {item.label}
          </Button>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-between h-auto p-3 hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="text-sm font-medium">Jane Doe</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};