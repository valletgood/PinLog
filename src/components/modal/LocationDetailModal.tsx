import { useState, useEffect } from 'react';
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
  Save,
  X,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { DEFAULT_CATEGORIES } from '@/define/define';
import { useUpdateLocation } from '@/api/hooks/useLocation';
import clsx from 'clsx';

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
  const [isEditMode, setIsEditMode] = useState(false);

  // 수정 모드 상태
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [review, setReview] = useState('');

  const { mutate: updateLocation } = useUpdateLocation();

  // 데이터가 변경될 때 상태 초기화
  useEffect(() => {
    if (data) {
      const category = data.category.includes('기타') ? '기타' : data.category;
      const customCategory = data.category.includes('기타') ? data.category.split(' > ')[1] : '';
      setRating(data.rating || 0);
      setCategory(category || '');
      setCustomCategory(customCategory || '');
      setReview(data.review || '');
      setIsEditMode(false);
      setShowDeleteConfirm(false);
    }
  }, [data]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSelectedCategory = (category: string) => {
    setCategory(category);
    setCustomCategory('');
  };

  const handleSave = () => {
    if (!data) return;

    const finalCategory = category === '기타' ? `기타 > ${customCategory.trim()}` : category;

    if (category === '기타' && !customCategory.trim()) {
      alert('카테고리를 입력해주세요.');
      return;
    }
    if (!finalCategory) {
      alert('카테고리를 선택하거나 입력해주세요.');
      return;
    }

    const updatedData: SavedLocation = {
      ...data,
      rating,
      category: finalCategory,
      review: review.trim(),
      updatedAt: new Date().toISOString(),
    };

    updateLocation(updatedData, {
      onSuccess: () => {
        setIsEditMode(false);
        alert('수정이 완료되었습니다!');
        onClose();
      },
      onError: (error) => {
        console.error('수정 실패:', error);
        alert('수정에 실패했습니다.');
      },
    });
  };

  const handleCancel = () => {
    // 원래 데이터로 되돌리기
    if (data) {
      setRating(data.rating || 0);
      setCategory(data.category || '');
      setCustomCategory('');
      setReview(data.review || '');
    }
    setIsEditMode(false);
  };

  const handleDelete = () => {
    if (showDeleteConfirm && onDelete && data?.id) {
      onDelete(data.id);
      onClose();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleClose = () => {
    setShowDeleteConfirm(false);
    setIsEditMode(false);
    onClose();
  };

  const handleReview = (review: string) => {
    if (review.length > 500) {
      return;
    }
    setReview(review);
  };

  if (!data) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? '위치 상세 수정' : '위치 상세 정보'}
      size="lg"
    >
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
            </div>
          </div>

          {/* 별점 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>별점</span>
            </div>

            {isEditMode ? (
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <button
                    type="button"
                    onClick={() => setRating(0)}
                    className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    초기화
                  </button>
                )}
              </div>
            ) : (
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
                {data.rating > 0 && (
                  <span className="ml-2 text-sm text-gray-600 font-medium">{data.rating}.0</span>
                )}
              </div>
            )}
          </div>

          {/* 카테고리 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Tag className="w-4 h-4 text-purple-600" />
              <span>카테고리</span>
            </div>

            {isEditMode ? (
              <div className="space-y-3">
                {/* 기본 카테고리 선택 */}
                <div className="grid grid-cols-3 gap-2">
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <Button
                      key={cat}
                      variant="outline"
                      onClick={() => {
                        handleSelectedCategory(cat);
                      }}
                      className={clsx(
                        'px-3 py-2 text-sm rounded-lg border-2 transition-all',
                        category === cat && 'border-blue-500 bg-blue-50 text-blue-700 font-medium',
                      )}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>

                {/* 커스텀 카테고리 입력 */}
                {category === '기타' && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">직접 입력</label>
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => {
                        setCustomCategory(e.target.value);
                      }}
                      placeholder="예: 데이트 장소, 출장지 등"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="inline-flex">
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {data.category}
                </span>
              </div>
            )}
          </div>

          {/* 리뷰 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MessageSquare className="w-4 h-4 text-orange-600" />
              <span>나만의 리뷰</span>
            </div>

            {isEditMode ? (
              <div>
                <textarea
                  value={review}
                  onChange={(e) => handleReview(e.target.value)}
                  placeholder="이 장소에 대한 당신만의 메모를 남겨보세요."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{review.length} / 500자</p>
              </div>
            ) : (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {data.review || '리뷰가 없습니다.'}
                </p>
              </div>
            )}
          </div>

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
            {!isEditMode ? (
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
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4" />
                  취소
                </Button>
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4" />
                  저장
                </Button>
              </>
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
