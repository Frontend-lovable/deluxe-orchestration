import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const TopHeader = () => {
  return (
    <div className="h-16 border-b border-border bg-card px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Select defaultValue="model">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="model">Model</SelectItem>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="claude">Claude</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-4">
        <Select defaultValue="project">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="project">Select Project</SelectItem>
            <SelectItem value="payment-gateway">Payment Gateway</SelectItem>
            <SelectItem value="user-portal">User Portal</SelectItem>
          </SelectContent>
        </Select>
        
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Create New Project
        </Button>
      </div>
    </div>
  );
};