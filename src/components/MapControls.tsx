import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCenter, setZoom, resetToSeoul, setCurrentLocation } from '@/redux/slices/mapSlice';

/**
 * Redux 사용 예시 컴포넌트
 * 지도 중심과 줌을 제어하는 컨트롤 패널
 */
export default function MapControls() {
  const dispatch = useAppDispatch();

  // Redux store에서 상태 가져오기
  const { center, zoom, isLocationAllowed } = useAppSelector((state) => state.map);

  // 특정 위치로 이동
  const handleMoveToGangnam = () => {
    dispatch(setCenter({ lat: 37.4979, lng: 127.0276 }));
  };

  const handleMoveToHongdae = () => {
    dispatch(setCenter({ lat: 37.5563, lng: 126.9237 }));
  };

  // 줌 조정
  const handleZoomIn = () => {
    dispatch(setZoom(Math.min(zoom + 1, 18)));
  };

  const handleZoomOut = () => {
    dispatch(setZoom(Math.max(zoom - 1, 1)));
  };

  // 서울로 리셋
  const handleReset = () => {
    dispatch(resetToSeoul());
  };

  // 현재 위치 가져오기
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          dispatch(
            setCurrentLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }),
          );
        },
        (error) => {
          console.error('위치를 가져올 수 없습니다:', error);
          alert('위치 권한을 허용해주세요.');
        },
      );
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-4 z-[1000] max-w-xs">
      <h3 className="font-bold text-lg mb-4 text-gray-800">지도 컨트롤</h3>

      {/* 현재 상태 표시 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
        <p className="text-gray-600">
          <span className="font-semibold">위도:</span> {center.lat.toFixed(6)}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">경도:</span> {center.lng.toFixed(6)}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">줌:</span> {zoom}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">위치 권한:</span>{' '}
          <span className={isLocationAllowed ? 'text-green-600' : 'text-red-600'}>
            {isLocationAllowed ? '✓ 허용됨' : '✗ 미허용'}
          </span>
        </p>
      </div>

      {/* 위치 이동 버튼 */}
      <div className="space-y-2 mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">빠른 이동</p>
        <button
          onClick={handleGetCurrentLocation}
          className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
        >
          📍 현재 위치
        </button>
        <button
          onClick={handleMoveToGangnam}
          className="w-full py-2 px-3 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
        >
          강남역
        </button>
        <button
          onClick={handleMoveToHongdae}
          className="w-full py-2 px-3 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
        >
          홍대입구역
        </button>
        <button
          onClick={handleReset}
          className="w-full py-2 px-3 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
        >
          🏙️ 서울 중심
        </button>
      </div>

      {/* 줌 컨트롤 */}
      <div className="flex gap-2">
        <button
          onClick={handleZoomOut}
          className="flex-1 py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded transition-colors"
        >
          - 축소
        </button>
        <button
          onClick={handleZoomIn}
          className="flex-1 py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded transition-colors"
        >
          + 확대
        </button>
      </div>
    </div>
  );
}
