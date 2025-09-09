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
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopHeader />
      </div>
      <div className="pt-16">
        <MainLayout
          onNavigate={handleNavigate}
          showBackButton={currentView === "brd"}
          onBack={handleBack}
        >
          {currentView === "overview" ? <ProjectOverview /> : <BRDDashboard />}
        </MainLayout>
      </div>
    </div>
  );
};

export default Index;
