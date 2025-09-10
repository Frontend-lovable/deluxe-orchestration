import { Search, ChevronDown, User, FileText, Users, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const [selectedPage, setSelectedPage] = useState(null);

  const handlePageClick = (page) => {
    setSelectedPage(page);
  };

  const renderSelectedPageContent = () => {
    if (!selectedPage) {
      return (
        <div className="text-center max-w-md mx-auto">
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
      );
    }

    return (
      <div className="h-full">
        {/* Page Header */}
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-2xl font-bold text-foreground">{selectedPage.title}</h1>
            <Badge className={selectedPage.statusColor}>
              {selectedPage.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {selectedPage.author.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span>{selectedPage.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Last modified: {selectedPage.lastModified}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedPage.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Page Content */}
        <div className="prose max-w-none">
          <div className="whitespace-pre-line text-foreground">
            {selectedPage.content}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-4 border-t border-border">
          <div className="flex gap-3">
            <Button className="bg-primary hover:bg-primary/90">
              Create Jira Task
            </Button>
            <Button variant="outline">
              Edit Page
            </Button>
            <Button variant="outline">
              Share
            </Button>
          </div>
        </div>
      </div>
    );
  };
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
                  <Card 
                    key={index} 
                    className={`p-3 hover:shadow-md transition-shadow cursor-pointer border ${
                      selectedPage?.id === page.id ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => handlePageClick(page)}
                  >
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

          {/* Right Column - Selected Page Content */}
          <div className="col-span-9 flex items-start justify-center p-4 overflow-y-auto">
            {renderSelectedPageContent()}
          </div>
        </div>
      </div>
    </div>
  );
};