import { Button } from '@/components/ui/button';
import Layout from '@/components/ui/Layout';
import MapView from '@/components/ui/MapView';
import { setCurrentLocation } from '@/redux/slices/mapSlice';
import { useAppDispatch } from '@/redux/hooks';
import { Crosshair } from 'lucide-react';
import { handleCurrentLocation } from '@/util/mapUtil';
import LocationList from '@/components/map/LocationList';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import SearchLocation from '@/components/map/SearchLocation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function MapPage() {
  const dispatch = useAppDispatch();

  const handleClickCurrentLocation = async () => {
    const location = await handleCurrentLocation();
    dispatch(setCurrentLocation(location));
  };

  return (
    <Layout>
      <LoadingSpinner />
      <SidebarProvider>
        <LocationList />
        <SidebarInset>
          <SearchLocation />
          <MapView />
          <Button
            className="absolute bottom-10 right-10 z-[9999] rounded-full w-10 h-10 shadow-lg bg-white hover:bg-gray-100"
            variant="default"
            onClick={handleClickCurrentLocation}
          >
            <Crosshair className="w-8 h-8 text-gray-800" />
          </Button>
        </SidebarInset>
      </SidebarProvider>
    </Layout>
  );
}
