// ==================== 공통 타입 ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== Location 관련 타입 ====================

export interface LocationSearchResponse {
  display: number;
  lastBuildDate: string;
  start: number;
  total: number;
  items: Location[];
}

export interface Location {
  title: string;
  link: string;
  category: string;
  description: string;
  telephone: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
}

export interface SavedLocation {
  id?: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  category: string;
  review: string;
  rating: number;
  photos?: string[]; // Base64 인코딩된 이미지 데이터 배열
  timestamp: string;
  updatedAt?: string;
}

// ==================== 에러 타입 ====================

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}
