import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Clock, ChevronRight, Star, Map as MapIcon, List } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import MapView from "@/components/Map";
import { createRoot } from "react-dom/client";

// Mock data for merchants/activities based on the Find Me demo structure
const MERCHANTS = [
  {
    id: 1,
    title: "花田错·下午茶",
    type: "drink",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=400&fit=crop",
    location: "朝阳大悦城 4F",
    distance: "500m",
    price: "¥88/人",
    rating: 4.8,
    sold: 1200,
    tags: ["适合拍照", "闺蜜聚会", "高颜值"],
    isPackage: true,
    lat: 39.9255,
    lng: 116.5181
  },
  {
    id: 2,
    title: "丝路有约·西餐",
    type: "eat",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=400&fit=crop",
    location: "三里屯太古里",
    distance: "1.2km",
    price: "¥168/人",
    rating: 4.9,
    sold: 850,
    tags: ["约会首选", "氛围感", "西餐"],
    isPackage: true,
    lat: 39.9355,
    lng: 116.4551
  },
  {
    id: 3,
    title: "迷雾侦探社·剧本杀",
    type: "play",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=400&fit=crop",
    location: "望京SOHO",
    distance: "2.5km",
    price: "¥128/人",
    rating: 4.7,
    sold: 450,
    tags: ["烧脑", "沉浸式", "社交"],
    isPackage: true,
    lat: 39.9995,
    lng: 116.4810
  },
  {
    id: 4,
    title: "HopZone Taproom",
    type: "drink",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=400&fit=crop",
    location: "鼓楼东大街",
    distance: "800m",
    price: "¥98/人",
    rating: 4.6,
    sold: 600,
    tags: ["微醺", "精酿", "深夜"],
    isPackage: true,
    lat: 39.9405,
    lng: 116.4020
  },
  {
    id: 5,
    title: "极速卡丁车俱乐部",
    type: "fun",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=400&fit=crop",
    location: "金港赛车场",
    distance: "5.0km",
    price: "¥198/人",
    rating: 4.9,
    sold: 300,
    tags: ["刺激", "解压", "团建"],
    isPackage: true,
    lat: 40.0100,
    lng: 116.5500
  }
];

const SCENARIOS = [
  { id: "eat", label: "吃", icon: "🍽️" },
  { id: "drink", label: "喝", icon: "☕" },
  { id: "play", label: "玩", icon: "🎮" },
  { id: "fun", label: "乐", icon: "🎉" },
];

