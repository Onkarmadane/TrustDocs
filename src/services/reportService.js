import apiClient from '../api/apiClient';

export const reportService = {
  createReport: async (reportData) => {
    return await apiClient('/reports', {
      method: 'POST',
      data: reportData,
    });
  },

  getReports: async (status, search, page = 1, per_page = 10) => {
    let url = `/reports?page=${page}&per_page=${per_page}&`;
    if (status && status !== 'all') url += `status=${status}&`;
    if (search) url += `search=${search}&`;
    
    // Remove trailing & or ?
    url = url.replace(/[&?]$/, '');
    
    return await apiClient(url, {
      method: 'GET',
    });
  },

  getReportById: async (id) => {
    return await apiClient(`/reports/${id}`, {
      method: 'GET',
    });
  },

  updateReport: async (id, reportData) => {
    return await apiClient(`/reports/${id}`, {
      method: 'PUT',
      data: reportData,
    });
  },

  deleteReport: async (id) => {
    return await apiClient(`/reports/${id}`, {
      method: 'DELETE',
    });
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return await apiClient('/upload', {
      method: 'POST',
      data: formData,
    });
  },

  downloadPdf: async (id) => {
    return await apiClient(`/reports/${id}/pdf`, {
      method: 'GET',
      responseType: 'blob',
    });
  }
};
