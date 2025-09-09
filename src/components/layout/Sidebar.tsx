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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar = ({ onNavigate, showBackButton, onBack, collapsed, onToggleCollapse }: SidebarProps) => {
  return (
    <div className={`${collapsed ? 'w-16' : 'w-60'} h-full bg-sidebar-bg border-r border-sidebar-border flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="px-8 py-0 border-b border-sidebar-border h-16 flex items-center" style={{ backgroundColor: '#E60C23' }}>
        <div className="flex items-center gap-2">
          {!collapsed && (
            <>
              <img 
                src="https://www.deluxe.com/etc.clientlibs/deluxe/clientlibs/clientlib-commons/resources/images/sprites/view/svg/sprite.view.svg#deluxe_logo_2020" 
                alt="Deluxe"
                className="h-6 filter brightness-0 invert"
              />
              <div className="text-sm text-white">SDLC Orchestration</div>
            </>
          )}
          {collapsed && (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">D</span>
              </div>
            </div>
          )}
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
            {!collapsed && "TOOLS"}
          </Button>
        )}
        {!showBackButton && (
          <Button
            variant="ghost"
            onClick={onToggleCollapse}
            className={`w-full ${collapsed ? 'justify-center' : 'justify-between'} p-0 h-auto mb-3 text-muted-foreground hover:text-foreground`}
          >
            {!collapsed && (
              <div className="text-xs font-medium uppercase tracking-wide">
                TOOLS
              </div>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-90' : 'rotate-0'}`} />
          </Button>
        )}
        {!collapsed && (
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
        {collapsed && (
          <div className="space-y-2 mt-3">
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => onNavigate?.(item.id)}
                className={`w-full h-10 p-0 justify-center hover:bg-accent ${
                  item.active ? 'bg-accent' : ''
                }`}
                title={item.label}
              >
                <item.icon className="w-4 h-4" />
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
            className={`w-full ${collapsed ? 'justify-center p-0 h-10' : 'justify-start h-9'} text-muted-foreground hover:bg-accent`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className={`w-4 h-4 ${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && item.label}
          </Button>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={`w-full ${collapsed ? 'justify-center p-3' : 'justify-between'} h-auto hover:bg-accent`}
        >
          {collapsed ? (
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          ) : (
            <>
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
            </>
          )}
        </Button>
      </div>
    </div>
  );
};