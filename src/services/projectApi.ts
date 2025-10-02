// Project API Service
import { API_CONFIG } from "@/config/api";

export interface CreateProjectRequest {
  project_name: string;
  description: string;
  jira_project_key: string;
  confluence_space_key: string;
}

export interface Project {
  project_id: string;
  project_name: string;
  description: string;
  jira_project_key?: string;
  confluence_space_key?: string;
  created_at: string;
}

interface CreateProjectResponse extends Project {}

export const createProject = async (projectData: CreateProjectRequest): Promise<CreateProjectResponse> => {
  const API_BASE_URL = API_CONFIG.BASE_URL;
  try {
    const response = await fetch(`${API_BASE_URL}/projects/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const fetchProjects = async (): Promise<Project[]> => {
  const API_BASE_URL = API_CONFIG.BASE_URL;
  try {
    const response = await fetch(`${API_BASE_URL}/projects/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const getProjectById = async (projectId: string): Promise<Project> => {
  const API_BASE_URL = API_CONFIG.BASE_URL;
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Project not found");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

export interface BRDTemplate {
  template_id: string;
  template_name: string;
  s3_path: string;
  created_at: string;
  updated_at: string;
}

export interface BRDTemplatesResponse {
  success: boolean;
  message: string;
  data: BRDTemplate[];
  total_count: number;
}

export const getBRDTemplates = async (): Promise<BRDTemplate[]> => {
  const API_BASE_URL = API_CONFIG.BASE_URL;
  try {
    const response = await fetch(`${API_BASE_URL}/templates/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BRDTemplatesResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching BRD templates:", error);
    throw error;
  }
};

export interface FileUploadResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const uploadFiles = async (files: File[]): Promise<FileUploadResponse> => {
  const FILE_UPLOAD_URL = "http://deluxe-internet-300914418.us-east-1.elb.amazonaws.com:8000/api/v1/files/upload";
  try {
    const formData = new FormData();
    
    // API expects 'file' field name (singular)
    files.forEach((file) => {
      formData.append('file', file);
    });

    const response = await fetch(FILE_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
};