import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '@/redux/configStore';
import { startLoading, stopLoading } from '@/redux/slices/loadingSlice';

// API Base URL (환경변수로 관리)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 로딩 시작
    store.dispatch(startLoading());

    // 요청 로깅 (개발 환경에서만)
    if (import.meta.env.DEV) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    // 로딩 종료
    store.dispatch(stopLoading());
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  },
);

// Response 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 로딩 종료
    store.dispatch(stopLoading());

    // 응답 로깅 (개발 환경에서만)
    if (import.meta.env.DEV) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError<{ message?: string; code?: string }>) => {
    // 로딩 종료
    store.dispatch(stopLoading());

    // 에러 로깅
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });

    return Promise.reject(error);
  },
);

export default apiClient;
