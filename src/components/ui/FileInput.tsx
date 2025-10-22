import { type ChangeEvent, useRef, type Dispatch, type SetStateAction } from 'react';
import { Button } from './button';
import { Camera, X, Image as ImageIcon } from 'lucide-react';
import { convertToBase64 } from '@/util/photoUtil';

interface FileInputProps {
  setPhotos: Dispatch<SetStateAction<string[]>>;
  photos: string[];
}

export default function FileInput({ setPhotos, photos }: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 사진 업로드 핸들러
  const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPhotos: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} 파일이 너무 큽니다. 5MB 이하의 파일을 선택해주세요.`);
        continue;
      }

      // 이미지 파일 타입 확인
      if (!file.type.startsWith('image/')) {
        alert(`${file.name}은(는) 이미지 파일이 아닙니다.`);
        continue;
      }

      try {
        const base64 = await convertToBase64(file);
        newPhotos.push(base64);
      } catch (error) {
        console.error('파일 변환 중 오류:', error);
        alert(`${file.name} 파일 변환 중 오류가 발생했습니다.`);
      }
    }

    if (newPhotos.length > 0) {
      setPhotos((prev) => [...prev, ...newPhotos].slice(0, 10)); // 최대 10장 제한
    }

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 사진 삭제 핸들러
  const handlePhotoRemove = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // 사진 업로드 버튼 클릭 핸들러
  const handlePhotoUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Camera className="w-4 h-4 text-pink-600" />
        <span>사진 첨부</span>
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* 사진 업로드 버튼 */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handlePhotoUploadClick}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 hover:border-pink-400 hover:bg-pink-50 transition-colors"
          disabled={photos.length >= 10}
        >
          <ImageIcon className="w-4 h-4" />
          <span>사진 추가</span>
        </Button>
        <p className="text-xs text-gray-500">{photos.length} / 10장 (최대 5MB)</p>
      </div>

      {/* 사진 미리보기 */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo}
                alt={`첨부된 사진 ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => handlePhotoRemove(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
