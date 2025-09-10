import { Search, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const confluencePages = [
  {
    title: "Architecture Overview",
    author: "Sarah Johnson",
    timestamp: "Jan 15, 4:00 PM",
    status: "Approved",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    title: "API Specifications - Payment Gateway Integration",
    author: "Michael Chen",
    timestamp: "Jan 12, 5:50 PM",
    status: "Under Review",
    statusColor: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "Security Requirements & Compliance Standards",
    author: "Jennifer Davis",
    timestamp: "Jan 10, 3:50 PM",
    status: "Published",
    statusColor: "bg-purple-100 text-purple-700",
  },
  {
    title: "Database Schema Design",
    author: "Robert Kim",
    timestamp: "Jan 8, 3:50 PM",
    status: "In Progress",
    statusColor: "bg-blue-100 text-blue-700",
  },
  {
    title: "Testing Strategy & Test Cases Documentation",
    author: "Lisa Wong",
    timestamp: "Jan 5, 3:50 PM",
    status: "Draft",
    statusColor: "bg-gray-100 text-gray-700",
  },
];

export const ConfluenceDashboard = () => {
  return (
    <div className="h-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button variant="outline" className="w-32 justify-between">
                Model
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Button variant="outline" className="w-48 justify-between">
                Payment Gateway
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Create New Project
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search pages"
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Payment Gateway Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Gateway</h2>
          <div className="space-y-3">
            {confluencePages.map((page, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground mb-2 flex items-center">
                        {page.title}
                        <ChevronDown className="ml-2 h-4 w-4 rotate-[-90deg]" />
                      </h3>
                      <Badge className={page.statusColor}>
                        {page.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">
                            {page.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{page.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/60"></div>
                        </div>
                        <span>{page.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};