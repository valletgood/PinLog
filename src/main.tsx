import { createRoot } from 'react-dom/client';
import './index.css';
import router from './Router.tsx';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/configStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 실패 시 1번 재시도
      refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 비활성화
      staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh 상태로 유지
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </PersistGate>
  </Provider>,
);
