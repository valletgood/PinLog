import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// 타입 정의
export interface MapCenter {
  lat: number;
  lng: number;
}

interface MapState {
  center: MapCenter;
  zoom: number;
  isLocationAllowed: boolean;
}

// 초기 상태 - 서울 중심부
const initialState: MapState = {
  center: {
    lat: 37.5665,
    lng: 126.978,
  },
  zoom: 17,
  isLocationAllowed: false,
};

// Slice 생성
const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    // Center 설정
    setCenter: (state, action: PayloadAction<MapCenter>) => {
      state.center = action.payload;
    },

    // Zoom 설정
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },

    // 위치 권한 상태 설정
    setLocationAllowed: (state, action: PayloadAction<boolean>) => {
      state.isLocationAllowed = action.payload;
    },

    // 현재 위치로 설정
    setCurrentLocation: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
      state.center = action.payload;
      state.isLocationAllowed = true;
    },

    // 서울 중심으로 리셋
    resetToSeoul: (state) => {
      state.center = {
        lat: 37.5665,
        lng: 126.978,
      };
      state.zoom = 17;
      state.isLocationAllowed = true; // 위치 설정 완료
    },
  },
});

// Actions export
export const { setCenter, setZoom, setLocationAllowed, setCurrentLocation, resetToSeoul } =
  mapSlice.actions;

// Reducer export
export default mapSlice.reducer;
