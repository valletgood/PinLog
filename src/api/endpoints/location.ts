import apiClient from '@/api/client';
import type { LocationSearchResponse, SavedLocation } from '@/api/types';

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
  getLocationList: async () => {
    const response = localStorage.getItem('locationList') || [];
    return response;
  },
  saveLocation: async (data: SavedLocation) => {
    try {
      const prev = JSON.parse(localStorage.getItem('locationList') || '[]') as SavedLocation[];
      const newList = [...prev, data];
      localStorage.setItem('locationList', JSON.stringify(newList));
      return { error: 0, message: '위치가 저장되었습니다.' };
    } catch (error: any) {
      return { error: 1, message: error.message };
    }
  },
};
