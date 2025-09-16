import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, AlertCircle, CheckCircle, Database } from 'lucide-react';
import { Project } from '@/types/api';

export const ProjectsList = () => {
  const { 
    projects, 
    isLoading, 
    error, 
    total, 
    lastUpdated, 
    refresh, 
    isRefetching 
  } = useProjects();

  const handleProjectClick = (project: Project) => {
    console.log('Selected project:', project);
    // You can add navigation or modal logic here
  };

  const formatLastUpdated = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl font-bold">Projects Dashboard</CardTitle>
            </div>
            <Button
              onClick={refresh}
              disabled={isLoading || isRefetching}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${(isLoading || isRefetching) ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Total Projects: {total}</span>
            <span>Last Updated: {formatLastUpdated(lastUpdated)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              onClick={refresh}
              variant="outline"
              size="sm"
              className="ml-4"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {!isLoading && !error && projects.length > 0 && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            Successfully loaded {projects.length} projects from mock API
          </AlertDescription>
        </Alert>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Projects Grid */}
      {!isLoading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.project_id}
              project={project}
              onClick={handleProjectClick}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && projects.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
            <p className="text-muted-foreground mb-4">
              No projects are available at the moment. Try refreshing to load data.
            </p>
            <Button onClick={refresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      )}

      {/* API Status Footer */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Mock API Status: Active</span>
            </div>
            <div className="text-muted-foreground">
              Simulating real API with {Math.floor(Math.random() * 500 + 200)}ms latency
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};