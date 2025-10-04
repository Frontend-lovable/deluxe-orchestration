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

export const uploadFiles = async (files: File[]): Promise<FileUploadResponse> => {
  const FILE_UPLOAD_URL = "/api/v1/files/upload";
  try {
    const formData = new FormData();
    
    // API expects 'file' field name (singular)
    files.forEach((file) => {
      formData.append('file', file);
    });
    
    formData.append('stream', 'false');

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

export async function* streamUploadFiles(files: File[]): AsyncGenerator<string, void, unknown> {
  const FILE_UPLOAD_URL = "/api/v1/files/upload";
  const formData = new FormData();
  
  console.log('=== STREAM UPLOAD FILES START ===');
  console.log('Files to upload:', files.map(f => f.name));
  
  // API expects 'file' field name (singular)
  files.forEach((file) => {
    formData.append('file', file);
  });
  
  formData.append('stream', 'true');

  const response = await fetch(FILE_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('Response body is not readable');
  }

  let buffer = '';
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        console.log('Stream ended, remaining buffer:', buffer);
        break;
      }
      
      const chunk = decoder.decode(value, { stream: true });
      console.log('Raw chunk received:', chunk);
      
      buffer += chunk;
      
      // Process complete lines
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        
        // Handle CRLF
        if (line.endsWith('\r')) {
          line = line.slice(0, -1);
        }
        
        console.log('Processing line:', line);
        
        // Skip empty lines and comments
        if (!line.trim() || line.startsWith(':')) continue;
        
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          console.log('Data extracted:', data);
          
          if (data && data !== '[DONE]') {
            try {
              const parsed = JSON.parse(data);
              console.log('Parsed JSON structure:', parsed);
              
              // Extract only the text field, ignore type, chunk_count, etc.
              const content = parsed.text || 
                            parsed.content || 
                            parsed.message || 
                            parsed.response || 
                            parsed.chunk ||
                            parsed.output ||
                            parsed.data ||
                            parsed.delta?.content ||
                            '';
              
              if (content && typeof content === 'string') {
                // Clean up any escaped quotes
                const cleanContent = content.replace(/^"|"$/g, '').replace(/\\"/g, '"');
                console.log('Yielding cleaned content:', cleanContent.substring(0, 100));
                yield cleanContent;
              } else if (typeof parsed === 'string') {
                // If parsed is just a string, yield it
                const cleanContent = parsed.replace(/^"|"$/g, '').replace(/\\"/g, '"');
                console.log('Yielding string content:', cleanContent.substring(0, 100));
                yield cleanContent;
              } else {
                console.log('No text content found in:', parsed);
              }
            } catch (e) {
              console.log('JSON parse failed, treating as plain text:', data.substring(0, 100));
              // If it's not valid JSON, yield it as plain text
              if (data && !data.includes('"type"') && !data.includes('"chunk_count"')) {
                yield data;
              }
            }
          } else if (data === '[DONE]') {
            console.log('Stream done marker received');
            break;
          }
        }
      }
    }
    console.log('=== STREAM UPLOAD FILES END ===');
  } finally {
    reader.releaseLock();
  }
}

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