import { useMemo, useState } from 'react';
import Modal, { ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import type { Location, SavedLocation } from '@/api';
import { stripHtmlTags } from '@/util/textUtil';
import { MapPin, Star, Tag, MessageSquare, Navigation } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '@/define/define';
import clsx from 'clsx';
import { useSaveLocation } from '@/api/hooks/useLocation';
import FileInput from '@/components/ui/FileInput';

interface SaveLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Location | null;
}

export default function SaveLocationModal({ isOpen, onClose, data }: SaveLocationModalProps) {
  const [review, setReview] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [rating, setRating] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);

  const { mutate: saveLocation } = useSaveLocation();

  // HTML 태그 제거
  const plainTitle = useMemo(() => {
    if (!data?.title) return '위치 정보';
    return stripHtmlTags(data.title);
  }, [data?.title]);

  const handleReview = (review: string) => {
    if (review.length > 500) {
      return;
    }
    setReview(review);
  };

  const handleSelectedCategory = (category: string) => {
    setSelectedCategory(category);
    setCustomCategory('');
  };

  const handleSave = () => {
    const finalCategory =
      selectedCategory === '기타' ? `기타 > ${customCategory.trim()}` : selectedCategory;

    if (selectedCategory === '기타' && !customCategory.trim()) {
      alert('카테고리를 입력해주세요.');
      return;
    }
    if (!finalCategory) {
      alert('카테고리를 선택하거나 입력해주세요.');
      return;
    }

    const savedData: SavedLocation = {
      id: new Date().getTime().toString(),
      name: plainTitle || '',
      address: data?.address || '',
      coordinates: { lat: Number(data?.mapx) / 1e7, lng: Number(data?.mapy) / 1e7 },
      category: finalCategory,
      review: review.trim(),
      rating,
      photos: photos.length > 0 ? photos : undefined,
      timestamp: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('저장할 데이터:', savedData);

    saveLocation(savedData, {
      onSuccess: () => {
        alert('위치가 저장되었습니다!');
        handleClose();
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  const handleClose = () => {
    setReview('');
    setSelectedCategory('');
    setCustomCategory('');
    setRating(0);
    setPhotos([]);
    onClose();
  };

  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="위치 저장" size="lg">
      <ModalBody>
        <div className="space-y-6 px-6 py-4">
          {/* 장소 이름 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>장소 이름</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900 font-medium">{plainTitle}</p>
            </div>
          </div>

          {/* 주소 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Navigation className="w-4 h-4 text-green-600" />
              <span>주소</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700">{data.roadAddress || data.address}</p>
            </div>
          </div>

          {/* 별점 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>별점</span>
            </div>
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
          </div>

          {/* 카테고리 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Tag className="w-4 h-4 text-purple-600" />
              <span>카테고리</span>
            </div>

            <div className="space-y-3">
              {/* 기본 카테고리 선택 */}
              <div className="grid grid-cols-3 gap-2">
                {DEFAULT_CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    onClick={() => {
                      handleSelectedCategory(category);
                    }}
                    className={clsx(
                      'px-3 py-2 text-sm rounded-lg border-2 transition-all',
                      selectedCategory === category &&
                        'border-blue-500 bg-blue-50 text-blue-700 font-medium',
                    )}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* 커스텀 카테고리 입력 */}
              {selectedCategory === '기타' && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">또는 직접 입력</label>
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
          </div>

          {/* 리뷰 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MessageSquare className="w-4 h-4 text-orange-600" />
              <span>나만의 리뷰</span>
            </div>
            <textarea
              value={review}
              onChange={(e) => handleReview(e.target.value)}
              placeholder="이 장소에 대한 당신만의 메모를 남겨보세요."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500">{review.length} / 500자</p>
          </div>

          {/* 사진 첨부 */}
          <FileInput setPhotos={setPhotos} photos={photos} />
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={handleClose}>
          취소
        </Button>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          저장하기
        </Button>
      </ModalFooter>
    </Modal>
  );
}
