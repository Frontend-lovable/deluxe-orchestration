import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProjectOverview } from "@/components/dashboard/ProjectOverview";
import { BRDDashboard } from "@/components/dashboard/BRDDashboard";
import { ConfluenceDashboard } from "@/components/dashboard/ConfluenceDashboard";
import { JiraDashboard } from "@/components/dashboard/JiraDashboard";
import { DesignDashboard } from "@/components/dashboard/DesignDashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<"overview" | "brd" | "confluence" | "jira" | "design">("overview");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedBrdTemplate, setSelectedBrdTemplate] = useState("");

  const handleNavigate = (view: string) => {
    setCurrentView(view as "overview" | "brd" | "confluence" | "jira" | "design");
  };

  const handleBack = () => {
    setCurrentView("overview");
  };

  const renderContent = () => {
    switch (currentView) {
      case "brd":
        return <BRDDashboard onBack={handleBack} selectedProject={selectedProject} selectedBrdTemplate={selectedBrdTemplate} />;
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
        onProjectSelect={setSelectedProject}
        onBrdTemplateSelect={setSelectedBrdTemplate}
      >
        {renderContent()}
      </MainLayout>
    </div>
  );
};

export default Index;
