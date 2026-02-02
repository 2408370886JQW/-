import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Smile, User, Image as ImageIcon, ShoppingBag, Star, Tag, Heart, Coffee, Beer, Film, Moon, Camera, ArrowRight, ChevronRight, Cake, Briefcase, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import MapView from "@/components/Map";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { createRoot } from "react-dom/client";

// Mock data for map markers
const INITIAL_MARKERS = {
  encounter: [
    { id: 1, lat: 39.9042, lng: 116.4074, type: "encounter", icon: Smile, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", status: "online", gender: "female" },
    { id: 2, lat: 39.915, lng: 116.404, type: "encounter", icon: Smile, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", status: "offline", gender: "male" },
    { id: 3, lat: 39.908, lng: 116.397, type: "encounter", icon: Smile, avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop", status: "away", gender: "female" },
  ],
  friends: [
    { id: 4, lat: 39.908, lng: 116.397, type: "friend", icon: User, avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop", status: "online", gender: "female" },
    { id: 5, lat: 39.912, lng: 116.415, type: "friend", icon: User, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", status: "online", gender: "male" },
  ],
  moments: [
    { 
      id: 5, 
      lat: 39.902, 
      lng: 116.395, 
      type: "moment", 
      icon: ImageIcon,
      content: "今天天气真好！",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop",
      likes: 24,
      comments: 5
    },
    { 
      id: 6, 
      lat: 39.918, 
      lng: 116.408, 
      type: "moment", 
      icon: ImageIcon,
      content: "打卡网红咖啡店",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop",
      likes: 156,
      comments: 32
    },
  ],
  meet: [ 
    { id: 7, lat: 39.906, lng: 116.412, type: "meet", icon: ShoppingBag },
    { id: 8, lat: 39.910, lng: 116.402, type: "meet", icon: ShoppingBag },
  ],
};

// --- NEW DATA STRUCTURES FOR SCENARIO-BASED MEET PAGE ---

// 1. Scenarios (Entry Level)
const SCENARIOS = [
  { id: "date", label: "约会", icon: Heart, color: "text-pink-500", bg: "bg-pink-50" },
  { id: "bestie", label: "闺蜜", icon: Camera, color: "text-purple-500", bg: "bg-purple-50" },
  { id: "bros", label: "兄弟", icon: Beer, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "birthday", label: "生日", icon: Cake, color: "text-red-500", bg: "bg-red-50" },
  { id: "business", label: "商务", icon: Briefcase, color: "text-slate-600", bg: "bg-slate-100" },
  { id: "chill", label: "坐坐", icon: Coffee, color: "text-amber-500", bg: "bg-amber-50" },
  { id: "night", label: "深夜", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-50" },
];

// 2. Plans (Solution Level)
const PLANS = {
  date: [
    {
      id: "date-first",
      title: "第一次约会标准流程",
      tags: ["#不尴尬", "#氛围感", "#高成功率"],
      steps: [
        { icon: "🍽", label: "吃饭", desc: "安静适合聊天" },
        { icon: "🎬", label: "看电影", desc: "拉近距离" },
        { icon: "☕️", label: "咖啡", desc: "意犹未尽" }
      ],
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop"
    },
    {
      id: "date-anniversary",
      title: "纪念日浪漫之夜",
      tags: ["#仪式感", "#高端", "#难忘"],
      steps: [
        { icon: "🌹", label: "送花", desc: "惊喜开场" },
        { icon: "🍽", label: "法餐", desc: "烛光晚餐" },
        { icon: "🌃", label: "江景", desc: "浪漫散步" }
      ],
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=200&fit=crop"
    }
  ],
  bestie: [
    {
      id: "bestie-photo",
      title: "闺蜜出片一日游",
      tags: ["#超好拍", "#网红店", "#精致"],
      steps: [
        { icon: "🍰", label: "下午茶", desc: "高颜值甜点" },
        { icon: "📸", label: "拍照", desc: "艺术展/公园" },
        { icon: "🍸", label: "小酌", desc: "微醺时刻" }
      ],
      image: "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=400&h=200&fit=crop"
    }
  ],
  bros: [
    {
      id: "bros-hangout",
      title: "兄弟聚一聚",
      tags: ["#放松", "#畅聊", "#解压"],
      steps: [
        { icon: "🍺", label: "烧烤", desc: "大口吃肉" },
        { icon: "🎱", label: "台球", desc: "切磋球技" },
        { icon: "🎮", label: "网咖", desc: "开黑一把" }
      ],
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=200&fit=crop"
    }
  ],
  birthday: [
    {
      id: "birthday-party",
      title: "难忘生日趴",
      tags: ["#狂欢", "#仪式感", "#多人"],
      steps: [
        { icon: "🍽", label: "大餐", desc: "聚会首选" },
        { icon: "🎤", label: "KTV", desc: "嗨唱整晚" },
        { icon: "🎂", label: "许愿", desc: "切蛋糕" }
      ],
      image: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=400&h=200&fit=crop"
    }
  ],
  business: [
    {
      id: "business-banquet",
      title: "高端商务局",
      tags: ["#私密", "#排面", "#谈事"],
      steps: [
        { icon: "🍵", label: "茶室", desc: "静心叙旧" },
        { icon: "🥢", label: "私房菜", desc: "精致位上" },
        { icon: "🥃", label: "Lounge", desc: "雪茄威士忌" }
      ],
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=200&fit=crop"
    }
  ],
  chill: [],
  night: []
};

type TabType = "encounter" | "friends" | "moments" | "meet";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("encounter");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [markerData, setMarkerData] = useState(INITIAL_MARKERS);
  const [overlays, setOverlays] = useState<google.maps.OverlayView[]>([]);
  
  // New state for Meet page
  const [activeScenario, setActiveScenario] = useState("date");

  // State for Friend Card and Dynamics Detail
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [selectedMoment, setSelectedMoment] = useState<any>(null);

  // State for Nav Hiding
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLDivElement>(null);

  // Handle scroll/drag to hide nav
  useEffect(() => {
    let startY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const diff = startY - currentY;

      if (diff > 50) { // Swipe up
        setIsNavVisible(false);
      } else if (diff < -50) { // Swipe down
        setIsNavVisible(true);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const tabs: { id: TabType; label: string }[] = [
    { id: "encounter", label: "偶遇" },
    { id: "friends", label: "好友" },
    { id: "moments", label: "动态" },
    { id: "meet", label: "相见" },
  ];

  // Listen for new moment posts
  useEffect(() => {
    const handleNewMoment = (event: CustomEvent) => {
      const newMoment = event.detail;
      // Add new moment to marker data
      setMarkerData(prev => ({
        ...prev,
        moments: [
          ...prev.moments,
          {
            id: Date.now(),
            lat: 39.9042 + (Math.random() - 0.5) * 0.01, // Random location near center
            lng: 116.4074 + (Math.random() - 0.5) * 0.01,
            type: "moment",
            icon: ImageIcon,
            content: newMoment.content,
            image: newMoment.media[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop",
            likes: 0,
            comments: 0
          }
        ]
      }));
      
      // Switch to moments tab to show the new post
      setActiveTab("moments");
    };

    window.addEventListener('new-moment-posted', handleNewMoment as EventListener);
    return () => window.removeEventListener('new-moment-posted', handleNewMoment as EventListener);
  }, []);

  // Update markers when tab changes or marker data updates
  useEffect(() => {
    if (!mapInstance) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    
    // Clear existing overlays (custom HTML markers)
    // Note: We need a way to clear overlays. Since we are using React state to render them in the JSX,
    // we don't need to manually remove them from the map instance like standard markers.
    // The rendering logic below handles it.

    // Add new markers based on active tab
    const currentMarkers = markerData[activeTab] || [];
    
    // For standard markers (non-moments)
    // We now use OverlayView for ALL tabs to support custom avatars and cards
    setMarkers([]); 
    
    // Custom Overlay Implementation using AdvancedMarkerElement or Custom Overlay
    // Since we are moving away from @react-google-maps/api, we need to implement custom overlays manually
    // However, for simplicity and performance in this specific task, we will use a custom implementation
    // that renders React components into map overlays.
    
    class CustomOverlay extends google.maps.OverlayView {
      position: google.maps.LatLngLiteral;
      content: React.ReactNode;
      container: HTMLDivElement;
      root: any;

      constructor(position: google.maps.LatLngLiteral, content: React.ReactNode) {
        super();
        this.position = position;
        this.content = content;
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.cursor = 'pointer';
        this.root = createRoot(this.container);
      }

      onAdd() {
        const panes = this.getPanes();
        if (panes) {
          panes.overlayMouseTarget.appendChild(this.container);
          this.root.render(this.content);
        }
      }

      draw() {
        const projection = this.getProjection();
        if (!projection) return;

        const point = projection.fromLatLngToDivPixel(new google.maps.LatLng(this.position));
        if (point) {
          this.container.style.left = point.x + 'px';
          this.container.style.top = point.y + 'px';
        }
      }

      onRemove() {
        if (this.container.parentNode) {
          this.container.parentNode.removeChild(this.container);
        }
        this.root.unmount();
      }
    }

    // Render markers based on active tab
    const newOverlays: google.maps.OverlayView[] = [];

    if (activeTab === "encounter" || activeTab === "friends") {
      markerData[activeTab].forEach(marker => {
        const content = (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedFriend(marker)}
            className="relative -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          >
            {/* Avatar Container */}
            <div className={cn(
              "w-14 h-14 rounded-full border-4 shadow-xl overflow-hidden transition-transform duration-300",
              marker.gender === "female" ? "border-pink-400" : "border-blue-500"
            )}>
              <img src={marker.avatar} alt="User" className="w-full h-full object-cover" />
            </div>
            
            {/* Status Dot */}
            <div className={cn(
              "absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full shadow-sm z-10",
              marker.status === "online" ? "bg-green-500" : 
              marker.status === "away" ? "bg-yellow-400" : "bg-slate-400"
            )} />

            {/* Ripple Effect for Online Users */}
            {marker.status === "online" && (
              <div className="absolute -inset-2 rounded-full border-2 border-green-500/50 opacity-0 animate-ping" />
            )}
          </motion.div>
        );
        
        const overlay = new CustomOverlay({ lat: marker.lat, lng: marker.lng }, content);
        overlay.setMap(mapInstance);
        newOverlays.push(overlay);
      });
    } else if (activeTab === "moments") {
      markerData.moments.forEach(marker => {
        const content = (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMoment(marker)}
            className="relative -translate-x-1/2 -translate-y-full mb-3 cursor-pointer origin-bottom"
            style={{ 
              transform: `scale(${Math.max(0.6, Math.min(1.2, (mapInstance?.getZoom() || 14) / 14))})` 
            }}
          >
            <div className="glass rounded-2xl shadow-2xl p-2.5 w-44 border border-white/40">
              {/* Image Preview */}
              <div className="w-full h-28 rounded-xl overflow-hidden mb-2.5 bg-slate-100 shadow-inner">
                <img src={marker.image} alt="Moment" className="w-full h-full object-cover" />
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-between px-1.5 pb-0.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                  <span>{marker.likes}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <MessageCircle className="w-3.5 h-3.5 fill-blue-100 text-blue-500" />
                  <span>{marker.comments}</span>
                </div>
              </div>
            </div>
            
            {/* Triangle Pointer */}
            <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white/80 drop-shadow-sm" />
          </motion.div>
        );

        const overlay = new CustomOverlay({ lat: marker.lat, lng: marker.lng }, content);
        overlay.setMap(mapInstance);
        newOverlays.push(overlay);
      });
    }

    setOverlays(newOverlays);

    return () => {
      newOverlays.forEach(overlay => overlay.setMap(null));
    };

  }, [activeTab, mapInstance, markerData]);

  return (
    <Layout showNav={true}>
      <div className="relative h-screen w-full flex flex-col">
        {/* Top Search & Tabs Area - Floating Glass Effect */}
        <motion.div 
          ref={navRef}
          initial={{ y: 0 }}
          animate={{ y: isNavVisible ? 0 : -200 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-0 left-0 right-0 z-10 glass pt-safe rounded-b-3xl shadow-sm"
        >
          <div className="px-4 py-3">
            {/* Search Bar */}
            <div className="relative mb-4 flex items-center gap-2">
              <Input 
                placeholder="搜索" 
                className="flex-1 pl-4 bg-slate-100/50 border-none rounded-2xl h-11 text-base shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="w-11 h-11 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-transform">
                <Search className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Tabs with Jelly Indicator */}
            <div className="flex items-center justify-between px-1 relative">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative flex-1 py-2 text-base font-bold transition-colors duration-300 z-10",
                      isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <span className="relative z-10">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-white/50 shadow-sm rounded-xl -z-0"
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 30,
                          mass: 0.8
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
        {/* Friend Card Popup */}
        <AnimatePresence>
          {selectedFriend && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedFriend(null)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl rounded-t-3xl p-6 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-white/20"
                style={{ maxHeight: '85vh', overflowY: 'auto' }}
              >
                <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-8" />
                
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-24 h-24 rounded-full border-4 shadow-xl overflow-hidden mb-4",
                    selectedFriend.gender === "female" ? "border-pink-400" : "border-blue-500"
                  )}>
                    <img src={selectedFriend.avatar} alt="User" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">用户 {selectedFriend.id}</h3>
                  <div className="flex items-center gap-2 mb-6">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      selectedFriend.status === "online" ? "bg-green-500" : 
                      selectedFriend.status === "away" ? "bg-yellow-400" : "bg-slate-400"
                    )} />
                    <p className="text-slate-500 text-sm">
                      {selectedFriend.status === "online" ? "在线" : 
                       selectedFriend.status === "away" ? "活跃于 3 小时前" : "活跃于 24 小时前"}
                    </p>
                  </div>
                  
                  <div className="flex gap-4 w-full mb-8">
                    <button className="flex-1 bg-slate-100/80 text-slate-900 py-3.5 rounded-2xl font-semibold active:scale-95 transition-transform backdrop-blur-md">
                      关注
                    </button>
                    <button className="flex-1 bg-blue-600 text-white py-3.5 rounded-2xl font-semibold active:scale-95 transition-transform shadow-lg shadow-blue-200">
                      私聊
                    </button>
                  </div>

                  {/* Detailed Info Section */}
                  <div className="w-full space-y-4">
                    <div className="bg-slate-50/50 rounded-2xl p-4">
                      <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">个人信息</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">星座</span>
                          <span className="font-medium text-slate-900">天秤座</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">职业</span>
                          <span className="font-medium text-slate-900">设计师</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">兴趣</span>
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-pink-100 text-pink-600 text-xs rounded-lg font-medium">摄影</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-lg font-medium">旅行</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50/50 rounded-2xl p-4">
                      <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">最近动态</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=200&h=200&fit=crop",
                          "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=200&h=200&fit=crop",
                          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=200&h=200&fit=crop"
                        ].map((url, i) => (
                          <div key={i} className="aspect-square rounded-xl bg-slate-200 overflow-hidden">
                            <img src={url} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Spacer for Safe Area */}
                  <div className="h-8" />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Dynamics Detail Popup */}
        <AnimatePresence>
          {selectedMoment && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedMoment(null)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="fixed inset-4 z-50 bg-white/80 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh] border border-white/40"
              >
                <div className="relative h-72 bg-slate-100">
                  <img src={selectedMoment.image} alt="Moment" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setSelectedMoment(null)}
                    className="absolute top-4 right-4 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 flex-1 overflow-y-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-white/50 shadow-sm">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">用户 {selectedMoment.id}</h4>
                      <p className="text-xs text-slate-500">2小时前</p>
                    </div>
                  </div>
                  <p className="text-slate-700 text-lg leading-relaxed mb-6 font-medium">
                    {selectedMoment.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-slate-500">
                      <div className="flex items-center gap-2">
                        <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                        <span className="font-medium">{selectedMoment.likes}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-6 h-6" />
                        <span className="font-medium">{selectedMoment.comments}</span>
                      </div>
                    </div>
                    
                    <Link href="/circles">
                      <button className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-200 active:scale-95 transition-transform">
                        进入圈子
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Map Background */}
        <div className="flex-1 w-full h-full bg-slate-50 relative">
          <MapView 
            className="w-full h-full"
            onMapReady={(map) => {
              setMapInstance(map);
              map.setCenter({ lat: 39.9042, lng: 116.4074 });
              map.setZoom(14);
              
              // Remove default UI controls to match wireframe clean look
              map.setOptions({
                disableDefaultUI: true,
                zoomControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                styles: [
                  {
                    "elementType": "geometry",
                    "stylers": [{ "color": "#212121" }]
                  },
                  {
                    "elementType": "labels.icon",
                    "stylers": [{ "visibility": "off" }]
                  },
                  {
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#757575" }]
                  },
                  {
                    "elementType": "labels.text.stroke",
                    "stylers": [{ "color": "#212121" }]
                  },
                  {
                    "featureType": "administrative",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#757575" }]
                  },
                  {
                    "featureType": "administrative.country",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#9e9e9e" }]
                  },
                  {
                    "featureType": "administrative.land_parcel",
                    "stylers": [{ "visibility": "off" }]
                  },
                  {
                    "featureType": "administrative.locality",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#bdbdbd" }]
                  },
                  {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#757575" }]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#181818" }]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#616161" }]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "labels.text.stroke",
                    "stylers": [{ "color": "#1b1b1b" }]
                  },
                  {
                    "featureType": "road",
                    "elementType": "geometry.fill",
                    "stylers": [{ "color": "#2c2c2c" }]
                  },
                  {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#8a8a8a" }]
                  },
                  {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#373737" }]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#3c3c3c" }]
                  },
                  {
                    "featureType": "road.highway.controlled_access",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#4e4e4e" }]
                  },
                  {
                    "featureType": "road.local",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#616161" }]
                  },
                  {
                    "featureType": "transit",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#757575" }]
                  },
                  {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#000000" }]
                  },
                  {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#3d3d3d" }]
                  }
                ]
              });
            }}
          >
            {/* Markers are now handled by the useEffect hook with CustomOverlay */}
          </MapView>
          
          {/* --- SCENARIO-BASED MEET PAGE OVERLAY --- */}
          {activeTab === "meet" && (
            <div className="absolute inset-0 z-20 bg-slate-50/95 backdrop-blur-sm flex flex-col pt-[120px] pb-24 overflow-hidden">
              {/* Background Image Layer */}
              <div className="absolute inset-0 z-[-1] opacity-10">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=1200&fit=crop" 
                  alt="background" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Close/Back Button */}
              <button 
                onClick={() => setActiveTab("encounter")}
                className="absolute top-[120px] right-4 z-30 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
              
              {/* 1. Scenario Selector (Entry Level) */}
              <div className="px-4 mb-6 relative z-10">
                <h2 className="text-lg font-bold text-slate-900 mb-3">这次见面怎么安排？</h2>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {SCENARIOS.map((scenario) => {
                    const Icon = scenario.icon;
                    const isActive = activeScenario === scenario.id;
                    return (
                      <motion.button
                        key={scenario.id}
                        onClick={() => setActiveScenario(scenario.id)}
                        whileTap={{ scale: 0.9 }}
                        className={cn(
                          "flex flex-col items-center gap-2 min-w-[64px] transition-all",
                          isActive ? "opacity-100 scale-105" : "opacity-60 hover:opacity-80"
                        )}
                      >
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-colors",
                          isActive ? scenario.bg : "bg-white border border-slate-100"
                        )}>
                          <Icon className={cn("w-6 h-6", scenario.color)} />
                        </div>
                        <span className={cn(
                          "text-xs font-medium",
                          isActive ? "text-slate-900" : "text-slate-500"
                        )}>
                          {scenario.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Plan List (Solution Level) */}
              <div className="flex-1 overflow-y-auto px-4 space-y-4 no-scrollbar relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900">推荐方案</h3>
                  <span className="text-xs text-slate-400">基于场景智能生成</span>
                </div>

                {PLANS[activeScenario as keyof typeof PLANS]?.map((plan) => (
                  <Link key={plan.id} href={`/plan/${plan.id}`}>
                    <motion.div 
                      whileTap={{ scale: 0.98 }}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer"
                    >
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                          <img src={plan.image} alt={plan.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 mb-1 truncate">{plan.title}</h4>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {plan.tags.map(tag => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded-md">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          {/* Steps Preview */}
                          <div className="flex items-center gap-2">
                            {plan.steps.map((step, idx) => (
                              <div key={idx} className="flex items-center">
                                <div className="flex flex-col items-center">
                                  <span className="text-xs mb-0.5">{step.icon}</span>
                                  <span className="text-[10px] text-slate-400 scale-90">{step.label}</span>
                                </div>
                                {idx < plan.steps.length - 1 && (
                                  <div className="w-3 h-[1px] bg-slate-200 mx-1 mb-3" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col justify-center">
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}

                {(!PLANS[activeScenario as keyof typeof PLANS] || PLANS[activeScenario as keyof typeof PLANS].length === 0) && (
                  <div className="text-center py-12 text-slate-400">
                    <p>该场景暂无推荐方案</p>
                    <p className="text-xs mt-1">试试"约会"或"兄弟"场景</p>
                  </div>
                )}

                {/* Featured Packages Section */}
                <div className="mt-6 mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900">精选套餐</h3>
                    <span className="text-xs text-slate-400">热门推荐</span>
                  </div>
                  <div className="space-y-4">
                    {/* Package 1: Date Anniversary */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="aspect-video relative">
                        <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=400&fit=crop" className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
                          <h4 className="font-bold text-lg text-white">情侣浪漫晚餐</h4>
                          <p className="text-white/90 text-sm">¥520/双人</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-0.5 bg-pink-50 text-pink-500 text-xs rounded-md">浪漫</span>
                          <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-xs rounded-md">西餐</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                              <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&h=200&fit=crop" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex justify-between items-start">
                                <h5 className="font-bold text-slate-900 text-sm truncate">TRB Hutong</h5>
                                <div className="flex items-center gap-0.5 shrink-0 ml-2">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs font-medium text-slate-900">4.9</span>
                                </div>
                              </div>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2 break-words">坐落在古老寺庙中的法餐厅，环境优雅，适合约会。</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Package 2: Bestie Afternoon Tea */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="aspect-video relative">
                        <img src="https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=800&h=400&fit=crop" className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
                          <h4 className="font-bold text-lg text-white">闺蜜下午茶</h4>
                          <p className="text-white/90 text-sm">¥298/双人</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-500 text-xs rounded-md">出片</span>
                          <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-xs rounded-md">甜点</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                              <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex justify-between items-start">
                                <h5 className="font-bold text-slate-900 text-sm truncate">Algorithm 算法</h5>
                                <div className="flex items-center gap-0.5 shrink-0 ml-2">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs font-medium text-slate-900">4.8</span>
                                </div>
                              </div>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2 break-words">三里屯网红打卡地，极简工业风，拍照超好看。</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
