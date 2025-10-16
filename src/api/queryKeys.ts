/**
 * React Query Key Factory
 * Query Key를 중앙에서 관리하여 일관성을 유지합니다.
 */

export const queryKeys = {
  // Location 관련 키
  location: {
    all: ['location'] as const,
    detail: (id: string) => ['location', 'detail', id] as const,
    search: (query: string) => ['location', 'search', query] as const,
  },
};
