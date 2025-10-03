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
  message: string;
  filename: string;
  size: number;
  type: string;
  processed_for_querying: boolean;
  s3_uploaded: boolean;
  brd_auto_generated?: {
    success: boolean;
    brd_id: string;
    content_preview: string;
    file_path: string;
    frontend_url: string;
  };
}

export const uploadFiles = async function* (files: File[]): AsyncGenerator<{ type: string; content?: string; sections?: any[] }, void, unknown> {
  const FILE_UPLOAD_URL = "/api/v1/files/upload";
  try {
    const formData = new FormData();
    
    // API expects 'file' field name (singular)
    files.forEach((file) => {
      formData.append('file', file);
    });
    
    formData.append('stream', 'true');

    const response = await fetch(FILE_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      // Process complete lines
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer
      
      for (const line of lines) {
        if (line.trim() === '') continue;
        
        try {
          const data = JSON.parse(line);
          yield data;
        } catch (e) {
          console.error('Error parsing JSON:', e, line);
        }
      }
    }

    // Process any remaining data in buffer
    if (buffer.trim()) {
      try {
        const data = JSON.parse(buffer);
        yield data;
      } catch (e) {
        console.error('Error parsing final JSON:', e, buffer);
      }
    }
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
};

export const downloadBRD = async (brdId: string): Promise<Blob> => {
  const API_BASE_URL = API_CONFIG.BASE_URL;
  try {
    const response = await fetch(`${API_BASE_URL}/files/brd/${brdId}/download`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error downloading BRD:", error);
    throw error;
  }
};