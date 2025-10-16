import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput,
} from '@/components/ui/sidebar';
import { Home, Inbox, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Menu items.
const items = [
  {
    title: '위치 1',
    address: '서울특별시 중구 퇴계로 100',
    icon: Home,
  },
  {
    title: '위치 2',
    address: '서울특별시 중구 퇴계로 100',
    icon: Inbox,
  },
  {
    title: '위치 3',
    address: '서울특별시 중구 퇴계로 100',
    icon: Calendar,
  },
];

export default function LocationList() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-6">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="h-fit">
                  <SidebarMenuButton asChild>
                    <Button
                      variant="ghost"
                      align="left"
                      className="flex items-start gap-3 py-3 h-fit"
                    >
                      <item.icon className="mt-0.5 shrink-0" />
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span className="font-semibold text-sm text-sidebar-foreground truncate">
                          {item.title}
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
