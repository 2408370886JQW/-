import { useState, useRef, useCallback, useEffect } from "react";
import Layout from "@/components/Layout";
import { ArrowLeft, Heart, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import MapView from "@/components/Map";
import { createRoot } from "react-dom/client";

// Mock data - 谁喜欢了我
const WHO_LIKED_ME = [
  {
    id: 1,
    name: "小鹿",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    gender: "female",
    likedAt: new Date(Date.now() - 2 * 60 * 1000), // 2分钟前
    lat: 39.9055,
    lng: 116.4085,
  },
  {
    id: 2,
    name: "大卫",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    gender: "male",
    likedAt: new Date(2026, 1, 28, 14, 22), // 2026年2月28日 14:22 (当前年份)
    lat: 39.9120,
    lng: 116.4150,
  },
  {
    id: 3,
    name: "阿杰",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
    gender: "male",
    likedAt: new Date(2026, 1, 14, 17, 11), // 2026年2月14日 17:11 (当前年份)
    lat: 39.9000,
    lng: 116.3970,
  },
  {
    id: 4,
    name: "甜甜",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    gender: "female",
    likedAt: new Date(2025, 7, 24, 17, 11), // 2025年8月24日 17:11 (非当前年份)
    lat: 39.9180,
    lng: 116.4080,
  },
  {
    id: 5,
    name: "Leo",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    gender: "male",
    likedAt: new Date(2024, 7, 24, 17, 11), // 2024年8月24日 17:11 (非当前年份)
    lat: 39.9080,
    lng: 116.4200,
  },
];

// 时间格式化函数
function formatLikedTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = diffMs / (1000 * 60);

  // < 5分钟 → "刚刚"
  if (diffMinutes < 5) {
    return "刚刚";
  }

  const currentYear = now.getFullYear();
  const likedYear = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // 当前年份 → "月日 时间"
  if (likedYear === currentYear) {
    return `${month}月${day}日 ${hours}:${minutes}`;
  }

  // 非当前年份 → "年 月日 时间"
  return `${likedYear}年 ${month}月${day}日 ${hours}:${minutes}`;
}

export default function WhoLikedMePage() {
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  // 监听滚动到底部自动展示地图
  useEffect(() => {
    if (!listEndRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowMap(true);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(listEndRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    // 自定义Overlay类
    class CustomOverlay extends google.maps.OverlayView {
      private div: HTMLDivElement;
      private position: google.maps.LatLng;

      constructor(position: google.maps.LatLng, content: HTMLElement) {
        super();
        this.position = position;
        this.div = content as HTMLDivElement;
        this.div.style.position = "absolute";
        this.div.style.cursor = "pointer";
      }

      onAdd() {
        const panes = this.getPanes();
        if (panes) {
          panes.overlayMouseTarget.appendChild(this.div);
        }
      }

      draw() {
        const overlayProjection = this.getProjection();
        if (!overlayProjection) return;
        const point = overlayProjection.fromLatLngToDivPixel(this.position);
        if (point) {
          this.div.style.left = point.x + "px";
          this.div.style.top = point.y + "px";
          this.div.style.transform = "translate(-50%, -100%)";
        }
      }

      onRemove() {
        if (this.div.parentElement) {
          this.div.parentElement.removeChild(this.div);
        }
      }
    }

    // 为每个喜欢我的人添加地图标记
    const bounds = new google.maps.LatLngBounds();

    WHO_LIKED_ME.forEach((user) => {
      const position = new google.maps.LatLng(user.lat, user.lng);
      bounds.extend(position);

      const div = document.createElement("div");
      const root = createRoot(div);
      root.render(
        <div className="relative group">
          {/* 爱心光环 */}
          <div className="absolute -inset-2 bg-rose-400/30 rounded-full animate-pulse z-0" />
          {/* 头像 */}
          <div
            className={cn(
              "relative z-10 w-12 h-12 rounded-full border-[3px] shadow-lg overflow-hidden",
              user.gender === "female" ? "border-pink-500" : "border-blue-500"
            )}
            style={{
              borderColor:
                user.gender === "female" ? "#EC4899" : "#3B82F6",
            }}
          >
            <img
              src={user.avatar}
              className="w-full h-full object-cover"
              alt={user.name}
            />
          </div>
          {/* 爱心角标 */}
          <div className="absolute -top-1 -right-1 z-20 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
          </div>
          {/* 名字标签 */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white/90 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
            <span className="text-[10px] font-medium text-slate-700">
              {user.name}
            </span>
          </div>
        </div>
      );

      const overlay = new CustomOverlay(position, div);
      overlay.setMap(map);
    });

    // 自动缩放到包含所有标记的范围
    map.fitBounds(bounds, { top: 50, bottom: 50, left: 30, right: 30 });
  }, []);

  return (
    <Layout showNav={false}>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center justify-between px-4 h-14">
            <Link href="/profile">
              <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </button>
            </Link>
            <h1 className="text-lg font-bold text-slate-900">谁喜欢了我</h1>
            <div className="w-9" />
          </div>
        </div>

        {/* 统计信息 */}
        <div className="px-4 py-3 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span className="text-sm text-rose-700 font-medium">
              共 <span className="font-bold text-rose-600">{WHO_LIKED_ME.length}</span> 人喜欢了你
            </span>
          </div>
        </div>

        {/* 用户列表 */}
        <div className="divide-y divide-slate-100">
          {WHO_LIKED_ME.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 px-4 py-4 bg-white hover:bg-slate-50 transition-colors"
            >
              {/* 头像 */}
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full border-2 overflow-hidden",
                    user.gender === "female"
                      ? "border-pink-400"
                      : "border-blue-400"
                  )}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* 小爱心角标 */}
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Heart className="w-2.5 h-2.5 fill-white text-white" />
                </div>
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-[15px]">
                    {user.name}
                  </span>
                  <span className="text-xs text-rose-500 font-medium">
                    喜欢了你
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs text-slate-400">
                    {formatLikedTime(user.likedAt)}
                  </span>
                </div>
              </div>

              {/* 爱心图标 */}
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500 shrink-0" />
            </div>
          ))}
        </div>

        {/* 列表底部触发器 */}
        <div ref={listEndRef} className="h-1" />

        {/* 喜欢地图区域 */}
        <div className="px-4 pt-4 pb-8">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-rose-500" />
            <h2 className="text-base font-bold text-slate-900">喜欢地图</h2>
            <span className="text-xs text-slate-400">
              查看喜欢你的人都在哪里
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
            {showMap ? (
              <div className="h-[350px]">
                <MapView
                  initialCenter={{ lat: 39.908, lng: 116.41 }}
                  initialZoom={14}
                  onMapReady={handleMapReady}
                />
              </div>
            ) : (
              <div className="h-[350px] flex items-center justify-center bg-slate-100">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">下滑查看喜欢地图</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
