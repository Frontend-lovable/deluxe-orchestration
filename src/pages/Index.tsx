import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProjectOverview } from "@/components/dashboard/ProjectOverview";
import { BRDDashboard } from "@/components/dashboard/BRDDashboard";
import { ConfluenceDashboard } from "@/components/dashboard/ConfluenceDashboard";
import { JiraDashboard } from "@/components/dashboard/JiraDashboard";
import { DesignDashboard } from "@/components/dashboard/DesignDashboard";
import { ProjectsList } from "@/components/projects/ProjectsList";

const Index = () => {
  const [currentView, setCurrentView] = useState<"overview" | "brd" | "confluence" | "jira" | "design" | "projects">("overview");

  const handleNavigate = (view: string) => {
    setCurrentView(view as "overview" | "brd" | "confluence" | "jira" | "design" | "projects");
  };

  const handleBack = () => {
    setCurrentView("overview");
  };

  const renderContent = () => {
    switch (currentView) {
      case "brd":
        return <BRDDashboard onBack={handleBack} />;
      case "confluence":
        return <ConfluenceDashboard />;
      case "jira":
        return <JiraDashboard />;
      case "design":
        return <DesignDashboard />;
      case "projects":
        return (
          <div className="p-2 sm:p-4 md:p-6 lg:p-8">
            <div className="mb-4 lg:mb-8">
              <h1 className="text-base font-bold mb-2" style={{ color: '#3B3B3B' }}>Projects Dashboard</h1>
              <p className="text-xs" style={{ color: '#727272', fontSize: '12px' }}>
                Manage and view all your projects with real-time data from mock API
              </p>
            </div>
            <ProjectsList />
          </div>
        );
      default:
        return <ProjectOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainLayout
        onNavigate={handleNavigate}
        showBackButton={currentView !== "overview"}
        onBack={handleBack}
        currentView={currentView}
      >
        {renderContent()}
      </MainLayout>
    </div>
  );
};

export default Index;
