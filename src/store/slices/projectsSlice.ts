import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project, LoadingState } from '@/types/api';

interface ProjectsState extends LoadingState {
  projects: Project[];
  selectedProject: Project | null;
  total: number;
}

const initialState: ProjectsState = {
  projects: [],
  selectedProject: null,
  total: 0,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setProjects: (state, action: PayloadAction<{ projects: Project[]; total: number }>) => {
      state.projects = action.payload.projects;
      state.total = action.payload.total;
      state.isLoading = false;
      state.error = null;
      state.lastUpdated = new Date().toISOString();
    },
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    refreshProjects: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.unshift(action.payload);
      state.total += 1;
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(p => p.project_id === action.payload.project_id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.project_id !== action.payload);
      state.total -= 1;
    },
  },
});

export const {
  setLoading,
  setProjects,
  setSelectedProject,
  setError,
  clearError,
  refreshProjects,
  addProject,
  updateProject,
  removeProject,
} = projectsSlice.actions;

export default projectsSlice.reducer;