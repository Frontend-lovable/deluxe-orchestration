import { useState, useEffect } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateProjectModal } from "@/components/modals/CreateProjectModal";
import { type Project } from "@/services/projectApi";
import { useToast } from "@/hooks/use-toast";

interface TopHeaderProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
  currentView?: string;
  onProjectSelect?: (project: Project | null) => void;
  
  onCreateBRD?: () => void;
}

export const TopHeader = ({ onMenuClick, isMobile, currentView, onProjectSelect, onCreateBRD }: TopHeaderProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, [currentView]);

  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      // Mock data instead of API call to prevent CORS errors
      const mockProjects: Project[] = [
        {
          project_id: "proj-001",
          project_name: "SDLC Orchestration Tool",
          description: "A tool for managing software development lifecycle",
          jira_project_key: "SOT",
          confluence_space_key: "SO",
          created_at: new Date().toISOString()
        }
      ];
      setProjects(mockProjects);
      console.log("Projects loaded:", mockProjects);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setIsLoadingProjects(false);
    }
  };


  const handleProjectSelect = async (projectId: string) => {
    try {
      const project = projects.find(p => p.project_id === projectId);
      if (project) {
        setSelectedProject(project);
        onProjectSelect?.(project);
      } else {
        throw new Error("Project not found");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Project not found",
        variant: "destructive",
      });
      onProjectSelect?.(null);
    }
  };


  return (
    <>
      <CreateProjectModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
      />
    <div className="h-16 border-b border-border px-4 sm:px-6 lg:px-8 flex items-center justify-between" style={{ backgroundColor: '#fff' }}>
      <div className="flex items-center gap-4">
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-4 h-4" />
          </Button>
        )}
        
        <Select defaultValue="model">
          <SelectTrigger className="w-24 sm:w-32" style={{ backgroundColor: '#fff' }}>
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="model">Model</SelectItem>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="claude">Claude</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className={`flex items-center ${
        (isLoadingProjects || projects.length > 0 || !["confluence", "jira", "design", "brd"].includes(currentView || "")) 
          ? "gap-2 sm:gap-4" 
          : ""
      }`}>
        {isLoadingProjects ? (
          <Skeleton className="w-32 sm:w-48 h-10" />
        ) : projects.length > 0 && (
          <Select onValueChange={handleProjectSelect}>
            <SelectTrigger className="w-32 sm:w-48" style={{ backgroundColor: '#EDEDED' }}>
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.project_id} value={project.project_id}>
                  <div>
                    <div className="font-medium">{project.project_name}</div>
                    <div className="text-xs text-muted-foreground">{project.project_id}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {currentView === "brd" && (
          <Button 
            variant="outline" 
            className="h-10 px-3 sm:px-4"
            style={{ borderColor: '#D61120', color: '#D61120' }}
            onClick={onCreateBRD}
          >
            <span>Create BRD</span>
          </Button>
        )}
        
        
        {!["confluence", "jira", "design", "brd"].includes(currentView || "") && (
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-3 sm:px-4"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <span className="hidden sm:inline">Create New Project</span>
            <span className="sm:hidden">Create</span>
          </Button>
        )}
      </div>
    </div>
    </>
  );
};