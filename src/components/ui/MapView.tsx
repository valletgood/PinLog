import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppSelector } from '@/redux/hooks';
import MapEventHandler from './MapEventHandler';
import { useState, useMemo } from 'react';
import Modal, { ModalFooter } from './Modal';
import { Button } from './button';
import type { Location } from '@/api';
import { stripHtmlTags } from '@/util/textUtil';

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

interface MarkerInfo {
  lat: number;
  lng: number;
  title: string;
  description?: string;
}

export default function MapView({ searchedLocation }: MapViewProps) {
  const { center, zoom, isLocationAllowed } = useAppSelector((state) => state.map);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null);

  // HTML 태그를 제거한 순수 텍스트 title
  const plainTitle = useMemo(() => {
    if (!searchedLocation?.title) return '위치 정보';
    return stripHtmlTags(searchedLocation.title);
  }, [searchedLocation?.title]);

  // Marker 클릭 핸들러
  const handleMarkerClick = () => {
    setSelectedMarker({
      lat: center.lat,
      lng: center.lng,
      title: isLocationAllowed ? '현재 위치' : '서울 중심부',
      description: '이 위치에 대한 상세 정보를 표시합니다.',
    });
    setIsModalOpen(true);
  };

  console.log(searchedLocation);

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

      {/* Marker 클릭 시 표시되는 Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="위치 정보" size="xl">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">이름</h3>
            <p className="text-gray-900">{plainTitle}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">줌 레벨</h3>
            <p className="text-gray-900">{zoom}</p>
          </div>

          {selectedMarker?.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">설명</h3>
              <p className="text-gray-600">{selectedMarker.description}</p>
            </div>
          )}
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            닫기
          </Button>
          <Button onClick={() => console.log('저장:', selectedMarker)}>저장</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
