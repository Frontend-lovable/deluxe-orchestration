import { Search, ChevronDown, User, FileText, Users } from "lucide-react";
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
      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Left Column - Search and Payment Gateway */}
          <div className="col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>
            </div>

            {/* Pages in Payment Exchange */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-medium">Pages in Payment Exchange</h2>
                <span className="text-sm text-muted-foreground">6 pages</span>
              </div>
              <div className="space-y-3">
                {confluencePages.map((page, index) => (
                  <Card key={index} className="p-3 hover:shadow-md transition-shadow cursor-pointer border border-border">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-foreground text-sm leading-tight">
                          {page.title}
                        </h3>
                        <Badge className={`${page.statusColor} text-xs px-2 py-1`}>
                          {page.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-xs">
                              {page.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{page.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"></div>
                          </div>
                          <span>{page.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Select Confluence Page */}
          <div className="col-span-9 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                  <FileText className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">
                  Select a Confluence Page
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Choose a page from the Payment Exchange space to view its details and create Jira tasks.
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>6 pages available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Team collaboration ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};