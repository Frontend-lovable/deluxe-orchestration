import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TopHeaderProps {
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

export const TopHeader = ({ onMobileMenuToggle, mobileMenuOpen }: TopHeaderProps) => {
  return (
    <div className="h-16 border-b border-border px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full" style={{ backgroundColor: '#fff' }}>
      {/* Mobile menu button */}
      <div className="flex items-center gap-2 lg:gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        
        <Select defaultValue="model">
          <SelectTrigger className="w-20 sm:w-24 lg:w-32">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="model">Model</SelectItem>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="claude">Claude</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        <Select defaultValue="project">
          <SelectTrigger className="w-32 sm:w-40 lg:w-48" style={{ backgroundColor: '#EDEDED' }}>
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="project">Select Project</SelectItem>
            <SelectItem value="payment-gateway">Payment Gateway</SelectItem>
            <SelectItem value="user-portal">User Portal</SelectItem>
          </SelectContent>
        </Select>
        
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm px-2 sm:px-4">
          <span className="hidden sm:inline">Create New Project</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>
    </div>
  );
};