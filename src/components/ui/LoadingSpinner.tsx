import { useAppSelector } from '@/redux/hooks';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  const isLoading = useAppSelector((state) => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <div className="w-full h-full fixed inset-0 z-[99999] flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="flex items-center justify-center w-[300px] h-[150px] bg-white rounded-lg shadow-xl p-6 flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-sm text-gray-600 font-medium">로딩 중...</p>
      </div>
    </div>
  );
}
