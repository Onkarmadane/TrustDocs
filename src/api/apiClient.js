const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const apiClient = async (endpoint, { method = 'GET', data, ...customConfig } = {}) => {
  const isFormData = data instanceof FormData;

  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
    ...customConfig,
  };

  if (data) {
    config.body = isFormData ? data : JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      // Ignore if not JSON
    }
    throw new ApiError(
      errorData.message || 'Something went wrong',
      response.status,
      errorData
    );
  }

  if (customConfig.responseType === 'blob') {
    return response.blob();
  }

  return response.json();
};

export default apiClient;
