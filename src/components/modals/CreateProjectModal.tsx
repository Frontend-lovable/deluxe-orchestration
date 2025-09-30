import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronRight, Check, ChevronsUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createProject, type CreateProjectRequest, getBRDTemplates, type BRDTemplate, fetchProjects, type Project } from "@/services/projectApi";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const createProjectSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  brd_template: z.string().optional(),
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateProjectModal = ({ open, onOpenChange }: CreateProjectModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"my-project" | "new-project">("new-project");
  const [brdTemplates, setBrdTemplates] = useState<BRDTemplate[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [projectOpen, setProjectOpen] = useState(false);

  // Fetch projects from API
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    enabled: open && activeTab === "my-project",
  });
  
  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      project_name: "",
      brd_template: "",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project created successfully!",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating project:", error);
    },
  });

  const onSubmit = (data: CreateProjectFormData) => {
    const projectData: CreateProjectRequest = {
      project_name: data.project_name,
      description: data.brd_template || "",
      jira_project_key: data.project_name.substring(0, 3).toUpperCase(),
      confluence_space_key: data.project_name.substring(0, 3).toUpperCase(),
    };
    
    createProjectMutation.mutate(projectData);
  };

  // Load BRD templates when modal opens
  useEffect(() => {
    if (open) {
      getBRDTemplates().then(setBrdTemplates).catch(console.error);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px] bg-white border-0 p-0">
        {/* Tabs Header */}
        <div className="flex border-b">
          <button
            type="button"
            onClick={() => setActiveTab("my-project")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "my-project"
                ? "text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={activeTab === "my-project" ? { backgroundColor: '#D61120', color: '#fff' } : { color: '#858585' }}
          >
            My Project
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("new-project")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "new-project"
                ? "text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={activeTab === "new-project" ? { backgroundColor: '#D61120', color: '#fff' } : { color: '#858585' }}
          >
            New Project
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "my-project" ? (
            <div className="space-y-4">
              <Popover open={projectOpen} onOpenChange={setProjectOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={projectOpen}
                    className="w-full justify-between bg-white border-border h-10"
                  >
                    {selectedProject
                      ? projects.find((project) => project.project_id === selectedProject)?.project_name
                      : "Select Project"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-white" align="start">
                  <Command>
                    <CommandInput placeholder="Search project..." />
                    <CommandList>
                      <CommandEmpty>No project found.</CommandEmpty>
                      <CommandGroup>
                        {projects.map((project) => (
                          <CommandItem
                            key={project.project_id}
                            value={project.project_name}
                            onSelect={() => {
                              setSelectedProject(project.project_id);
                              setProjectOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedProject === project.project_id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {project.project_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedProject && (
                <>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1"
                      style={{ 
                        backgroundColor: 'rgba(214, 17, 32, 0.15)', 
                        color: '#D61120',
                        fontWeight: 'normal'
                      }}
                    >
                      Existing BRD
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-border"
                      style={{ color: '#3B3B3B' }}
                    >
                      Create new BRD
                    </Button>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="px-3 py-2 bg-gray-50 rounded text-sm" style={{ color: '#3B3B3B' }}>
                      BRD 1
                    </div>
                    <div className="px-3 py-2 bg-gray-50 rounded text-sm" style={{ color: '#3B3B3B' }}>
                      BRD 2
                    </div>
                    <div className="px-3 py-2 bg-gray-50 rounded text-sm" style={{ color: '#3B3B3B' }}>
                      Lorium Ipsum
                    </div>
                    <div className="px-3 py-2 bg-gray-50 rounded text-sm" style={{ color: '#3B3B3B' }}>
                      Lorium Ipsum
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-sm"
                      style={{ color: '#D61120', fontWeight: 'normal' }}
                    >
                      Open Project
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="project_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter Project Name"
                          className="bg-white border-border h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="brd_template"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-border h-10">
                            <SelectValue placeholder="Select BRD Template" />
                            <ChevronRight className="h-4 w-4 opacity-50" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          {brdTemplates.map((template) => (
                            <SelectItem key={template.template_id} value={template.template_id}>
                              {template.template_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end pt-8">
                  <Button
                    type="submit"
                    disabled={createProjectMutation.isPending}
                    className="text-sm"
                    style={{ 
                      color: '#D61120',
                      fontWeight: 'normal'
                    }}
                    variant="ghost"
                  >
                    {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};