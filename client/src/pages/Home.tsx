import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Users, MapPin, MessageCircle, User, Plus, 
  Filter, Heart, Navigation, X, ChevronRight, Camera,
  Calendar, Coffee, Utensils, Moon, Gift, Star, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import MapView from "@/components/Map";
import { createRoot } from "react-dom/client";

// --- Mock Data ---
const INITIAL_MARKERS = {
  encounter: [
    { id: 1, lat: 31.2304, lng: 121.4737, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80", gender: "male", status: "online" },
    { id: 2, lat: 31.2354, lng: 121.4787, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80", gender: "female", status: "recent" },
    { id: 3, lat: 31.2254, lng: 121.4687, avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&q=80", gender: "male", status: "offline" },
    { id: 4, lat: 31.2404, lng: 121.4837, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&q=80", gender: "female", status: "online" },
  ],
  friends: [
    { id: 5, lat: 31.2324, lng: 121.4757, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80", gender: "male", status: "online", name: "Bob" },
    { id: 6, lat: 31.2284, lng: 121.4707, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80", gender: "female", status: "recent", name: "Alice" },
  ],
  moments: [
    { id: 7, lat: 31.2314, lng: 121.4767, image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=200&fit=crop&q=80", likes: 89, comments: 21, type: "moment" },
    { id: 8, lat: 31.2364, lng: 121.4717, image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=300&h=200&fit=crop&q=80", likes: 45, comments: 12, type: "moment" },
    { id: 9, lat: 31.2294, lng: 121.4817, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop&q=80", likes: 156, comments: 32, type: "moment" },
    { id: 10, lat: 31.2334, lng: 121.4667, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop&q=80", likes: 24, comments: 5, type: "moment" },
  ]
};

const MEET_RECOMMENDATIONS = [
  {
    id: 1,
    title: "周末看展 | 798这家新展太出片了！🎨",
    author: "Alex Chen",
    likes: 124,
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=400&h=500&fit=crop&q=80"
  },
  {
    id: 2,
    title: "必吃榜汉堡，汁水满满！🍔",
    author: "Foodie Jane",
    likes: 230,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=500&fit=crop&q=80"
  },
  {
    id: 3,
    title: "隐藏在胡同里的宝藏咖啡馆 ☕️",
    author: "Coffee Lover",
    likes: 89,
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=500&fit=crop&q=80"
  },
  {
    id: 4,
    title: "落日飞车，海边兜风指南 🚗",
    author: "Travel Bug",
    likes: 456,
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=500&fit=crop&q=80"
  }
];

// --- Layout Component ---
const Layout = ({ children, showNav = true }: { children: React.ReactNode, showNav?: boolean }) => {
  const [location, setLocation] = useLocation();
  
  const navItems = [
    { id: '/', label: '地图', icon: MapPin },
    { id: '/circles', label: '圈子', icon: Users },
    { id: '/publish', label: '发布动态', icon: Plus, isFab: true },
    { id: '/messages', label: '消息', icon: MessageCircle },
    { id: '/profile', label: '我的', icon: User },
  ];

  return (
    <div className="h-screen w-full flex flex-col bg-white overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        {children}
      </div>
      
      {/* Bottom Navigation */}
      <AnimatePresence>
        {showNav && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="h-[88px] bg-white border-t border-slate-100 flex items-end justify-around pb-6 px-2 relative z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
          >
            {navItems.map((item) => {
              const isActive = location === item.id;
              
              if (item.isFab) {
                return (
                  <button 
                    key={item.id}
                    onClick={() => setLocation(item.id)}
                    className="relative -top-6"
                  >
                    <div className="w-16 h-16 bg-[#0F172A] rounded-full flex items-center justify-center shadow-lg shadow-slate-900/20 active:scale-95 transition-transform">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-slate-400 whitespace-nowrap">
                      {item.label}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setLocation(item.id)}
                  className="flex flex-col items-center gap-1 w-12"
                >
                  <item.icon 
                    className={cn(
                      "w-6 h-6 transition-colors",
                      isActive ? "text-blue-600 fill-blue-600" : "text-slate-400"
                    )} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={cn(
                    "text-[10px] font-medium transition-colors",
                    isActive ? "text-blue-600" : "text-slate-400"
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Home Component ---
export default function Home() {
  const [activeTab, setActiveTab] = useState("encounter"); // encounter, friends, moments, meet
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [overlays, setOverlays] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const tabs = [
    { id: "encounter", label: "偶遇", subtitle: "身边的人" },
    { id: "friends", label: "好友", subtitle: "我的好友" },
    { id: "moments", label: "动态", subtitle: "看看新鲜事" },
    { id: "meet", label: "相见", subtitle: "发现美好生活" },
  ];

  // --- Custom Overlay Logic ---
  useEffect(() => {
    if (!mapInstance || !window.google) return;

    // Clear existing overlays
    overlays.forEach(o => o.setMap(null));
    
    // If we are in 'meet' tab, we don't show map markers
    if (activeTab === 'meet') {
      setOverlays([]);
      return;
    }

    const newOverlays: any[] = [];

    // Define CustomOverlay Class
    class CustomOverlay extends google.maps.OverlayView {
      position: google.maps.LatLng;
      container: HTMLDivElement;
      root: any;

      constructor(position: google.maps.LatLng, content: HTMLDivElement) {
        super();
        this.position = position;
        this.container = content;
        this.root = createRoot(this.container);
      }

      onAdd() {
        const panes = this.getPanes();
        if (panes) {
          panes.overlayMouseTarget.appendChild(this.container);
        }
      }

      draw() {
        const projection = this.getProjection();
        if (!projection) return;

        const point = projection.fromLatLngToDivPixel(this.position);
        if (point) {
          this.container.style.left = point.x + 'px';
          this.container.style.top = point.y + 'px';
        }
      }

      onRemove() {
        if (this.container.parentElement) {
          this.container.parentElement.removeChild(this.container);
        }
        // Ideally we should unmount root here, but React 18 createRoot makes it tricky inside a class without proper cleanup
        // For this prototype, we'll rely on the DOM removal
        setTimeout(() => this.root.unmount(), 0);
      }
    }

    // Determine which markers to show
    let markersToShow: any[] = [];
    if (activeTab === 'encounter') markersToShow = INITIAL_MARKERS.encounter;
    else if (activeTab === 'friends') markersToShow = INITIAL_MARKERS.friends;
    else if (activeTab === 'moments') markersToShow = INITIAL_MARKERS.moments;

    // Create markers
    markersToShow.forEach(marker => {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.cursor = 'pointer';
      div.style.transform = 'translate(-50%, -50%)';
      
      // Prevent map clicks from propagating
      div.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Marker clicked:', marker.id);
      });

      const overlay = new CustomOverlay(
        new google.maps.LatLng(marker.lat, marker.lng),
        div
      );

      if (marker.type === 'moment') {
        // Moment Card Style
        overlay.root.render(
          <div className="relative group transition-transform hover:scale-105 active:scale-95">
            <div className="w-32 h-24 bg-white rounded-2xl shadow-xl overflow-hidden border-[4px] border-white">
              <img src={marker.image} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-2 py-1 shadow-md flex items-center gap-2 border border-slate-100">
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                <span className="text-[10px] font-bold text-slate-700">{marker.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3 fill-blue-500 text-blue-500" />
                <span className="text-[10px] font-bold text-slate-700">{marker.comments}</span>
              </div>
            </div>
          </div>
        );
      } else {
        // Avatar Style (Encounter & Friends)
        const borderColor = marker.gender === 'female' ? 'border-pink-500' : 'border-blue-500';
        const statusColor = marker.status === 'online' ? 'bg-green-500' : 
                           marker.status === 'recent' ? 'bg-yellow-500' : 'bg-slate-300';
        
        overlay.root.render(
          <div className="relative group transition-transform hover:scale-110 active:scale-95">
            <div className={cn(
              "w-14 h-14 rounded-full p-[3px] bg-white shadow-lg",
              "border-[3px]", borderColor
            )}>
              <img src={marker.avatar} className="w-full h-full rounded-full object-cover" />
            </div>
            <div className={cn(
              "absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-[2px] border-white",
              statusColor
            )} />
          </div>
        );
      }

      overlay.setMap(mapInstance);
      newOverlays.push(overlay);
    });

    setOverlays(newOverlays);

    return () => {
      newOverlays.forEach(o => o.setMap(null));
    };
  }, [mapInstance, activeTab]);

  return (
    <Layout>
      <div className="relative w-full h-full bg-slate-50">
        
        {/* --- Top Navigation Bar --- */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-md pt-12 pb-2 px-4 shadow-sm">
          {/* Search Bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-10 bg-slate-100 rounded-full flex items-center px-4 gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索好友ID、套餐名称、商户名称"
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-colors">
              <User className="w-6 h-6 text-slate-700" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between px-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex flex-col items-center gap-1 relative py-2"
                >
                  <span className={cn(
                    "text-base font-bold transition-colors",
                    isActive ? "text-slate-900" : "text-slate-400"
                  )}>
                    {tab.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {tab.subtitle}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 w-4 h-1 bg-blue-600 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="absolute inset-0 pt-[140px] pb-[88px]">
          
          {/* Map View (Visible for Encounter, Friends, Moments) */}
          <div className={cn(
            "w-full h-full transition-opacity duration-300",
            activeTab === 'meet' ? "opacity-0 pointer-events-none" : "opacity-100"
          )}>
            <MapView onMapReady={setMapInstance} />
            
            {/* Filter Button (Only on Map Tabs) */}
            {activeTab !== 'meet' && (
              <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center z-10 active:scale-95 transition-transform">
                <Filter className="w-5 h-5 text-slate-700" />
              </button>
            )}
          </div>

          {/* Meet View (Visible only for Meet tab) */}
          {activeTab === 'meet' && (
            <div className="absolute inset-0 bg-slate-50 overflow-y-auto z-10">
              <div className="p-4 space-y-6 pb-24">
                
                {/* Back Button (Visual only as per screenshot) */}
                <button className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2">
                  <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>

                {/* Store Mode Card */}
                <div className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">到店相见</h2>
                    <p className="text-blue-100 text-sm mb-6">扫码解锁专属优惠与社交玩法</p>
                    
                    <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-transform">
                      <Camera className="w-4 h-4" />
                      模拟扫码进店
                    </button>
                  </div>
                  
                  {/* Decorative Circles */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-xl" />
                </div>

                {/* Recommended Stores Section */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">推荐店铺</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {MEET_RECOMMENDATIONS.map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-[4/5] relative bg-slate-100">
                          <img src={item.image} className="w-full h-full object-cover" />
                          <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1">
                            <Heart className="w-3 h-3 text-white fill-white" />
                            <span className="text-[10px] font-medium text-white">{item.likes}</span>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mb-2 leading-snug">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.author}`} className="w-full h-full" />
                            </div>
                            <span className="text-xs text-slate-500 truncate">{item.author}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
