import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { TopHeader } from "@/components/header/TopHeader";
import { ProjectOverview } from "@/components/dashboard/ProjectOverview";
import { BRDDashboard } from "@/components/dashboard/BRDDashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<"overview" | "brd">("overview");

  const handleNavigate = (view: string) => {
    if (view === "brd") {
      setCurrentView("brd");
    } else {
      setCurrentView("overview");
    }
  };

  const handleBack = () => {
    setCurrentView("overview");
  };

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      <MainLayout
        onNavigate={handleNavigate}
        showBackButton={currentView === "brd"}
        onBack={handleBack}
      >
        {currentView === "overview" ? <ProjectOverview /> : <BRDDashboard />}
      </MainLayout>
    </div>
  );
};

export default Index;
