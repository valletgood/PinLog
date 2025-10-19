import { useMemo } from 'react';
import Modal, { ModalFooter } from '../ui/Modal';
import { Button } from '../ui/button';
import type { MarkerInfo } from './MapView';
import { stripHtmlTags } from '@/util/textUtil';

interface SearchLocationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: MarkerInfo | null;
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onSave: () => void;
}

export default function SearchLocationDetailModal({
  isOpen,
  onClose,
  data,
  size,
  onSave,
}: SearchLocationDetailModalProps) {
  // HTML 태그를 제거한 순수 텍스트 title
  const plainTitle = useMemo(() => {
    if (!data?.title) return '위치 정보';
    return stripHtmlTags(data.title);
  }, [data?.title]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={plainTitle} size={size}>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">이름</h3>
          <p className="text-gray-900">{plainTitle}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">줌 레벨</h3>
          {/* <p className="text-gray-900">{description}</p> */}
        </div>
      </div>

      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          닫기
        </Button>
        <Button onClick={onSave}>저장</Button>
      </ModalFooter>
    </Modal>
  );
}
