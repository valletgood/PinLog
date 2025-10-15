import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppSelector } from '@/redux/hooks';
import MapEventHandler from './MapEventHandler';

// Leaflet 기본 마커 아이콘 설정 (Webpack 이슈 해결)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function MapView() {
  const { center, zoom, isLocationAllowed } = useAppSelector((state) => state.map);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom={true}
      className="w-full h-full"
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
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
