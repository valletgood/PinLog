import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true면 인증 필요, false면 인증 안된 경우만 접근 가능
}

/**
 * 라우팅 가드 컴포넌트
 * isLocationAllowed 상태에 따라 접근 제어
 */
export default function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { isLocationAllowed } = useAppSelector((state) => state.map);

  // requireAuth가 true면 인증이 필요한 페이지 (MapView)
  if (requireAuth) {
    // 위치 설정이 안되어 있으면 설정 페이지로 리다이렉트
    if (!isLocationAllowed) {
      return <Navigate to="/" replace />;
    }
  }
  // requireAuth가 false면 인증이 안된 경우만 접근 가능 (SettingLocationPage)
  else {
    // 이미 위치 설정이 되어 있으면 지도 페이지로 리다이렉트
    if (isLocationAllowed) {
      return <Navigate to="/map-view" replace />;
    }
  }

  return <>{children}</>;
}
