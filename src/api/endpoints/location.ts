import apiClient from '@/api/client';
import type { ApiResponse, Location } from '@/api/types';

/**
 * Location API
 * 위치 관련 API 엔드포인트
 */
export const locationApi = {
  /**
   * 위치 상세 조회
   */
  getLocation: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Location>>(
      `/api/search?q=${encodeURIComponent(id)}&format=json&addressdetails=1&limit=1&polygon_svg=1`,
    );
    return response.data;
  },
};
