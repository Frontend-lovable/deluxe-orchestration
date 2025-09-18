// Project API Service

export interface CreateProjectRequest {
  project_name: string;
  description: string;
  jira_project_key: string;
  confluence_space_key: string;
}

interface CreateProjectResponse {
  id: string;
  project_name: string;
  description: string;
  jira_project_key: string;
  confluence_space_key: string;
  created_at: string;
}

const API_BASE_URL = "http://deluxe-internet-300914418.us-east-1.elb.amazonaws.com:8000/api/v1";

export const createProject = async (projectData: CreateProjectRequest): Promise<CreateProjectResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
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