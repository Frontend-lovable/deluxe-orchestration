import { Project } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FolderOpen } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/20"
      onClick={() => onClick?.(project)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            {project.project_name}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {project.project_id}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Created: {formatDate(project.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  );
};