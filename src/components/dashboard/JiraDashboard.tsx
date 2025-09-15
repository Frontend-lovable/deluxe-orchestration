import { useState } from "react";
import { Search, ChevronDown, ArrowUp, User, Calendar, Link, FileText, Clock, ExternalLink, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const jiraIssues = [{
  id: "PAYEX-123",
  title: "Implement payment gateway integration",
  type: "Story",
  priority: "high",
  status: "In Progress",
  assignee: "Sarah Johnson",
  reporter: "Michael Chen",
  points: "8",
  created: "Jan 15, 4:00 PM",
  updated: "Jan 16, 6:00 PM",
  description: "As a user, I want to be able to process payments through multiple gateways so that I have flexibility in payment options.",
  sprint: "Sprint 24.1",
  labels: ["Payment", "Integration", "Backend"]
}, {
  id: "PAYEX-124",
  title: "Fix transaction timeout error",
  type: "Bug",
  priority: "high",
  status: "To-do",
  assignee: "David Martinez",
  reporter: "Jennifer Davis",
  points: "3",
  created: "Jan 14, 2:30 PM",
  updated: "Jan 15, 1:20 PM",
  description: "Transaction timeout errors occurring during peak usage hours need to be resolved.",
  sprint: "Sprint 24.1",
  labels: ["Bug", "Performance"]
}, {
  id: "PAYEX-125",
  title: "Update API documentation",
  type: "Task",
  priority: "medium",
  status: "Under Review",
  assignee: "Jennifer Davis",
  reporter: "Sarah Johnson",
  points: "2",
  created: "Jan 13, 11:00 AM",
  updated: "Jan 14, 3:45 PM",
  description: "API documentation needs to be updated to reflect recent changes in the payment gateway integration.",
  sprint: "Sprint 24.1",
  labels: ["Documentation", "API"]
}, {
  id: "PAYEX-126",
  title: "Payment Exchange Platform Epic",
  type: "Epic",
  priority: "high",
  status: "In Progress",
  assignee: "Sarah Johnson",
  reporter: "Michael Chen",
  points: "21",
  created: "Jan 10, 9:00 AM",
  updated: "Jan 16, 5:30 PM",
  description: "Epic for the complete Payment Exchange Platform development including all sub-tasks and stories.",
  sprint: "Sprint 24.1",
  labels: ["Epic", "Platform", "Payment"]
}];
export const JiraDashboard = () => {
  const [selectedIssue, setSelectedIssue] = useState(jiraIssues[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const getPriorityIcon = (priority: string) => {
    return priority === "high" ? <ArrowUp className="w-3 h-3 text-red-500" /> : <ArrowUp className="w-3 h-3 text-orange-500 rotate-45" />;
  };
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "In Progress": "bg-blue-100 text-blue-700",
      "To-do": "bg-gray-100 text-gray-700",
      "Under Review": "bg-yellow-100 text-yellow-700",
      "Done": "bg-green-100 text-green-700"
    };
    return statusConfig[status] || "bg-gray-100 text-gray-700";
  };
  const getTypeBadge = (type: string) => {
    const typeConfig = {
      "Story": "bg-green-100 text-green-700",
      "Bug": "bg-red-100 text-red-700",
      "Task": "bg-blue-100 text-blue-700",
      "Epic": "bg-purple-100 text-purple-700"
    };
    return typeConfig[type] || "bg-gray-100 text-gray-700";
  };
  return <div className="h-full bg-white">
      {/* Header */}
      

      <div className="flex h-[calc(100vh-140px)]">
        {/* Left Sidebar - Issues List */}
        <div className="w-96 p-6 flex flex-col bg-white h-full border rounded-md" style={{ borderColor: '#CCCCCC' }}>
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Search pages" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-10 pl-10 pr-4 border border-[#DEDCDC] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
            </div>
            
            <div className="flex gap-2">
              <Select defaultValue="all-status">
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">Status</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="to-do">To-do</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all-type">
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-type">Type</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Issues List */}
          <div className="flex-1 overflow-y-auto">
            <h3 className="font-semibold text-sm mb-4">Issues</h3>
            <div className="space-y-2">
              {jiraIssues.map(issue => <div key={issue.id} className={`p-3 border border-[#DEDCDC] rounded cursor-pointer hover:bg-gray-50 transition-colors ${selectedIssue.id === issue.id ? 'border-blue-500 bg-blue-50' : ''}`} onClick={() => setSelectedIssue(issue)}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">{issue.id}</span>
                    <Badge className={`${getTypeBadge(issue.type)} text-xs px-2 py-0`}>
                      {issue.type}
                    </Badge>
                    {getPriorityIcon(issue.priority)}
                  </div>
                  
                  <h4 className="font-medium text-sm text-foreground mb-2 line-clamp-2">
                    {issue.title}
                  </h4>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-xs">
                          {issue.assignee.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{issue.assignee}</span>
                      <span>• {issue.points} pts</span>
                    </div>
                    <Badge className={`${getStatusBadge(issue.status)} text-xs px-2 py-0`}>
                      {issue.status}
                    </Badge>
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        {/* Right Content - Issue Details */}
        <div className="flex-1 p-6 bg-white">
          {/* Issue Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="font-medium text-sm">{selectedIssue.id}</span>
              <Badge className={`${getTypeBadge(selectedIssue.type)} text-xs px-2 py-1`}>
                {selectedIssue.type}
              </Badge>
              <Badge className={`${getStatusBadge(selectedIssue.status)} text-xs px-2 py-1`}>
                {selectedIssue.status}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                View in Jira
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Code className="w-4 h-4" />
                Generate Code
              </Button>
            </div>
          </div>

          {/* Issue Title */}
          <h1 className="text-xl font-semibold mb-6">{selectedIssue.title}</h1>

          {/* Issue Metadata */}
          <div className="grid grid-cols-4 gap-6 mb-6 text-sm">
            <div>
              <span className="text-muted-foreground">Assignee:</span>
              <div className="font-medium">{selectedIssue.assignee}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Reporter:</span>
              <div className="font-medium">{selectedIssue.reporter}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <div className="font-medium">{selectedIssue.created}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Updated:</span>
              <div className="font-medium">{selectedIssue.updated}</div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-foreground leading-relaxed">{selectedIssue.description}</p>
          </div>

          {/* Issue Details Grid */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div>
              <span className="text-sm text-muted-foreground">Priority</span>
              <div className="flex items-center gap-1 mt-1">
                {getPriorityIcon(selectedIssue.priority)}
                <span className="text-sm font-medium capitalize">{selectedIssue.priority}</span>
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Story Points</span>
              <div className="text-sm font-medium mt-1">{selectedIssue.points}</div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Sprint</span>
              <div className="text-sm font-medium mt-1">{selectedIssue.sprint}</div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Labels</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedIssue.labels.map((label, index) => <Badge key={index} variant="secondary" className="text-xs">
                    {label}
                  </Badge>)}
              </div>
            </div>
          </div>

          {/* BRD Integration Actions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">BRD Integration Actions</h3>
            <p className="text-sm text-blue-700 mb-4">
              Create BRD from Issue<br />
              Generate a Business Requirements Document based on this Jira issue and its details.
            </p>
            <Button style={{
            backgroundColor: '#D61120'
          }} className="text-white hover:bg-red-700 mb-4">
              Generate BRD from Issue
            </Button>
            
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Link className="w-4 h-4" />
                Link to BRD
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="w-4 h-4" />
                Export Details
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Clock className="w-4 h-4" />
                Track Progress
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};