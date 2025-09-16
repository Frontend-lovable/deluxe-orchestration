import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { mockApi, MockApiError } from '@/api/mockApi';
import { setLoading, setProjects, setError, clearError } from '@/store/slices/projectsSlice';
import { RootState } from '@/store/store';
import { retryWithBackoff } from '@/utils/apiConfig';

export const useProjects = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  const { projects, isLoading, error, total, lastUpdated } = useSelector(
    (state: RootState) => state.projects
  );

  const query = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      try {
        const response = await retryWithBackoff(() => mockApi.getProjects());
        dispatch(setProjects({
          projects: response.data.projects,
          total: response.data.total
        }));
        return response.data;
      } catch (error) {
        const errorMessage = error instanceof MockApiError 
          ? error.message 
          : 'An unexpected error occurred';
        dispatch(setError(errorMessage));
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    retry: (failureCount, error) => {
      if (error instanceof MockApiError && error.code === 'PROJECT_NOT_FOUND') {
        return false; // Don't retry for 404-like errors
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const refetch = async () => {
    dispatch(clearError());
    await queryClient.invalidateQueries({ queryKey: ['projects'] });
    return query.refetch();
  };

  const refresh = async () => {
    dispatch(setLoading(true));
    await refetch();
  };

  return {
    projects,
    isLoading: isLoading || query.isLoading,
    error: error || (query.error ? 'Failed to load projects' : null),
    total,
    lastUpdated,
    refetch,
    refresh,
    isRefetching: query.isRefetching,
    isFetching: query.isFetching,
  };
};

export const useProject = (projectId: string) => {
  const dispatch = useDispatch();
  
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      try {
        const response = await retryWithBackoff(() => mockApi.getProject(projectId));
        return response.data;
      } catch (error) {
        const errorMessage = error instanceof MockApiError 
          ? error.message 
          : 'Failed to load project';
        throw new Error(errorMessage);
      }
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};