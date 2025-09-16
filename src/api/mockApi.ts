import { Project, ApiResponse, ProjectsResponse, ApiError } from '@/types/api';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock project data
const mockProjects: Project[] = [
  {
    project_id: 'proj_001',
    project_name: 'E-commerce Platform Redesign',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    project_id: 'proj_002',
    project_name: 'Mobile App Development',
    created_at: '2024-02-20T14:45:00Z'
  },
  {
    project_id: 'proj_003',
    project_name: 'Data Analytics Dashboard',
    created_at: '2024-03-10T09:15:00Z'
  },
  {
    project_id: 'proj_004',
    project_name: 'Customer Support Portal',
    created_at: '2024-04-05T16:20:00Z'
  },
  {
    project_id: 'proj_005',
    project_name: 'Marketing Automation System',
    created_at: '2024-05-12T11:10:00Z'
  },
  {
    project_id: 'proj_006',
    project_name: 'Inventory Management Tool',
    created_at: '2024-06-18T13:35:00Z'
  },
  {
    project_id: 'proj_007',
    project_name: 'Social Media Integration',
    created_at: '2024-07-22T08:50:00Z'
  }
];

// Simulate API errors occasionally
const shouldSimulateError = () => Math.random() < 0.1; // 10% chance of error

export class MockApiError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', details?: any) {
    super(message);
    this.name = 'MockApiError';
    this.code = code;
    this.details = details;
  }
}

export const mockApi = {
  async getProjects(): Promise<ApiResponse<ProjectsResponse>> {
    await delay(800 + Math.random() * 1200); // 0.8-2s delay

    if (shouldSimulateError()) {
      throw new MockApiError(
        'Failed to fetch projects. Please try again.',
        'NETWORK_ERROR',
        { timestamp: new Date().toISOString() }
      );
    }

    return {
      success: true,
      data: {
        projects: mockProjects,
        total: mockProjects.length
      },
      message: 'Projects fetched successfully'
    };
  },

  async getProject(projectId: string): Promise<ApiResponse<Project>> {
    await delay(300 + Math.random() * 500);

    if (shouldSimulateError()) {
      throw new MockApiError(
        'Failed to fetch project details.',
        'PROJECT_NOT_FOUND'
      );
    }

    const project = mockProjects.find(p => p.project_id === projectId);
    
    if (!project) {
      throw new MockApiError(
        `Project with ID ${projectId} not found`,
        'PROJECT_NOT_FOUND'
      );
    }

    return {
      success: true,
      data: project,
      message: 'Project fetched successfully'
    };
  }
};

// CORS configuration for future real API integration
export const corsConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
};