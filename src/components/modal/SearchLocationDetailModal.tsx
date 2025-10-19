import { useMemo } from 'react';
import Modal, { ModalFooter } from '../ui/Modal';
import { Button } from '../ui/button';
import type { Location } from '@/api';
import { stripHtmlTags } from '@/util/textUtil';

interface SearchLocationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Location | null;
  onSave: () => void;
}

export default function SearchLocationDetailModal({
  isOpen,
  onClose,
  data,
  onSave,
}: SearchLocationDetailModalProps) {
  // HTML 태그를 제거한 순수 텍스트 title
  const plainTitle = useMemo(() => {
    if (!data?.title) return '위치 정보';
    return stripHtmlTags(data.title);
  }, [data?.title]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="위치 정보" size="lg">
      <div className="space-y-4 px-6 py-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">이름</h3>
          <p className="text-gray-900">{plainTitle}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">주소</h3>
          <p className="text-gray-900">{data?.address}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">카테고리</h3>
          <p className="text-gray-900">{data?.category}</p>
        </div>
      </div>

      <ModalFooter className="mt-2">
        <Button variant="outline" onClick={onClose}>
          닫기
        </Button>
        <Button onClick={onSave}>저장</Button>
      </ModalFooter>
    </Modal>
  );
}
