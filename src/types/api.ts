export interface Project {
  project_id: string;
  project_name: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
}

export interface ApiError {
  message: string;
  code?: string | number;
  details?: any;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}