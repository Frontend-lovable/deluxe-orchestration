import { ChatInterface } from "../chat/ChatInterface";
import { StatsCards } from "./StatsCards";

export const JiraDashboard = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#fff' }}>
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Jira Integration</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Project tracking and issue management</p>
      </div>
      
      <StatsCards />
      
      <div className="grid grid-cols-1 gap-6 lg:gap-8 mt-6 lg:mt-8">
        <div className="w-full">
          <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Jira Assistant</h2>
              <p className="text-sm text-muted-foreground">
                Manage your Jira projects, issues, and sprint planning
              </p>
            </div>
            
            <div className="h-80 sm:h-96">
              <ChatInterface
                title="Jira Assistant"
                subtitle="Project tracking and issue management"
                initialMessage="Hello! 👋 I'm your Jira Assistant. I can help you manage projects, track issues, plan sprints, and analyze your development workflow.

What would you like to work on today?"
                placeholder="Ask about Jira issues, sprints, or projects..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};