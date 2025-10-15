import { useQuery } from '@tanstack/react-query';
import { locationApi } from '@/api/endpoints/location';
import { queryKeys } from '@/api/queryKeys';

/**
 * Location API를 사용하기 위한 커스텀 훅
 * React Query를 사용하여 캐싱 및 상태 관리
 */

/**
 * 위치 상세 조회
 * @param id - 조회할 위치 ID
 * @param enabled - 쿼리 활성화 여부 (기본값: true)
 */
export const useLocation = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.location.detail(id),
    queryFn: async () => {
      const response = await locationApi.getLocation(id);
      return response.data;
    },
    enabled: enabled && !!id, // id가 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};
