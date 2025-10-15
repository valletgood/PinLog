import { Input } from '@/components/ui/input';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';

// 더미 데이터
const dummySearchResults = [
  {
    id: 1,
    name: '강남역',
    address: '서울특별시 강남구 역삼동 강남대로 지하 396',
  },
  {
    id: 2,
    name: '서울특별시청',
    address: '서울특별시 중구 세종대로 110',
  },
  {
    id: 3,
    name: '롯데월드타워',
    address: '서울특별시 송파구 올림픽로 300',
  },
  {
    id: 4,
    name: 'N서울타워',
    address: '서울특별시 용산구 남산공원길 105',
  },
  {
    id: 5,
    name: '경복궁',
    address: '서울특별시 종로구 사직로 161',
  },
];

export default function SearchLocation() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showResults, setShowResults] = useState(true);
  const [inputWidth, setInputWidth] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Input 너비 측정
  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(inputRef.current.offsetWidth);
    }
  }, []);

  const handleSearchKeyword = (keyword: string) => {
    setSearchKeyword(keyword);
    // 입력이 있으면 결과 표시
    setShowResults(keyword.length > 0);
  };

  const handleSearch = () => {
    console.log('검색');
  };

  return (
    <div className="absolute top-7 left-7 z-[9999] w-100">
      <div className="flex items-center gap-3">
        <Input
          ref={inputRef}
          className="h-12 bg-white shadow-lg rounded-lg"
          placeholder="위치를 검색하세요..."
          value={searchKeyword}
          onChange={(e) => handleSearchKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          variant="secondary"
          className="flex items-center gap-2 shadow-lg h-12 px-6"
          onClick={handleSearch}
        >
          <Search className="w-4 h-4" />
          검색
        </Button>
      </div>

      {/* 검색 결과 - Input 너비와 동일 */}
      {showResults && (
        <div
          className="mt-2 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
          style={{ width: `${inputWidth}px` }}
        >
          <div className="max-h-96 overflow-y-auto">
            {dummySearchResults.map((location) => (
              <Button
                variant="ghost"
                align="default"
                key={location.id}
                className="w-full h-fit py-3 px-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 rounded-none items-start gap-3"
              >
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5 items-start flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 text-left truncate w-full">
                    {location.name}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2 w-full text-left">
                    {location.address}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
