import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import MapView from "@/components/Map";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

// 模拟数据类型
type MarkerType = "user" | "feed";

interface MapMarker {
  id: number;
  lat: number;
  lng: number;
  type: MarkerType;
  title: string;
  avatar?: string;
  image?: string;
}

export default function MapPage() {
  const [activeSegment, setActiveSegment] = useState<"encounter" | "friends" | "feed">("encounter");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  // 模拟数据
  const mockData: MapMarker[] = [
    { id: 1, lat: 39.9042, lng: 116.4074, type: "user", title: "Alice", avatar: "A" },
    { id: 2, lat: 39.915, lng: 116.404, type: "user", title: "Bob", avatar: "B" },
    { id: 3, lat: 39.908, lng: 116.397, type: "feed", title: "周末聚会", avatar: "🎉" },
    { id: 4, lat: 39.902, lng: 116.415, type: "feed", title: "咖啡时光", avatar: "☕️" },
    { id: 5, lat: 39.912, lng: 116.420, type: "user", title: "Charlie", avatar: "C" }, // 好友
  ];

  // 初始化地图
  const handleMapReady = (map: google.maps.Map) => {
    setMapInstance(map);
    // 设置中心点为北京
    map.setCenter({ lat: 39.9042, lng: 116.4074 });
    map.setZoom(14);
    
    // 移除默认控件以保持界面整洁
    map.setOptions({
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });
  };

  // 更新 Markers
  useEffect(() => {
    if (!mapInstance) return;

    // 清除旧 Markers
    markers.forEach(marker => marker.setMap(null));

    const newMarkers: google.maps.Marker[] = [];

    // 根据 Segment 筛选数据
    const filteredData = mockData.filter(item => {
      if (activeSegment === "encounter") return item.type === "user"; // 偶遇显示所有用户
      if (activeSegment === "friends") return item.type === "user" && item.id === 5; // 模拟好友筛选
      if (activeSegment === "feed") return item.type === "feed";
      return true;
    });

    filteredData.forEach(item => {
      // 使用 svg path 绘制更复杂的 marker
      // 圆形底座 + 头像文字
      const svgColor = item.type === "user" ? "#FF6B6B" : "#9F7AEA";
      
      // 简单的圆形 Marker，带边框
      const svgIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: svgColor,
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#FFFFFF",
        scale: 12, // 稍微大一点
        labelOrigin: new google.maps.Point(0, 0),
      };

      const marker = new google.maps.Marker({
        position: { lat: item.lat, lng: item.lng },
        map: mapInstance,
        title: item.title,
        icon: svgIcon,
        label: {
          text: item.avatar || "",
          color: "white",
          fontSize: "10px",
          fontWeight: "bold",
        },
        animation: google.maps.Animation.DROP,
      });

      // 添加点击事件
      marker.addListener("click", () => {
        // 这里可以添加点击 Marker 后的逻辑，比如弹出详情
        console.log("Clicked:", item.title);
        // 简单的 InfoWindow
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; text-align: center;">
              <div style="font-weight: bold; margin-bottom: 4px;">${item.title}</div>
              <div style="font-size: 12px; color: #666;">${item.type === 'user' ? '刚刚活跃' : '发布了动态'}</div>
            </div>
          `,
        });
        infoWindow.open(mapInstance, marker);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

  }, [mapInstance, activeSegment]);

  return (
    <Layout>
      <div className="relative h-screen w-full">
        {/* 顶部悬浮区域 */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 space-y-3 bg-gradient-to-b from-white/90 to-transparent pb-8 pointer-events-none">
          {/* 搜索框 */}
          <div className="relative shadow-sm pointer-events-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="搜索用户、动态..." 
              className="pl-9 bg-white/90 backdrop-blur-md border-none rounded-full h-10 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Segment 标签栏 */}
          <div className="flex justify-center pointer-events-auto">
            <div className="flex bg-white/90 backdrop-blur-md rounded-full p-1 shadow-sm border border-white/20">
              <button
                onClick={() => setActiveSegment("encounter")}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  activeSegment === "encounter" 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                偶遇
              </button>
              <button
                onClick={() => setActiveSegment("friends")}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  activeSegment === "friends" 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                好友
              </button>
              <button
                onClick={() => setActiveSegment("feed")}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  activeSegment === "feed" 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                动态
              </button>
            </div>
          </div>
        </div>

        {/* 地图组件 */}
        <div className="w-full h-full">
          <MapView onMapReady={handleMapReady} />
        </div>

        {/* 底部图例/说明 (可选) */}
        <div className="absolute bottom-24 right-4 z-10 flex flex-col gap-2 pointer-events-none">
          <Badge variant="outline" className="bg-white/90 backdrop-blur shadow-sm gap-1 pointer-events-auto">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-xs">用户</span>
          </Badge>
          <Badge variant="outline" className="bg-white/90 backdrop-blur shadow-sm gap-1 pointer-events-auto">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-xs">动态</span>
          </Badge>
        </div>
      </div>
    </Layout>
  );
}
