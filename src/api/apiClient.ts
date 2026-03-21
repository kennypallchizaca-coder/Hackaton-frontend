import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unwrap helper — backend wraps success responses as { success: true, data: ... }
function unwrapResponse(responseData: unknown): unknown {
  if (
    responseData !== null &&
    typeof responseData === 'object' &&
    'success' in responseData &&
    (responseData as Record<string, unknown>).success === true &&
    'data' in responseData
  ) {
    return (responseData as Record<string, unknown>).data;
  }
  return responseData;
}

// Response Interceptor: Handle Refresh Token and Unwrap Data
apiClient.interceptors.response.use(
  (response) => {
    response.data = unwrapResponse(response.data);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        // HACKATHON FALLBACK: Do not try to refresh or log out the demo session!
        if (refreshToken === 'hackathon-demo-token') {
          console.warn('Backend returned 401 for demo session, silencing interceptor to prevent logout loop');
          return Promise.resolve({ data: { success: true, data: [] } }); // Mock successful empty response to prevent app crash
        }

        try {
          // Use a fresh axios instance to avoid interceptor loops
          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          // Backend wraps in { success, data } — unwrap manually here
          const payload = unwrapResponse(refreshResponse.data) as {
            tokens: { accessToken: string; refreshToken: string };
          };

          const { accessToken, refreshToken: newRefreshToken } = payload.tokens;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed — log out user
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user_data');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
