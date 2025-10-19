import { useState } from 'react';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/button';
import type { SavedLocation } from '@/api';
import {
  MapPin,
  Star,
  Tag,
  MessageSquare,
  Navigation,
  Pencil,
  Trash2,
  Calendar,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

interface LocationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SavedLocation | null;
  onEdit?: (data: SavedLocation) => void;
  onDelete?: (id: string) => void;
}

export default function LocationDetailModal({
  isOpen,
  onClose,
  data,
  onEdit,
  onDelete,
}: LocationDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!data) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(data);
    }
  };

  const handleDelete = () => {
    if (showDeleteConfirm && onDelete && data.id) {
      onDelete(data.id);
      onClose();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="위치 상세 정보" size="lg">
      <ModalBody>
        <div className="space-y-6 px-6 py-4">
          {/* 장소 이름 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>장소 이름</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900 font-semibold text-lg">{data.name}</p>
            </div>
          </div>

          {/* 주소 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Navigation className="w-4 h-4 text-green-600" />
              <span>주소</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700">{data.address}</p>
              {data.coordinates && (
                <p className="text-xs text-gray-500 mt-2">
                  위도: {data.coordinates.lat.toFixed(6)}, 경도: {data.coordinates.lng.toFixed(6)}
                </p>
              )}
            </div>
          </div>

          {/* 별점 */}
          {data.rating > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>별점</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= data.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600 font-medium">{data.rating}.0</span>
              </div>
            </div>
          )}

          {/* 카테고리 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Tag className="w-4 h-4 text-purple-600" />
              <span>카테고리</span>
            </div>
            <div className="inline-flex">
              <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {data.category}
              </span>
            </div>
          </div>

          {/* 리뷰 */}
          {data.review && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MessageSquare className="w-4 h-4 text-orange-600" />
                <span>나만의 리뷰</span>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{data.review}</p>
              </div>
            </div>
          )}

          {/* 저장 날짜 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>저장 날짜</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div>
                <span className="text-gray-500">저장:</span>{' '}
                <span className="font-medium">
                  {dayjs(data.timestamp).format('YYYY년 MM월 DD일 HH:mm')}
                </span>
              </div>
              {data.updatedAt && data.updatedAt !== data.timestamp && (
                <div>
                  <span className="text-gray-500">수정:</span>{' '}
                  <span className="font-medium">
                    {dayjs(data.updatedAt).format('YYYY년 MM월 DD일 HH:mm')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        {!showDeleteConfirm ? (
          <>
            {onDelete && (
              <Button variant="destructive" onClick={handleDelete} className="mr-auto">
                <Trash2 className="w-4 h-4" />
                삭제
              </Button>
            )}
            <Button variant="outline" onClick={handleClose}>
              닫기
            </Button>
            {onEdit && (
              <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                <Pencil className="w-4 h-4" />
                수정
              </Button>
            )}
          </>
        ) : (
          <>
            <p className="mr-auto text-sm text-red-600 font-medium">정말 삭제하시겠습니까?</p>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
              삭제 확인
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}
