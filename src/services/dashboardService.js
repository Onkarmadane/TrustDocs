import apiClient from '../api/apiClient';

export const dashboardService = {
  getDashboardStats: async () => {
    return await apiClient('/dashboard', {
      method: 'GET',
    });
  },
};
