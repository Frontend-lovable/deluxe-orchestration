import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface ProjectSelectProps {
  onProjectSelect?: (projectId: string) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

export const ProjectSelect = ({ 
  onProjectSelect, 
  className = "w-32 sm:w-48", 
  style = { backgroundColor: '#EDEDED' },
  placeholder = "Select Project"
}: ProjectSelectProps) => {
  const { projects, isLoading, error } = useProjects();
  const [selectedProject, setSelectedProject] = useState<string>("");

  const handleValueChange = (value: string) => {
    setSelectedProject(value);
    onProjectSelect?.(value);
  };

  if (isLoading) {
    return (
      <div className={`${className} h-10 flex items-center justify-center rounded-md border border-input bg-background px-3`} style={style}>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} h-10 flex items-center justify-center rounded-md border border-destructive bg-background px-3`} style={style}>
        <span className="text-sm text-destructive">Error loading projects</span>
      </div>
    );
  }

  return (
    <Select value={selectedProject} onValueChange={handleValueChange}>
      <SelectTrigger className={className} style={style}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {projects.length === 0 ? (
          <SelectItem value="no-projects" disabled>
            No projects available
          </SelectItem>
        ) : (
          projects.map((project) => (
            <SelectItem key={project.project_id} value={project.project_id}>
              {project.project_name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};