import { Input } from '@/components/ui/input';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';
import { useLocationSearch } from '@/api/hooks/useLocation';
import type { Location } from '@/api';
import { useAppDispatch } from '@/redux/hooks';
import { setCenter } from '@/redux/slices/mapSlice';

export default function SearchLocation() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<Location[]>([]);
  const [inputWidth, setInputWidth] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { data, refetch: refetchLocationSearch } = useLocationSearch(query);

  // Input 너비 측정
  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(inputRef.current.offsetWidth);
    }
  }, []);

  const handleSearchKeyword = (keyword: string) => {
    setSearchKeyword(keyword);
    if (showResults) {
      setShowResults(false);
    }
  };

  const handleSearch = () => {
    if (searchKeyword === query) {
      refetchLocationSearch();
    } else {
      setQuery(searchKeyword);
    }
  };

  const handleClickLocation = (location: Location) => {
    const lon = Number(location.mapx) / 1e7;
    const lat = Number(location.mapy) / 1e7;
    dispatch(setCenter({ lat, lng: lon }));
    setShowResults(false);
  };

  useEffect(() => {
    if (data) {
      setResults(data.items);
      setShowResults(true);
    }
  }, [data]);

  return (
    <div className="absolute top-7 left-7 z-[9999] w-100">
      <div className="flex items-center gap-3">
        <Input
          ref={inputRef}
          className="h-12 bg-white shadow-lg rounded-lg"
          placeholder="위치를 검색하세요..."
          value={searchKeyword}
          onChange={(e) => handleSearchKeyword(e.target.value)}
        />
        <Button
          variant="outline"
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
            {results.map((location, index) => (
              <Button
                variant="ghost"
                align="default"
                key={index}
                className="w-full h-fit py-3 px-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 rounded-none items-start gap-3"
                onClick={() => handleClickLocation(location)}
              >
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5 items-start flex-1 min-w-0">
                  <div
                    className="font-semibold text-sm text-gray-900 text-left truncate w-full"
                    dangerouslySetInnerHTML={{ __html: location.title }}
                  ></div>
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
