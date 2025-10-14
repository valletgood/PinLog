import { configureStore } from '@reduxjs/toolkit';
import mapReducer from './slices/mapSlice';

// Store 생성
export const store = configureStore({
  reducer: {
    map: mapReducer,
  },
  // Redux DevTools는 자동으로 활성화됩니다 (production에서는 비활성화)
  devTools: import.meta.env.DEV,

  // 추가 미들웨어가 필요한 경우
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 필요시 직렬화 체크 비활성화할 액션 타입
        ignoredActions: [],
      },
    }),
});

// TypeScript 타입 추론
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
