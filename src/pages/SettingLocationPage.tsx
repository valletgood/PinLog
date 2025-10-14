import Layout from '@/components/ui/Layout';
import { useAppDispatch } from '@/redux/hooks';
import { setCurrentLocation, resetToSeoul } from '@/redux/slices/mapSlice';

export default function SettingLocationPage() {
  const dispatch = useAppDispatch();

  const handleUseDefaultLocation = () => {
    dispatch(resetToSeoul());
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Redux store에 현재 위치 저장
          dispatch(
            setCurrentLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }),
          );
        },
        (error) => {
          console.error('위치를 가져올 수 없습니다:', error);
          // 기본 위치 (서울)로 설정
          dispatch(resetToSeoul());
        },
      );
    } else {
      // Geolocation을 지원하지 않는 경우 기본 위치 (서울)
      dispatch(resetToSeoul());
    }
  };

  return (
    <Layout className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">위치 설정</h2>
          <p className="text-gray-600 mb-6">
            현재 위치를 사용하시겠습니까?
            <br />
            <span className="text-sm text-gray-500">
              허용하지 않으면 서울 중심부로 자동 지정됩니다
            </span>
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleUseCurrentLocation}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            현재 위치 사용
          </button>
          <button
            onClick={handleUseDefaultLocation}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
          >
            기본 위치로 이동
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          위치 권한은 지도 표시를 위해서만 사용됩니다
        </p>
      </div>
    </Layout>
  );
}
