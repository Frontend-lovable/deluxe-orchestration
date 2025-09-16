import { ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { ProjectSelect } from "@/components/projects/ProjectSelect";

interface TopHeaderProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
  currentView?: string;
}

export const TopHeader = ({ onMenuClick, isMobile, currentView }: TopHeaderProps) => {
  return (
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
        <ProjectSelect 
          onProjectSelect={(projectId) => console.log('Selected project:', projectId)}
        />
        
        {currentView === "brd" && (
          <Select>
            <SelectTrigger className="w-32 sm:w-40 border-primary" style={{ backgroundColor: '#fff' }}>
              <SelectValue placeholder="Create / Update" />
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
                <SelectItem value="template-1">Template 1</SelectItem>
                <SelectItem value="template-2">Template 2</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-3 sm:px-4">
          <span className="hidden sm:inline">Create New Project</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>
    </div>
  );
};