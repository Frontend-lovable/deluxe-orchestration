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
  ChevronDown,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigationItems = [
  {
    icon: FileText,
    label: "BRD Assistant",
    description: "Create & manage BRDs",
    id: "brd",
  },
  {
    icon: BookOpen,
    label: "Confluence",
    description: "Browse & integrate docs",
    id: "confluence",
  },
  {
    icon: Ticket,
    label: "Jira",
    description: "Project tracking & issues",
    id: "jira",
  },
  {
    icon: Palette,
    label: "Design Assistant",
    description: "Technical architecture planning",
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
  currentView?: string;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar = ({ onNavigate, showBackButton, onBack, collapsed, onToggleCollapse, currentView, isMobile, onMobileClose }: SidebarProps) => {
  return (
    <div className={`${isMobile ? 'w-60' : (collapsed ? 'w-16' : 'w-60')} h-full bg-sidebar-bg border-r border-sidebar-border flex flex-col transition-all duration-300 overflow-hidden`}>
      {/* Header */}
      <div className="py-0 border-b border-sidebar-border h-16 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: 'rgba(230, 12, 35, 0.06)' }}>
        <div className="flex items-center gap-2 px-4">
          {(!collapsed || isMobile) && (
            <>
              <img 
                src="https://www.deluxe.com/etc.clientlibs/deluxe/clientlibs/clientlib-commons/resources/images/sprites/view/svg/sprite.view.svg#deluxe_logo_2020" 
                alt="Deluxe"
                className="w-[65px]"
              />
              <div className="text-sm text-muted-foreground hidden sm:block">SDLC Orchestration</div>
            </>
          )}
        </div>
        
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileClose}
            className="mr-4"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
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
              className={`w-full ${collapsed ? 'justify-center' : 'justify-between'} p-0 h-auto mb-3 text-muted-foreground hover:text-foreground hover:bg-transparent`}
            >
              {!collapsed && (
                <div className="text-xs font-medium uppercase tracking-wide">
                  TOOLS
                </div>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-90' : 'rotate-0'}`} />
            </Button>
          )}
          {(!collapsed || isMobile) && (
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <Button
                    key={item.label}
                    variant="ghost"
                    onClick={() => onNavigate?.(item.id)}
                    className={`w-full justify-start h-auto p-3 text-left hover:bg-accent`}
                    style={isActive ? { backgroundColor: 'rgba(184, 218, 222, 0.34)' } : {}}
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
                );
              })}
            </div>
          )}
          {collapsed && !isMobile && (
            <div className="space-y-2 mt-3">
              {navigationItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <Button
                    key={item.label}
                    variant="ghost"
                    onClick={() => onNavigate?.(item.id)}
                    className={`w-full h-10 p-0 justify-center hover:bg-accent`}
                    style={isActive ? { backgroundColor: 'rgba(184, 218, 222, 0.34)' } : {}}
                    title={item.label}
                  >
                    <item.icon className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="p-4 space-y-1">
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
      </div>

      {/* User Profile - Fixed at bottom */}
      <div className="p-4 border-t border-sidebar-border flex-shrink-0">
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