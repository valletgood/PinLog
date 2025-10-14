import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCenter, setZoom } from '@/redux/slices/mapSlice';

// Leaflet 기본 마커 아이콘 설정 (Webpack 이슈 해결)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * 지도 이벤트 핸들러 컴포넌트
 * MapContainer 내부에서 사용되어야 함
 */
function MapEventHandler() {
  const dispatch = useAppDispatch();

  useMapEvents({
    // 줌 이벤트 - 줌 레벨 변경 시
    zoomend: (e) => {
      const newZoom = e.target.getZoom();
      console.log('줌 변경:', newZoom);
      dispatch(setZoom(newZoom));
    },

    // 이동 이벤트 - 지도 이동(드래그) 종료 시
    moveend: (e) => {
      const newCenter = e.target.getCenter();
      console.log('중심 이동:', newCenter);
      dispatch(
        setCenter({
          lat: newCenter.lat,
          lng: newCenter.lng,
        }),
      );
    },

    // 클릭 이벤트 (선택사항)
    click: (e) => {
      console.log('지도 클릭:', e.latlng);
    },
  });

  return null;
}

export default function MapView() {
  const { center, zoom, isLocationAllowed } = useAppSelector((state) => state.map);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom={true}
      className="w-full h-full"
      style={{ height: '100%', width: '100%' }}
    >
      {/* 지도 이벤트 핸들러 */}
      <MapEventHandler />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[center.lat, center.lng]}>
        <Popup>
          <div className="text-center">
            <p className="font-semibold">{isLocationAllowed ? '현재 위치' : '서울 중심부'}</p>
            <p className="text-sm text-gray-600">
              {center.lat.toFixed(6)}, {center.lng.toFixed(6)}
            </p>
            <p className="text-xs text-gray-500 mt-1">줌: {zoom}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
