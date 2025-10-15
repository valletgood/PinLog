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

export interface Address {
  [key: string]: string;
}

export interface Location {
  place_id: number;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  name: string;
  display_name: string;
  address: Address;
  boundingbox: string[];
  latitude: number;
  longitude: number;
  class: string;
  type: string;
  importance: number;
  icon: string;
}

// ==================== 에러 타입 ====================

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}
