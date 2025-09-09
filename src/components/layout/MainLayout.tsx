import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "@/components/header/TopHeader";

interface MainLayoutProps {
  children: ReactNode;
  onNavigate?: (view: string) => void;
  showBackButton?: boolean;
  onBack?: () => void;
  currentView?: string;
}

export const MainLayout = ({ children, onNavigate, showBackButton, onBack, currentView }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile overlay backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 bottom-0 z-40 transform transition-transform duration-300
        lg:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar 
          onNavigate={onNavigate}
          showBackButton={showBackButton}
          onBack={onBack}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentView={currentView}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
      </div>
      
      {/* Main content */}
      <div className={`
        flex-1 overflow-auto transition-all duration-300
        lg:${sidebarCollapsed ? 'ml-16' : 'ml-60'}
        ml-0
      `}>
        {/* Header */}
        <div className={`
          fixed top-0 right-0 z-50 transition-all duration-300
          lg:left-${sidebarCollapsed ? '16' : '60'}
          left-0
        `}>
          <TopHeader 
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            mobileMenuOpen={mobileMenuOpen}
          />
        </div>
        
        {/* Content */}
        <div className="pt-16">
          {children}
        </div>
      </div>
    </div>
  );
};