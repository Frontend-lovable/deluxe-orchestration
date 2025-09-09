import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "@/components/header/TopHeader";

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
      <div className="fixed left-0 top-0 bottom-0 z-40">
        <Sidebar 
          onNavigate={onNavigate}
          showBackButton={showBackButton}
          onBack={onBack}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      <div className={`flex-1 overflow-auto ${sidebarCollapsed ? 'ml-16' : 'ml-60'} transition-all duration-300`}>
        <div className="fixed top-0 right-0 z-50" style={{ left: sidebarCollapsed ? '64px' : '240px' }}>
          <TopHeader />
        </div>
        <div className="pt-16">
          {children}
        </div>
      </div>
    </div>
  );
};