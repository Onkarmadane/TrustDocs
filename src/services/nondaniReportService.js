import apiClient from '../api/apiClient';

export const nondaniReportService = {
  createReport: async (reportData) => {
    return await apiClient('/nondani-reports', {
      method: 'POST',
      data: reportData,
    });
  },

  getReports: async (status, search, page = 1, per_page = 10) => {
    let url = `/nondani-reports?page=${page}&per_page=${per_page}&`;
    if (status && status !== 'all') url += `status=${status}&`;
    if (search) url += `search=${search}&`;
    
    url = url.replace(/[&?]$/, '');
    
    return await apiClient(url, {
      method: 'GET',
    });
  },

  getReportById: async (id) => {
    return await apiClient(`/nondani-reports/${id}`, {
      method: 'GET',
    });
  },

  updateReport: async (id, reportData) => {
    return await apiClient(`/nondani-reports/${id}`, {
      method: 'PUT',
      data: reportData,
    });
  },

  deleteReport: async (id) => {
    return await apiClient(`/nondani-reports/${id}`, {
      method: 'DELETE',
    });
  },

  downloadPdf: async (id) => {
    return await apiClient(`/nondani-reports/${id}/pdf`, {
      method: 'GET',
      responseType: 'blob',
    });
  }
};
