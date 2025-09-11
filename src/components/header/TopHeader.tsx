import { ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <Select defaultValue="project">
          <SelectTrigger className="w-32 sm:w-48" style={{ backgroundColor: '#EDEDED' }}>
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="project">Select Project</SelectItem>
            <SelectItem value="payment-gateway">Payment Gateway</SelectItem>
            <SelectItem value="user-portal">User Portal</SelectItem>
          </SelectContent>
        </Select>
        
        {currentView === "brd" && (
          <Select defaultValue="create-update-brd">
            <SelectTrigger className="w-32 sm:w-40" style={{ backgroundColor: '#fff' }}>
              <SelectValue placeholder="BRD Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="create-update-brd">Create / Update BRD</SelectItem>
              <SelectItem value="existing-brd">Existing BRD</SelectItem>
              <SelectItem value="payment-gateway">Payment Gateway</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="lorem-ipsum">Lorem Ipsum</SelectItem>
              <SelectItem value="create-new-brd">Create new BRD</SelectItem>
              <SelectItem value="template-1">Template 1</SelectItem>
              <SelectItem value="template-2">Template 2</SelectItem>
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