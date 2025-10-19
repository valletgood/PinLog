import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { locationApi } from '@/api/endpoints/location';
import { queryKeys } from '@/api/queryKeys';
import type { SavedLocation } from '../types';

/**
 * Location API를 사용하기 위한 커스텀 훅
 * React Query를 사용하여 캐싱 및 상태 관리
 */

/**
 * 위치 검색 조회
 * @param query - 검색할 위치 키워드
 * @param enabled - 쿼리 활성화 여부 (기본값: true)
 */
export const useLocationSearch = (query: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.location.search(query),
    queryFn: async () => {
      const response = await locationApi.getLocationSearch(query);
      return response;
    },
    enabled: enabled && !!query, // id가 있을 때만 쿼리 실행
  });
};

/**
 * 저장된 위치 목록 조회
 */
export const useLocationList = () => {
  return useQuery({
    queryKey: queryKeys.location.all,
    queryFn: async () => {
      const response = await locationApi.getLocationList();
      return JSON.parse(response as string) as SavedLocation[];
    },
  });
};

/**
 * 위치 저장
 */
export const useSaveLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SavedLocation) => {
      const response = await locationApi.saveLocation(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.location.all });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

/**
 * 위치 수정
 */
export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SavedLocation) => {
      const response = await locationApi.updateLocation(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.location.all });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

/**
 * 위치 삭제
 */
export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await locationApi.deleteLocation(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.location.all });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
