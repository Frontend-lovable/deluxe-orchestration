import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProjectOverview } from "@/components/dashboard/ProjectOverview";
import { BRDDashboard } from "@/components/dashboard/BRDDashboard";
import { ConfluenceDashboard } from "@/components/dashboard/ConfluenceDashboard";
import { JiraDashboard } from "@/components/dashboard/JiraDashboard";
import { DesignDashboard } from "@/components/dashboard/DesignDashboard";
import { type Project } from "@/services/projectApi";

interface ChatMessageType {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: string;
  isTyping?: boolean;
  isLoading?: boolean;
}

type ViewMessages = {
  overview: ChatMessageType[];
  brd: ChatMessageType[];
  confluence: ChatMessageType[];
  jira: ChatMessageType[];
  design: ChatMessageType[];
};

const Index = () => {
  const [currentView, setCurrentView] = useState<"overview" | "brd" | "confluence" | "jira" | "design">("overview");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedBRDTemplate, setSelectedBRDTemplate] = useState<string | null>(null);
  const [viewMessages, setViewMessages] = useState<ViewMessages>({
    overview: [],
    brd: [],
    confluence: [],
    jira: [],
    design: []
  });

  const handleNavigate = (view: string) => {
    setCurrentView(view as "overview" | "brd" | "confluence" | "jira" | "design");
  };

  const handleBack = () => {
    setCurrentView("overview");
  };

  const handleMessagesChange = (view: keyof ViewMessages, messages: ChatMessageType[]) => {
    setViewMessages(prev => ({
      ...prev,
      [view]: messages
    }));
  };

  const renderContent = () => {
    switch (currentView) {
      case "brd":
        return <BRDDashboard 
          onBack={handleBack} 
          selectedProject={selectedProject} 
          selectedBRDTemplate={selectedBRDTemplate}
          messages={viewMessages.brd}
          onMessagesChange={(messages) => handleMessagesChange("brd", messages)}
        />;
      case "confluence":
        return <ConfluenceDashboard 
          messages={viewMessages.confluence}
          onMessagesChange={(messages) => handleMessagesChange("confluence", messages)}
        />;
      case "jira":
        return <JiraDashboard 
          messages={viewMessages.jira}
          onMessagesChange={(messages) => handleMessagesChange("jira", messages)}
        />;
      case "design":
        return <DesignDashboard 
          messages={viewMessages.design}
          onMessagesChange={(messages) => handleMessagesChange("design", messages)}
        />;
      default:
        return <ProjectOverview 
          messages={viewMessages.overview}
          onMessagesChange={(messages) => handleMessagesChange("overview", messages)}
        />;
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
      >
        {renderContent()}
      </MainLayout>
    </div>
  );
};

export default Index;
