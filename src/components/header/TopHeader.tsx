import { useState, useEffect } from "react";
import { ChevronDown, Menu, FolderKanban } from "lucide-react";
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
import { fetchProjects, getProjectById, getBRDTemplates, type Project, type BRDTemplate } from "@/services/projectApi";
import { useToast } from "@/hooks/use-toast";

interface TopHeaderProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
  currentView?: string;
  onProjectSelect?: (project: Project | null) => void;
  onBRDTemplateSelect?: (template: string | null) => void;
}

export const TopHeader = ({ onMenuClick, isMobile, currentView, onProjectSelect, onBRDTemplateSelect }: TopHeaderProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [brdTemplates, setBrdTemplates] = useState<BRDTemplate[]>([]);
  const [selectedBRDTemplate, setSelectedBRDTemplate] = useState<string | null>(null);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
    if (currentView === "brd") {
      loadBRDTemplates();
    }
  }, [currentView]);

  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const projectsData = await fetchProjects();
      setProjects(projectsData);
      console.log("Projects loaded:", projectsData);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const loadBRDTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const templates = await getBRDTemplates();
      setBrdTemplates(templates);
    } catch (error) {
      console.error("Failed to load BRD templates:", error);
      toast({
        title: "Error",
        description: "Failed to load BRD templates",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleProjectSelect = async (projectId: string) => {
    try {
      const project = await getProjectById(projectId);
      setSelectedProject(project);
      onProjectSelect?.(project);
    } catch (error) {
      toast({
        title: "Error",
        description: "Project not found",
        variant: "destructive",
      });
      onProjectSelect?.(null);
    }
  };

  const handleBRDTemplateSelect = (value: string) => {
    setSelectedBRDTemplate(value);
    onBRDTemplateSelect?.(value);
  };

  return (
    <>
      <CreateProjectModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen}
        projects={projects}
        isLoadingProjects={isLoadingProjects}
        onProjectCreated={loadProjects}
        onProjectSelected={handleProjectSelect}
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
      
      <div className="flex items-center gap-2 sm:gap-4">
        {currentView === "brd" && (
          <Select onValueChange={handleBRDTemplateSelect}>
            <SelectTrigger className="w-32 sm:w-40 border-primary" style={{ backgroundColor: '#fff' }}>
              <SelectValue placeholder={isLoadingTemplates ? "Loading..." : "Create / Update"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Existing BRD</SelectLabel>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="lorem-ipsum">Lorem Ipsum</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Create new BRD</SelectLabel>
                {brdTemplates.length > 0 ? (
                  brdTemplates.map((template) => (
                    <SelectItem key={template.template_id} value={template.template_id}>
                      {template.template_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-templates" disabled>
                    {isLoadingTemplates ? "Loading templates..." : "No templates available"}
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-3 sm:px-4 flex items-center gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <FolderKanban size={16} />
          <span className="hidden sm:inline">{selectedProject?.project_name || "Project Workspace"}</span>
          <span className="sm:hidden">{selectedProject?.project_name || "Workspace"}</span>
        </Button>
      </div>
    </div>
    </>
  );
};