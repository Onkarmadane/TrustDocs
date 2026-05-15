import apiClient from '../api/apiClient';

export const reportService = {
  createReport: async (reportData) => {
    return await apiClient('/reports', {
      method: 'POST',
      data: reportData,
    });
  },

  getReports: async () => {
    return await apiClient('/reports', {
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
  }
};
