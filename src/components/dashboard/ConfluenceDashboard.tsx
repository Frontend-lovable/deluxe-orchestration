import { Search, ChevronRight, User, FileText, Users, Calendar, Tag, ExternalLink, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

const confluencePages = [
  {
    id: 1,
    title: "Architecture Overview",
    author: "Sarah Johnson",
    timestamp: "Jan 15, 4:00 PM",
    status: "Approved",
    statusColor: "bg-green-100 text-green-700",
    content: `# Architecture Overview

## System Architecture
This document outlines the high-level architecture for the Payment Gateway integration system. The architecture follows a microservices pattern with the following key components:

### Core Components
- **API Gateway**: Routes requests and handles authentication
- **Payment Service**: Processes payment transactions
- **User Management**: Handles user accounts and profiles
- **Notification Service**: Manages email and SMS notifications

### Security Features
- OAuth 2.0 authentication
- JWT token validation
- End-to-end encryption
- PCI DSS compliance

### Database Design
- PostgreSQL for transactional data
- Redis for caching and sessions
- MongoDB for audit logs`,
    tags: ["architecture", "security", "database"],
    lastModified: "Jan 15, 2024"
  },
  {
    id: 2,
    title: "API Specifications - Payment Gateway Integration",
    author: "Michael Chen",
    timestamp: "Jan 12, 5:50 PM",
    status: "Under Review",
    statusColor: "bg-yellow-100 text-yellow-700",
    content: `# API Specifications - Payment Gateway Integration

## Overview
This document defines the API specifications for integrating with various payment gateways including Stripe, PayPal, and Square.

### Authentication Endpoints
\`\`\`
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
\`\`\`

### Payment Endpoints
\`\`\`
POST /api/payments/create
GET /api/payments/{id}
POST /api/payments/{id}/refund
GET /api/payments/history
\`\`\`

### Webhook Integration
- Real-time payment status updates
- Transaction confirmation callbacks
- Fraud detection notifications

### Error Handling
Standard HTTP status codes with detailed error messages in JSON format.`,
    tags: ["api", "integration", "payments"],
    lastModified: "Jan 12, 2024"
  },
  {
    id: 3,
    title: "Security Requirements & Compliance Standards",
    author: "Jennifer Davis",
    timestamp: "Jan 10, 3:50 PM",
    status: "Published",
    statusColor: "bg-purple-100 text-purple-700",
    content: `# Security Requirements & Compliance Standards

## Compliance Framework
Our system adheres to the following compliance standards:
- PCI DSS Level 1
- SOX compliance
- GDPR data protection
- ISO 27001 certification

## Security Measures
### Data Protection
- AES-256 encryption at rest
- TLS 1.3 for data in transit
- Regular security audits
- Penetration testing

### Access Control
- Multi-factor authentication
- Role-based access control
- Regular access reviews
- Principle of least privilege`,
    tags: ["security", "compliance", "+2"],
    lastModified: "Jan 10, 2024"
  },
  {
    id: 4,
    title: "Database Schema Design",
    author: "Robert Kim",
    timestamp: "Jan 8, 3:50 PM",
    status: "In Progress",
    statusColor: "bg-blue-100 text-blue-700",
    content: `# Database Schema Design

## Entity Relationship Model
The database schema includes the following main entities:

### Users Table
- user_id (Primary Key)
- email (Unique)
- password_hash
- created_at
- updated_at

### Payments Table
- payment_id (Primary Key)
- user_id (Foreign Key)
- amount
- currency
- status
- gateway_provider
- transaction_id
- created_at

### Audit Log
All transactions are logged for compliance and troubleshooting purposes.`,
    tags: ["database", "schema", "+2"],
    lastModified: "Jan 8, 2024"
  },
  {
    id: 5,
    title: "Testing Strategy & Test Cases Documentation",
    author: "Lisa Wong",
    timestamp: "Jan 5, 3:50 PM",
    status: "Draft",
    statusColor: "bg-gray-100 text-gray-700",
    content: `# Testing Strategy & Test Cases

## Testing Approach
Comprehensive testing strategy including:
- Unit testing (90% coverage)
- Integration testing
- End-to-end testing
- Performance testing
- Security testing

## Test Environments
- Development
- Staging
- Pre-production
- Production monitoring

## Automated Testing
CI/CD pipeline with automated test execution on every commit.`,
    tags: ["testing", "strategy", "+2"],
    lastModified: "Jan 5, 2024"
  },
];

export const ConfluenceDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("Architecture Overview");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPages = confluencePages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Approved": "bg-green-100 text-green-700",
      "Under Review": "bg-yellow-100 text-yellow-700", 
      "Published": "bg-purple-100 text-purple-700",
      "In Progress": "bg-blue-100 text-blue-700",
      "Draft": "bg-gray-100 text-gray-700"
    };
    
    return statusConfig[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="h-full bg-white">
      <div className="p-2 sm:p-4 md:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 h-auto xl:h-full">
          {/* Left Sidebar - Search and Pages List */}
          <div className="xl:col-span-4 order-2 xl:order-1">
            <div className="h-auto xl:h-[650px] flex flex-col border border-[#ccc] p-[20px] rounded-lg">
              {/* Search Bar */}
              <div className="mb-4 sm:mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search pages"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-[45px] pl-10 pr-4 border border-[#DEDCDC] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>
              </div>

              {/* Payment Gateway Section */}
              <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#E6E6E6] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="pr-2 sm:pr-[20px]">
                  <h2 className="text-base sm:text-lg font-semibold mb-4">Payment Gateway</h2>
                  <div className="space-y-2">
                    {filteredPages.map((page) => (
                      <div 
                        key={page.id} 
                        className={`p-3 sm:p-4 border-[#DEDCDC] border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedPage === page.title ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedPage(page.title)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-sm text-foreground truncate pr-2 flex-1">
                            {page.title}
                          </h3>
                          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Avatar className="h-4 w-4 flex-shrink-0">
                            <AvatarFallback className="text-xs">
                              {page.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">{page.author}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs truncate" style={{color: '#747474'}}>{page.timestamp}</span>
                          <Badge className={`${getStatusBadge(page.status)} text-xs px-2 py-1 flex-shrink-0 border`} style={{fontWeight: 'normal', borderColor: '#DEDCDC'}}>
                            {page.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {filteredPages.length === 0 && (
                      <div className="text-center text-muted-foreground text-sm py-8">
                        No pages found matching your search.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="xl:col-span-8 order-1 xl:order-2">
            <div className="border border-[#CCCCCC] rounded-lg h-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 border-b border-[#CCCCCC] p-4 sm:p-[24px] gap-4">
                <h1 className="text-base font-semibold truncate flex-1">{selectedPage}</h1>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button variant="outline" className="bg-white border border-[#8C8C8C] hover:bg-gray-50 text-sm flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">View in Confluence</span>
                    <span className="sm:hidden">View</span>
                  </Button>
                  <Button variant="outline" className="bg-white border border-[#8C8C8C] hover:bg-gray-50 text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create Epic & Story</span>
                    <span className="sm:hidden">Create</span>
                  </Button>
                  <Button variant="outline" className="bg-white border border-[#8C8C8C] hover:bg-gray-50 text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Preview Jira Integration</span>
                    <span className="sm:hidden">Preview</span>
                  </Button>
                </div>
              </div>

              {/* Content Details */}
              <div className="rounded-lg p-4 sm:p-6 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="text-sm">
                      SJ
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">Sarah Johnson</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>Jan 15, 4:00 PM</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 self-start">
                    Approved
                  </Badge>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-foreground leading-relaxed" style={{color: '#747474'}}>
                    This document outlines the high-level architecture for the Payment Exchange system, including component interactions, data flows, and integration patterns
                  </p>
                  
                  <p className="text-xs" style={{color: '#747474'}}>
                    This is a preview of the page content. The full page contains detailed technical specifications, diagrams, and implementation guidelines relevant to the Payment Exchange project.
                  </p>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Labels</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">Architecture</Badge>
                      <Badge variant="secondary" className="text-xs">Payment</Badge>
                      <Badge variant="secondary" className="text-xs">Overview</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};