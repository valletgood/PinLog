import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCenter, setZoom } from '@/redux/slices/mapSlice';
import { useMapEvents } from 'react-leaflet';
import { useEffect, useRef } from 'react';

/**
 * 지도 이벤트 핸들러 컴포넌트
 * MapContainer 내부에서 사용되어야 함
 */
function MapEventHandler() {
  const dispatch = useAppDispatch();
  const { center, zoom } = useAppSelector((state) => state.map);

  // 무한 루프 방지를 위한 ref
  const isUserInteraction = useRef(true);

  const map = useMapEvents({
    // 줌 이벤트 - 줌 레벨 변경 시
    zoomend: (e) => {
      if (isUserInteraction.current) {
        const newZoom = e.target.getZoom();
        console.log('줌 변경:', newZoom);
        dispatch(setZoom(newZoom));
      }
    },

    // 이동 이벤트 - 지도 이동(드래그) 종료 시
    moveend: (e) => {
      if (isUserInteraction.current) {
        const newCenter = e.target.getCenter();
        console.log('중심 이동:', newCenter);
        dispatch(
          setCenter({
            lat: newCenter.lat,
            lng: newCenter.lng,
          }),
        );
      }
    },

    // 클릭 이벤트 (선택사항)
    click: (e) => {
      console.log('지도 클릭:', e.latlng);
    },
  });

  // Redux center가 변경되면 지도를 해당 위치로 이동
  useEffect(() => {
    if (map) {
      const currentCenter = map.getCenter();
      const currentZoom = map.getZoom();

      // 현재 위치와 Redux 위치가 다르면 이동
      const hasPositionChanged =
        Math.abs(currentCenter.lat - center.lat) > 0.0001 ||
        Math.abs(currentCenter.lng - center.lng) > 0.0001;

      const hasZoomChanged = currentZoom !== zoom;

      if (hasPositionChanged || hasZoomChanged) {
        // 사용자 인터랙션이 아닌 프로그래밍 방식 이동임을 표시
        isUserInteraction.current = false;

        // flyTo: 부드럽게 이동 (애니메이션 효과)
        map.flyTo([center.lat, center.lng], zoom, {
          duration: 1, // 1초 동안 애니메이션
        });

        // setView: 즉시 이동 (애니메이션 없음)
        // map.setView([center.lat, center.lng], zoom);

        // 애니메이션이 끝난 후 다시 사용자 인터랙션 모드로 전환
        setTimeout(() => {
          isUserInteraction.current = true;
        }, 1100);
      }
    }
  }, [center, zoom, map]);

  return null;
}

export default MapEventHandler;
