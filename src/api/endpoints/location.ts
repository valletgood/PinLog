import apiClient from '@/api/client';
import type { LocationSearchResponse } from '@/api/types';

/**
 * Location API
 * 위치 관련 API 엔드포인트
 */
export const locationApi = {
  getLocationSearch: async (query: string) => {
    const response = await apiClient.get<LocationSearchResponse>(
      `/v1/search/local.json?query=${encodeURIComponent(query)}&display=5`,
      {
        headers: {
          'X-Naver-Client-Id': import.meta.env.VITE_NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': import.meta.env.VITE_NAVER_CLIENT_SECRET,
        },
      },
    );
    return response.data;
  },
};
