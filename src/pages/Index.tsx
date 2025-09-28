import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProjectOverview } from "@/components/dashboard/ProjectOverview";
import { BRDDashboard } from "@/components/dashboard/BRDDashboard";
import { ConfluenceDashboard } from "@/components/dashboard/ConfluenceDashboard";
import { JiraDashboard } from "@/components/dashboard/JiraDashboard";
import { DesignDashboard } from "@/components/dashboard/DesignDashboard";
import { type Project } from "@/services/projectApi";

const Index = () => {
  const [currentView, setCurrentView] = useState<"overview" | "brd" | "confluence" | "jira" | "design">("overview");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [createBRDTrigger, setCreateBRDTrigger] = useState<number>(0);

  const handleNavigate = (view: string) => {
    setCurrentView(view as "overview" | "brd" | "confluence" | "jira" | "design");
  };

  const handleCreateBRD = () => {
    // Trigger BRD creation by incrementing the trigger counter
    setCreateBRDTrigger(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentView("overview");
  };

  const renderContent = () => {
    switch (currentView) {
      case "brd":
        return <BRDDashboard onBack={handleBack} selectedProject={selectedProject} createBRDTrigger={createBRDTrigger} />;
      case "confluence":
        return <ConfluenceDashboard />;
      case "jira":
        return <JiraDashboard />;
      case "design":
        return <DesignDashboard />;
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
        selectedProject={selectedProject}
        onProjectSelect={setSelectedProject}
        onCreateBRD={handleCreateBRD}
      >
        {renderContent()}
      </MainLayout>
    </div>
  );
};

export default Index;
