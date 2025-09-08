import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  children: ReactNode;
  onNavigate?: (view: string) => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const MainLayout = ({ children, onNavigate, showBackButton, onBack }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        onNavigate={onNavigate}
        showBackButton={showBackButton}
        onBack={onBack}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};