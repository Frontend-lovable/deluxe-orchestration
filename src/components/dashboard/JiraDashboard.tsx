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
      <div className="p-2 sm:p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="w-full lg:w-80 xl:w-96">
            <div className="border border-[#CCCCCC] rounded-md">
              <div className="p-4 sm:p-6 flex flex-col bg-white h-full rounded-md">
          {/* Search and Filters */}
          <div className="space-y-4 mb-4 sm:mb-6">
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
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium" style={{
                          color: '#6C6C6C',
                          fontSize: '12px'
                        }}>{issue.id}</span>
                      <Badge className={`${getTypeBadge(issue.type)} text-xs px-2 py-0`}>
                        {issue.type}
                      </Badge>
                    </div>
                    {getPriorityIcon(issue.priority)}
                  </div>
                  
                  <h4 className="font-medium mb-2 line-clamp-2" style={{
                      fontSize: '16px',
                      color: '#3B3B3B',
                      fontWeight: 'medium'
                    }}>
                    {issue.title}
                  </h4>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 min-w-0 flex-1" style={{
                        color: '#747474'
                      }}>
                      <Avatar className="h-4 w-4 flex-shrink-0">
                        <AvatarFallback className="text-xs">
                          {issue.assignee.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{issue.assignee}</span>
                      <span className="flex-shrink-0">• {issue.points} pts</span>
                    </div>
                    <Badge className={`${getStatusBadge(issue.status)} text-xs px-2 py-0 flex-shrink-0 ml-2`}>
                      {issue.status}
                    </Badge>
                  </div>
                </div>)}
            </div>
            </div>
            </div>
          </div>
        </div>

        {/* Main Content - Issue Details */}
        <div className="flex-1 bg-white rounded-md">
          {/* Wrapped Issue Details */}
          <div className="rounded-md border border-[#CCCCCC] pt-4 sm:pt-6 px-4 sm:px-6 pb-[10px] mb-4 sm:mb-6">
            {/* Issue Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-4 gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-medium text-sm">{selectedIssue.id}</span>
                <Badge className={`${getTypeBadge(selectedIssue.type)} text-xs px-2 py-1`}>
                  {selectedIssue.type}
                </Badge>
                <Badge className={`${getStatusBadge(selectedIssue.status)} text-xs px-2 py-1`}>
                  {selectedIssue.status}
                </Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" size="sm" className="gap-2 text-sm font-normal">
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">View in Jira</span>
                  <span className="sm:hidden">View</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2 text-sm">
                  <Code className="w-4 h-4" />
                  <span className="hidden sm:inline font-normal">Generate Code</span>
                  <span className="sm:hidden">Generate</span>
                </Button>
              </div>
            </div>

            {/* Issue Title */}
            <h1 className="text-lg mb-4 sm:mb-6 break-words sm:text-base font-bold">{selectedIssue.title}</h1>

            {/* Issue Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6 text-sm">
              <div>
                <span style={{ color: '#747474', fontSize: '12px', fontWeight: 'normal' }}>Assignee:</span>
                <div style={{ color: '#3B3B3B', fontWeight: 'normal' }} className="truncate">{selectedIssue.assignee}</div>
              </div>
              <div>
                <span style={{ color: '#747474', fontSize: '12px', fontWeight: 'normal' }}>Reporter:</span>
                <div style={{ color: '#3B3B3B', fontWeight: 'normal' }} className="truncate">{selectedIssue.reporter}</div>
              </div>
              <div>
                <span style={{ color: '#747474', fontSize: '12px', fontWeight: 'normal' }}>Created:</span>
                <div style={{ color: '#3B3B3B', fontWeight: 'normal' }}>{selectedIssue.created}</div>
              </div>
              <div>
                <span style={{ color: '#747474', fontSize: '12px', fontWeight: 'normal' }}>Updated:</span>
                <div style={{ color: '#3B3B3B', fontWeight: 'normal' }}>{selectedIssue.updated}</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4 sm:mb-6 pt-4 sm:pt-6 border-t border-[#CCCCCC]">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-foreground leading-relaxed">{selectedIssue.description}</p>
            </div>

            {/* Issue Details Grid */}
            <div className="grid grid-cols-11 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Priority, Story Points, Sprint Column */}
              <div className="col-span-6 border border-[#CCCCCC] rounded p-3 flex justify-between">
                <div>
                  <span style={{ color: '#747474', fontSize: '12px', fontWeight: 'normal' }}>Priority</span>
                  <div className="flex items-center gap-1 mt-1">
                    {getPriorityIcon(selectedIssue.priority)}
                    <span style={{ color: '#3B3B3B', fontWeight: 'normal' }} className="text-sm capitalize">{selectedIssue.priority}</span>
                  </div>
                </div>
                <div>
                  <span style={{ color: '#747474', fontSize: '12px', fontWeight: 'normal' }}>Story Points</span>
                  <div style={{ color: '#3B3B3B', fontWeight: 'normal' }} className="text-sm mt-1">{selectedIssue.points}</div>
                </div>
                <div>
                  <span style={{ color: '#747474', fontSize: '12px', fontWeight: 'normal' }}>Sprint</span>
                  <div style={{ color: '#3B3B3B', fontWeight: 'normal' }} className="text-sm mt-1">{selectedIssue.sprint}</div>
                </div>
              </div>
              
              {/* Labels Column */}
              <div className="col-span-5 border border-[#CCCCCC] rounded p-3">
                <span style={{ color: '#747474', fontSize: '12px', fontWeight: 'normal' }}>Labels</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedIssue.labels.map((label, index) => <Badge key={index} variant="secondary" className="text-xs">
                      {label}
                    </Badge>)}
                </div>
              </div>
            </div>
          </div>

          {/* BRD Integration Actions */}
          <div className="border border-[#CCCCCC] rounded-md p-4">
            <h3 className="font-semibold mb-4 text-[#3B3B3B]">BRD Integration Actions</h3>
            
            {/* Blue background section */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
              <button className="text-blue-600 font-medium mb-2 hover:underline cursor-pointer bg-transparent border-none p-0">
                Create BRD from Issue
              </button>
              <p className="text-[#3B3B3B] text-sm mb-4">
                Generate a Business Requirements Document based on this Jira issue and its details.
              </p>
              <Button className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90 w-full sm:w-auto">
                Generate BRD from Issue
              </Button>
            </div>
            
            {/* Action buttons outside blue section */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-center">
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
       </div>
     </div>;
};