export default function MeetPage() {
  const [activeScenario, setActiveScenario] = useState("eat");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [overlays, setOverlays] = useState<google.maps.OverlayView[]>([]);

  const filteredMerchants = activeScenario === "all" 
    ? MERCHANTS 
    : MERCHANTS.filter(item => item.type === activeScenario || activeScenario === "all");

  // Update markers when map instance or filtered merchants change
  useEffect(() => {
    if (!mapInstance || viewMode !== "map") return;

    // Clear existing overlays
    overlays.forEach(overlay => overlay.setMap(null));
    setOverlays([]);

    const newOverlays: google.maps.OverlayView[] = [];

    // Define CustomOverlay class
    class CustomOverlay extends google.maps.OverlayView {
      position: google.maps.LatLng;
      content: HTMLElement;
      
      constructor(position: google.maps.LatLng, content: HTMLElement) {
        super();
        this.position = position;
        this.content = content;
      }

      onAdd() {
        const panes = this.getPanes();
        if (panes) {
          panes.overlayMouseTarget.appendChild(this.content);
          ['click', 'mousedown', 'touchstart', 'pointerdown'].forEach(eventName => {
            google.maps.event.addDomListener(this.content, eventName, (e: Event) => {
              e.stopPropagation();
            });
          });
        }
      }

      draw() {
        const projection = this.getProjection();
        if (projection) {
          const pixel = projection.fromLatLngToDivPixel(this.position);
          if (pixel) {
            this.content.style.position = 'absolute';
            this.content.style.left = pixel.x + 'px';
            this.content.style.top = pixel.y + 'px';
            this.content.style.zIndex = '100';
            this.content.style.transform = 'translate(-50%, -100%)';
          }
        }
      }

      onRemove() {
        if (this.content.parentElement) {
          this.content.parentElement.removeChild(this.content);
        }
      }
    }

    // Add markers
    filteredMerchants.forEach((merchant) => {
      const div = document.createElement('div');
      div.style.cursor = 'pointer';
      
      const root = createRoot(div);
      root.render(
        <div className="relative group">
          <div className="relative z-10 bg-white rounded-xl shadow-lg p-1 border border-slate-100 transform transition-transform hover:scale-110">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img src={merchant.image} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-slate-100"></div>
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {merchant.title}
          </div>
        </div>
      );

      const overlay = new CustomOverlay(
        new google.maps.LatLng(merchant.lat, merchant.lng),
        div
      );
      overlay.setMap(mapInstance);
      newOverlays.push(overlay);
    });

    setOverlays(newOverlays);

    // Fit bounds
    if (filteredMerchants.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      filteredMerchants.forEach(m => bounds.extend({ lat: m.lat, lng: m.lng }));
      mapInstance.fitBounds(bounds);
    }

    return () => {
      newOverlays.forEach(overlay => overlay.setMap(null));
    };
  }, [mapInstance, filteredMerchants, viewMode]);

  return (
    <Layout showNav={true}>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header */}
        <div className="bg-white sticky top-0 z-10 shadow-sm">
          <div className="px-4 pt-safe pb-2">
            <div className="flex items-center justify-between mb-4 mt-2">
              <h1 className="text-2xl font-bold text-slate-900">相见</h1>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
                >
                  {viewMode === "list" ? (
                    <MapIcon className="w-6 h-6 text-slate-900" />
                  ) : (
                    <List className="w-6 h-6 text-slate-900" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Search className="w-6 h-6 text-slate-900" />
                </Button>
              </div>
            </div>

            {/* Scenario Navigation */}
            <div className="flex justify-between px-2 pb-4">
              {SCENARIOS.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => setActiveScenario(scenario.id)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 shadow-sm",
                    activeScenario === scenario.id 
                      ? "bg-slate-900 text-white scale-110 shadow-md" 
                      : "bg-white text-slate-600 border border-slate-100 group-hover:scale-105"
                  )}>
                    {scenario.icon}
                  </div>
                  <span className={cn(
                    "text-xs font-medium transition-colors",
                    activeScenario === scenario.id ? "text-slate-900" : "text-slate-500"
                  )}>
                    {scenario.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4 py-4 space-y-4">
          {viewMode === "list" ? (
            filteredMerchants.map((item) => (
              <Link key={item.id} href={`/merchant/${item.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 block"
                >
                  {/* Image Section */}
                  <div className="relative h-48">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.distance}
                    </div>
                    {item.isPackage && (
                      <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                        团购特惠
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-slate-900 flex-1 mr-2 line-clamp-1">{item.title}</h3>
                      <div className="text-lg font-bold text-red-500">{item.price}</div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[150px]">{item.location}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs font-bold">{item.rating}</span>
                        <span className="text-xs text-slate-400 ml-1">已售 {item.sold}</span>
                      </div>
                      
                      <Button size="sm" variant="outline" className="h-7 text-xs rounded-full px-3">
                        去看看 <ChevronRight className="w-3 h-3 ml-0.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="h-[calc(100vh-200px)] rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative">
              <MapView 
                className="w-full h-full"
                initialCenter={{ lat: 39.9255, lng: 116.5181 }}
                initialZoom={12}
                onMapReady={(map) => setMapInstance(map)}
              />
              {/* Floating Scenario Filter on Map */}
              <div className="absolute top-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide z-10">
                {SCENARIOS.map(scenario => (
                  <button
                    key={scenario.id}
                    onClick={() => setActiveScenario(scenario.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-all whitespace-nowrap flex items-center gap-1",
                      activeScenario === scenario.id 
                        ? "bg-slate-900 text-white scale-105" 
                        : "bg-white text-slate-600"
                    )}
                  >
                    <span>{scenario.icon}</span>
                    <span>{scenario.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
