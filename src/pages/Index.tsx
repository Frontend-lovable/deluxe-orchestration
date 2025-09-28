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
  const [selectedBRDTemplate, setSelectedBRDTemplate] = useState<string | null>(null);

  const handleNavigate = (view: string) => {
    setCurrentView(view as "overview" | "brd" | "confluence" | "jira" | "design");
  };

  const handleCreateBRD = () => {
    // This will be handled by the BRDDashboard component
    console.log("Create BRD clicked from header");
  };

  const handleBack = () => {
    setCurrentView("overview");
  };

  const renderContent = () => {
    switch (currentView) {
      case "brd":
        return <BRDDashboard onBack={handleBack} selectedProject={selectedProject} selectedBRDTemplate={selectedBRDTemplate} />;
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
        selectedBRDTemplate={selectedBRDTemplate}
        onProjectSelect={setSelectedProject}
        onBRDTemplateSelect={setSelectedBRDTemplate}
        onCreateBRD={handleCreateBRD}
      >
        {renderContent()}
      </MainLayout>
    </div>
  );
};

export default Index;
