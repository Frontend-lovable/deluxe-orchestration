import { StatsCards } from "./StatsCards";
import { ChatInterface } from "../chat/ChatInterface";

export const ProjectOverview = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#fff' }}>
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Project Overview</h1>
      </div>
      
      <StatsCards />
      
      <div className="grid grid-cols-1 gap-6 lg:gap-8">
        <div className="w-full">
          <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">SDLC Orchestration Assistant</h2>
              <p className="text-sm text-muted-foreground">
                Your AI guide for software development lifecycle management
              </p>
            </div>
            
            <div className="h-80 sm:h-96">
              <ChatInterface
                title="SDLC Orchestration Assistant"
                subtitle="Your AI guide for software development lifecycle management"
                initialMessage="Hello! 👋 I'm your SDLC Orchestration Assistant. I'm here to help you navigate through your software development lifecycle workflow.

What would you like to work on today?"
                placeholder="Type your message about business requirements..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};