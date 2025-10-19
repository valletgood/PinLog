import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppSelector } from '@/redux/hooks';
import MapEventHandler from './MapEventHandler';
import { useMemo, useState } from 'react';
import SearchLocationDetailModal from '@/components/modal/SearchLocationDetailModal';
import LocationDetailModal from '@/components/modal/LocationDetailModal';
import type { Location, SavedLocation } from '@/api';
import SaveLocationModal from '@/components/modal/SaveLocationModal';
import { useDeleteLocation } from '@/api/hooks/useLocation';

// Leaflet 기본 마커 아이콘 설정 (Webpack 이슈 해결)
type IconDefaultPrototype = typeof L.Icon.Default.prototype & { _getIconUrl?: () => string };
delete (L.Icon.Default.prototype as IconDefaultPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// 검색된 위치 전용 아이콘 (파란색)
const searchedIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// 저장된 위치 전용 아이콘 (빨간색 - 기본)
const savedIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapViewProps {
  searchedLocation: Location | null;
  list: SavedLocation[];
}

export default function MapView({ searchedLocation, list }: MapViewProps) {
  const { center, zoom } = useAppSelector((state) => state.map);
  const { mutate: deleteLocation } = useDeleteLocation();

  // 모달 상태
  const [isSearchDetailModalOpen, setIsSearchDetailModalOpen] = useState(false);
  const [isLocationDetailModalOpen, setIsLocationDetailModalOpen] = useState(false);
  const [isSaveLocationModalOpen, setIsSaveLocationModalOpen] = useState(false);

  // 선택된 위치
  const [selectedSavedLocation, setSelectedSavedLocation] = useState<SavedLocation | null>(null);

  // 저장된 위치 마커 클릭 핸들러
  const handleSavedMarkerClick = (location: SavedLocation) => {
    setSelectedSavedLocation(location);
    setIsLocationDetailModalOpen(true);
  };

  // 검색된 위치 마커 클릭 핸들러
  const handleSearchedMarkerClick = () => {
    setIsSearchDetailModalOpen(true);
  };

  // 검색된 위치의 좌표 변환
  const searchedPosition = useMemo(() => {
    if (!searchedLocation?.mapx || !searchedLocation?.mapy) return null;
    return {
      lat: Number(searchedLocation.mapy) / 1e7,
      lng: Number(searchedLocation.mapx) / 1e7,
    };
  }, [searchedLocation]);

  const handleSaveFromSearch = () => {
    setIsSearchDetailModalOpen(false);
    setIsSaveLocationModalOpen(true);
  };

  const handleEdit = (data: SavedLocation) => {
    // TODO: 수정 모달로 전환 (SaveLocationModal을 수정 모드로)
    console.log('수정:', data);
    setIsLocationDetailModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteLocation(id, {
      onSuccess: () => {
        setIsLocationDetailModalOpen(false);
        setSelectedSavedLocation(null);
      },
      onError: (error) => {
        console.error('삭제 실패:', error);
        alert('삭제에 실패했습니다.');
      },
    });
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

        {/* 저장된 위치 마커 (빨간색) */}
        {list.map((item) => (
          <Marker
            key={item.id}
            position={[item.coordinates.lng, item.coordinates.lat]}
            icon={savedIcon}
            eventHandlers={{
              click: () => handleSavedMarkerClick(item),
            }}
          />
        ))}

        {/* 검색된 위치 마커 (파란색) */}
        {searchedPosition && (
          <Marker
            position={[searchedPosition.lat, searchedPosition.lng]}
            icon={searchedIcon}
            eventHandlers={{
              click: handleSearchedMarkerClick,
            }}
          />
        )}
      </MapContainer>

      {/* 검색된 위치 상세 모달 */}
      <SearchLocationDetailModal
        isOpen={isSearchDetailModalOpen}
        onClose={() => setIsSearchDetailModalOpen(false)}
        data={searchedLocation}
        onSave={handleSaveFromSearch}
      />

      {/* 저장된 위치 상세 모달 */}
      <LocationDetailModal
        isOpen={isLocationDetailModalOpen}
        onClose={() => setIsLocationDetailModalOpen(false)}
        data={selectedSavedLocation}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* 위치 저장 모달 */}
      <SaveLocationModal
        isOpen={isSaveLocationModalOpen}
        onClose={() => setIsSaveLocationModalOpen(false)}
        data={searchedLocation}
      />
    </>
  );
}
