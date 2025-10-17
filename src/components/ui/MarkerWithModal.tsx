import { Marker } from 'react-leaflet';
import { useState } from 'react';
import Modal, { ModalFooter } from './Modal';
import { Button } from './button';
import type { LatLngExpression } from 'leaflet';

interface MarkerData {
  id: string;
  position: LatLngExpression;
  title: string;
  description?: string;
  content?: React.ReactNode;
  [key: string]: any;
}

interface MarkerWithModalProps {
  data: MarkerData;
  icon?: L.Icon | L.DivIcon;
  onSave?: (data: MarkerData) => void;
  onDelete?: (id: string) => void;
  renderModalContent?: (data: MarkerData) => React.ReactNode;
}

/**
 * 클릭 시 Modal을 띄우는 Marker 컴포넌트
 * 재사용 가능하도록 설계됨
 */
export default function MarkerWithModal({
  data,
  icon,
  onSave,
  onDelete,
  renderModalContent,
}: MarkerWithModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMarkerClick = () => {
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(data.id);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <Marker
        position={data.position}
        icon={icon}
        eventHandlers={{
          click: handleMarkerClick,
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={data.title}
        size="md"
      >
        {renderModalContent ? (
          renderModalContent(data)
        ) : (
          <div className="space-y-3">
            {data.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">설명</h3>
                <p className="text-gray-600">{data.description}</p>
              </div>
            )}

            {data.content}
          </div>
        )}

        <ModalFooter>
          {onDelete && (
            <Button variant="destructive" onClick={handleDelete} className="mr-auto">
              삭제
            </Button>
          )}
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            닫기
          </Button>
          {onSave && <Button onClick={handleSave}>저장</Button>}
        </ModalFooter>
      </Modal>
    </>
  );
}
