import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppSelector } from '@/redux/hooks';
import MapEventHandler from './MapEventHandler';
import { useState, useMemo } from 'react';
import SearchLocationDetailModal from '../modal/SearchLocationDetailModal';
import type { Location } from '@/api';
import SaveLocationModal from '../modal/SaveLocationModal';

// Leaflet 기본 마커 아이콘 설정 (Webpack 이슈 해결)
type IconDefaultPrototype = typeof L.Icon.Default.prototype & { _getIconUrl?: () => string };
delete (L.Icon.Default.prototype as IconDefaultPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapViewProps {
  searchedLocation: Location | null;
}

export default function MapView({ searchedLocation }: MapViewProps) {
  const { center, zoom, isLocationAllowed } = useAppSelector((state) => state.map);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaveLocationModalOpen, setIsSaveLocationModalOpen] = useState(false);

  // Marker 클릭 핸들러
  const handleMarkerClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
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

        <Marker
          position={[center.lat, center.lng]}
          eventHandlers={{
            click: handleMarkerClick,
          }}
        />
      </MapContainer>

      <SearchLocationDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={searchedLocation}
        onSave={() => {
          setIsSaveLocationModalOpen(true);
          setIsModalOpen(false);
        }}
      />

      <SaveLocationModal
        isOpen={isSaveLocationModalOpen}
        onClose={() => setIsSaveLocationModalOpen(false)}
        data={searchedLocation}
      />
    </>
  );
}
