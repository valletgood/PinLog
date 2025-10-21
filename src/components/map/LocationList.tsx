import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Settings, ChevronRight, ChevronDown, MapPin, Star, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SavedLocation } from '@/api';
import { setCenter, setZoom } from '@/redux/slices/mapSlice';
import { useAppDispatch } from '@/redux/hooks';
import { useState, useMemo } from 'react';
import { DEFAULT_CATEGORIES } from '@/define/define';

export default function LocationList({ list }: { list: SavedLocation[] }) {
  const dispatch = useAppDispatch();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // 카테고리별로 그룹화
  const groupedLocations = useMemo(() => {
    const groups: Record<string, SavedLocation[]> = {};

    list.forEach((item) => {
      const category = item.category || '기타';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });

    // 카테고리별로 정렬 (기본 카테고리 순서대로)
    const sortedGroups: Record<string, SavedLocation[]> = {};

    // 먼저 기본 카테고리 순서대로
    DEFAULT_CATEGORIES.forEach((category) => {
      if (groups[category]) {
        sortedGroups[category] = groups[category].sort((a, b) => a.name.localeCompare(b.name));
      }
    });

    // 그 다음 기타 카테고리들 (DEFAULT_CATEGORIES에 없는 모든 카테고리를 "기타"로 그룹화)
    const otherCategories: SavedLocation[] = [];
    Object.keys(groups).forEach((category) => {
      if (!DEFAULT_CATEGORIES.includes(category)) {
        otherCategories.push(...groups[category]);
      }
    });

    if (otherCategories.length > 0) {
      sortedGroups['기타'] = otherCategories.sort((a, b) => a.name.localeCompare(b.name));
    }
    console.log(sortedGroups);
    return sortedGroups;
  }, [list]);

  // 카테고리 토글
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // 모든 카테고리 확장/축소
  const toggleAllCategories = () => {
    if (expandedCategories.size === Object.keys(groupedLocations).length) {
      setExpandedCategories(new Set());
    } else {
      setExpandedCategories(new Set(Object.keys(groupedLocations)));
    }
  };

  const handleClickLocation = (item: SavedLocation) => {
    const lon = Number(item.coordinates.lng);
    const lat = Number(item.coordinates.lat);
    dispatch(setCenter({ lat: lon, lng: lat }));
    dispatch(setZoom(17));
  };

  // 카테고리 아이콘 매핑
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      맛집: <Tag className="w-4 h-4 text-orange-500" />,
      카페: <Tag className="w-4 h-4 text-amber-500" />,
      관광지: <Tag className="w-4 h-4 text-blue-500" />,
      기타: <Tag className="w-4 h-4 text-green-500" />,
      쇼핑: <Tag className="w-4 h-4 text-pink-500" />,
    };
    return iconMap[category] || <Tag className="w-4 h-4 text-gray-400" />;
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-3 py-2 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-sidebar-foreground">
                  내 리뷰 ({list.length})
                </h2>
                <Button variant="ghost" size="sm" onClick={toggleAllCategories} className="text-xs">
                  {expandedCategories.size === Object.keys(groupedLocations).length
                    ? '전체 접기'
                    : '전체 펼치기'}
                </Button>
              </div>
            </div>

            <SidebarMenu className="mt-2">
              {Object.entries(groupedLocations).map(([category, locations]) => (
                <SidebarMenuItem key={category} className="h-fit">
                  <SidebarMenuButton
                    onClick={() => toggleCategory(category)}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category)}
                      <span className="font-medium text-sm">{category}</span>
                      <span className="text-xs text-sidebar-foreground/60">
                        ({locations.length})
                      </span>
                    </div>
                    {expandedCategories.has(category) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </SidebarMenuButton>

                  {expandedCategories.has(category) && (
                    <SidebarMenuSub>
                      {locations.map((item) => (
                        <SidebarMenuSubItem key={item.id}>
                          <SidebarMenuSubButton
                            onClick={() => handleClickLocation(item)}
                            className="flex items-start gap-3 py-2 h-fit cursor-pointer"
                          >
                            <MapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-sidebar-foreground truncate">
                                  {item.name}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs text-sidebar-foreground/60">
                                    {item.rating}.0
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs text-sidebar-foreground/60 line-clamp-2">
                                {item.address}
                              </span>
                              {item.review && (
                                <span className="text-xs text-sidebar-foreground/50 line-clamp-1">
                                  "{item.review}"
                                </span>
                              )}
                            </div>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}

              {list.length === 0 && (
                <div className="px-3 py-8 text-center">
                  <MapPin className="w-8 h-8 text-sidebar-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-sidebar-foreground/60">저장된 위치가 없습니다.</p>
                  <p className="text-xs text-sidebar-foreground/40 mt-1">
                    지도에서 위치를 검색하고 저장해보세요.
                  </p>
                </div>
              )}
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
