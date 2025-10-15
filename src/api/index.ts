/**
 * API Module
 * 모든 API 엔드포인트를 중앙에서 관리
 */

export { default as apiClient } from './client';

// API 엔드포인트
export { locationApi } from './endpoints/location';

// React Query
export { queryKeys } from './queryKeys';
export { useLocation } from './hooks/useLocation';

// 타입 export
export type * from './types';
