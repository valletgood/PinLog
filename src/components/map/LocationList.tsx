import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SavedLocation } from '@/api';
import { setCenter } from '@/redux/slices/mapSlice';
import { useAppDispatch } from '@/redux/hooks';

export default function LocationList({ list }: { list: SavedLocation[] }) {
  const dispatch = useAppDispatch();
  const handleClickLocation = (item: SavedLocation) => {
    const lon = Number(item.coordinates.lng);
    const lat = Number(item.coordinates.lat);
    dispatch(setCenter({ lat: lon, lng: lat }));
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-6">
              {list.map((item) => (
                <SidebarMenuItem key={item.name} className="h-fit">
                  <SidebarMenuButton asChild>
                    <Button
                      variant="ghost"
                      align="left"
                      className="flex items-start gap-3 py-3 h-fit"
                      onClick={() => handleClickLocation(item)}
                    >
                      {/* <item.icon className="mt-0.5 shrink-0" /> */}
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span className="font-semibold text-sm text-sidebar-foreground truncate">
                          {item.name}
                        </span>
                        <span className="text-xs text-sidebar-foreground/60 line-clamp-2">
                          {item.address}
                        </span>
                      </div>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton asChild>
          <Button variant="ghost" align="left" className="flex items-center gap-2">
            <Settings />
            <span>설정</span>
          </Button>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
