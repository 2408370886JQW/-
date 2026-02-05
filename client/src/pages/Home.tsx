import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import MomentDetail from "@/components/MomentDetail";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Smile, User, Image as ImageIcon, ShoppingBag, Star, Tag, Heart, Coffee, Beer, Film, Moon, Camera, ArrowRight, ChevronRight, Cake, Briefcase, X, MessageCircle, MessageSquare, Users, ArrowLeft, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import MapView from "@/components/Map";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { createRoot } from "react-dom/client";

// Mock data for map markers
const INITIAL_MARKERS = {
  encounter: [
    { id: 1, lat: 39.9042, lng: 116.4074, type: "encounter", icon: Smile, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", status: "online", gender: "female", lastSeen: "在线" },
    { id: 2, lat: 39.915, lng: 116.404, type: "encounter", icon: Smile, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", status: "recent", gender: "male", lastSeen: "15分钟前在线" },
    { id: 3, lat: 39.908, lng: 116.397, type: "encounter", icon: Smile, avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop", status: "offline", gender: "female", lastSeen: "2小时前在线" },
  ],
  friends: [
    { id: 4, lat: 39.908, lng: 116.397, type: "friend", icon: User, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", status: "online", gender: "male" },
    { id: 5, lat: 39.912, lng: 116.415, type: "friend", icon: User, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", status: "offline", gender: "female" },
    { id: 9, lat: 39.910, lng: 116.400, type: "friend", icon: User, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", status: "online", gender: "female" },
    { id: 10, lat: 39.905, lng: 116.410, type: "friend", icon: User, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", status: "recent", gender: "male" },
    { id: 11, lat: 39.915, lng: 116.395, type: "friend", icon: User, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", status: "offline", gender: "male" },
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
  const [markerData, setMarkerData] = useState<any>(INITIAL_MARKERS);

  // Force reset marker data on mount to ensure it's not empty
  useEffect(() => {
    if (!markerData.encounter || markerData.encounter.length === 0) {
      setMarkerData(INITIAL_MARKERS);
    }
  }, []);
  const [overlays, setOverlays] = useState<google.maps.OverlayView[]>([]);
  
  // New state for Meet page
  const [activeScenario, setActiveScenario] = useState("date");
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");
  const [showFilterModal, setShowFilterModal] = useState(false);

  // State for Friend Card and Dynamics Detail
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [selectedMoment, setSelectedMoment] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showGroupBuying, setShowGroupBuying] = useState(false);
  const [showFriendList, setShowFriendList] = useState(false);
  const [selectedShop, setSelectedShop] = useState<any>(null);

  // State for Nav Hiding
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isMeetHeaderCollapsed, setIsMeetHeaderCollapsed] = useState(false);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLDivElement>(null);
  const shopCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Listen for new moment posted event
  useEffect(() => {
    const handleNewMoment = (e: CustomEvent) => {
      const newMoment = e.detail;
      
      // Add to local state
      setMarkerData((prev: any) => ({
        ...prev,
        moments: [
          {
            id: newMoment.id,
            lat: 39.9042 + (Math.random() - 0.5) * 0.01, // Random nearby location if not specified
            lng: 116.4074 + (Math.random() - 0.5) * 0.01,
            type: "moment",
            icon: ImageIcon,
            content: newMoment.content,
            image: newMoment.media[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop",
            likes: 0,
            comments: 0,
            hashtags: newMoment.hashtags
          },
          ...prev.moments
        ]
      }));

      // Switch to moments tab to show the new post
      setActiveTab("moments");
      
      // If map instance exists, pan to the new moment
      if (mapInstance) {
        // Use a slight delay to ensure marker is rendered
        setTimeout(() => {
          mapInstance.panTo({ lat: 39.9042, lng: 116.4074 });
          mapInstance.setZoom(16);
        }, 500);
      }
    };

    window.addEventListener('new-moment-posted', handleNewMoment as EventListener);
    return () => {
      window.removeEventListener('new-moment-posted', handleNewMoment as EventListener);
    };
  }, [mapInstance]);

  // Handle scroll/drag to hide nav
  useEffect(() => {
    let startY = 0;
    let isDragging = false;
    
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const currentY = e.touches[0].clientY;
      const diff = startY - currentY;

      // Hide nav when dragging map (swiping up/down significantly)
      if (Math.abs(diff) > 10) {
        setIsNavVisible(false);
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
      // Show nav when dragging stops
      setTimeout(() => {
        setIsNavVisible(true);
      }, 300);
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const tabs: { id: TabType; label: string; subtitle: string }[] = [
    { id: "encounter", label: "偶遇", subtitle: "身边的人" },
    { id: "friends", label: "好友", subtitle: "我的好友" },
    { id: "moments", label: "动态", subtitle: "看看新鲜事" },
    { id: "meet", label: "相见", subtitle: "发现美好生活" },
  ];

  // Listen for new moment posts
  useEffect(() => {
    const handleNewMoment = (event: CustomEvent) => {
      const newMoment = event.detail;
      // Add new moment to marker data
      setMarkerData((prev: any) => ({
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
            comments: 0,
            hashtags: newMoment.hashtags
          }
        ]
      }));
      
      // Switch to moments tab
      setActiveTab("moments");
    };

    window.addEventListener('new-moment-posted', handleNewMoment as EventListener);
    return () => {
      window.removeEventListener('new-moment-posted', handleNewMoment as EventListener);
    };
  }, []);

  // Update markers when active tab changes
  useEffect(() => {
    if (!mapInstance) return;

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
            // Ensure z-index is high enough to be visible
            this.content.style.zIndex = '100';
            this.content.style.transform = 'translate(-50%, -100%)'; // Center horizontally, anchor at bottom
          }
        }
      }

      onRemove() {
        if (this.content.parentElement) {
          this.content.parentElement.removeChild(this.content);
        }
      }
    }

    // Add markers based on active tab
    let currentMarkers = markerData[activeTab as keyof typeof markerData] || [];

    // Force pan to first marker if available to ensure visibility
    if (currentMarkers.length > 0 && mapInstance) {
      const firstMarker = currentMarkers[0];
      // Only pan if the map center is far away (e.g. > 1km) or on initial load
      // For now, we'll just pan to the center of the markers to be safe
      const bounds = new google.maps.LatLngBounds();
      currentMarkers.forEach((m: any) => bounds.extend({ lat: m.lat, lng: m.lng }));
      mapInstance.fitBounds(bounds);
      
      // Avoid zooming in too close
      const listener = google.maps.event.addListener(mapInstance, "idle", () => { 
        if (mapInstance.getZoom()! > 16) mapInstance.setZoom(16); 
        google.maps.event.removeListener(listener); 
      });
    }
    
    // Apply gender filter for encounter tab
    if (activeTab === "encounter") {
      currentMarkers = currentMarkers.filter((m: any) => {
        if (genderFilter === "all") return true;
        if (genderFilter === "male") return m.gender === "male" || m.gender === "Man";
        if (genderFilter === "female") return m.gender === "female" || m.gender === "Woman";
        return true;
      });
    }

    currentMarkers.forEach((marker: any) => {
      console.log(`Rendering marker ${marker.id}: type=${marker.type}, gender=${marker.gender}`);
      // Filter out offline users > 24h
      // We assume 'offline' status means within 24h (gray dot), and we filter out those explicitly marked as 'inactive' or similar if we had that state.
      // For now, we show 'offline' as gray dots as requested.
      // if ((marker.type === 'encounter' || marker.type === 'friend') && marker.status === 'offline') {
      //   return;
      // }
      const div = document.createElement('div');
      div.style.cursor = 'pointer';
      
      // Render different markers based on type
      if (marker.type === 'encounter') {
        // Encounter Marker
        const root = createRoot(div);
        root.render(
          <div 
            className="relative group"
            onClick={() => setSelectedFriend(marker)}
          >
            <div className={cn(
              "w-12 h-12 rounded-full border-[3px] shadow-lg overflow-hidden transition-transform hover:scale-110",
              (marker.gender === "female" || marker.gender === "Woman") ? "!border-pink-500" : "!border-blue-500"
            )}
            style={{ borderColor: (marker.gender === "female" || marker.gender === "Woman") ? '#EC4899' : '#3B82F6' }}>
              <img src={marker.avatar} className="w-full h-full object-cover" />
            </div>
            {/* Status Dot */}
            <div className={cn(
              "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white",
              marker.status === "online" ? "bg-green-500" : 
              marker.status === "recent" ? "bg-yellow-500" : "bg-gray-400"
            )} />
          </div>
        );
      } else if (marker.type === 'friend') {
        // Friend Marker
        const root = createRoot(div);
        root.render(
          <div 
            className="relative group"
            onClick={() => setSelectedFriend(marker)}
          >
            <div className={cn(
              "w-12 h-12 rounded-full border-[3px] shadow-lg overflow-hidden transition-transform hover:scale-110",
              (marker.gender === "female" || marker.gender === "Woman") ? "!border-pink-500" : "!border-blue-500"
            )}
            style={{ borderColor: (marker.gender === "female" || marker.gender === "Woman") ? '#EC4899' : '#3B82F6' }}>
              <img src={marker.avatar} className="w-full h-full object-cover" />
            </div>
            {/* Status Dot */}
            <div className={cn(
              "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white",
              marker.status === "online" ? "bg-green-500" : marker.status === "recent" ? "bg-yellow-500" : "bg-gray-400"
            )} />
          </div>
        );
      } else if (marker.type === 'moment') {
        // Moment Marker - First Version Style (Large Image + Floating Stats)
        const root = createRoot(div);
        root.render(
          <div 
            className="relative group transition-transform hover:scale-105 active:scale-95"
            onClick={() => setSelectedMoment(marker)}
          >
            {/* Main Image Card */}
            <div className="w-32 h-24 bg-white rounded-2xl shadow-xl overflow-hidden border-[4px] border-white">
              <img src={marker.image} className="w-full h-full object-cover" />
            </div>
            
            {/* Floating Stats Capsule */}
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
      }

      const overlay = new CustomOverlay(
        new google.maps.LatLng(marker.lat, marker.lng),
        div
      );
      overlay.setMap(mapInstance);
      newOverlays.push(overlay);
    });

    setOverlays(newOverlays);

    return () => {
      newOverlays.forEach(overlay => overlay.setMap(null));
    };
  }, [mapInstance, activeTab, markerData, genderFilter]);

  return (
    <Layout showNav={isNavVisible}>
      <div className="relative w-full h-screen overflow-hidden bg-slate-50">
        
        {/* Top Navigation Bar - Auto Hide */}
        <motion.div 
          className="absolute top-0 left-0 right-0 z-30 pt-safe px-4 pb-2 bg-white shadow-sm pointer-events-none"
          animate={{ 
            y: isNavVisible && activeTab !== 'meet' ? 0 : -100,
            opacity: isNavVisible && activeTab !== 'meet' ? 1 : 0
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="pointer-events-auto">
            {/* Search Bar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-10 bg-slate-100 rounded-full flex items-center px-4">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input 
                  type="text"
                  placeholder="搜索好友ID、套餐名称、商户名称"
                  className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center active:scale-95 transition-transform"
                onClick={() => setShowFriendList(true)}
              >
                <Users className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center justify-between px-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex flex-col items-center gap-0.5 group"
                >
                  <span className={cn(
                    "text-base font-bold transition-colors",
                    activeTab === tab.id ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                  )}>
                    {tab.label}
                  </span>
                  <span className={cn(
                    "text-[10px] font-medium transition-colors",
                    activeTab === tab.id ? "text-blue-500" : "text-slate-300"
                  )}>
                    {tab.subtitle}
                  </span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="w-4 h-1 bg-blue-500 rounded-full mt-1"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>



        {/* Friend List Popup */}
        <AnimatePresence>
          {showFriendList && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFriendList(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-y-0 right-0 z-50 w-3/4 max-w-sm bg-white shadow-2xl flex flex-col"
              >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-lg text-slate-900">好友列表</h3>
                  <button onClick={() => setShowFriendList(false)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain h-full touch-pan-y">
                  {INITIAL_MARKERS.friends.map(friend => (
                    <div key={friend.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer" onClick={() => {
                      setShowFriendList(false);
                      setSelectedFriend(friend);
                    }}>
                      <div className={cn(
                        "w-12 h-12 rounded-full border-2 overflow-hidden",
                        (friend.gender === "female" || friend.gender === "Woman") ? "border-pink-500" : "border-blue-500"
                      )}>
                        <img src={friend.avatar} alt="Friend" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">用户 {friend.id}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <div className={cn("w-2 h-2 rounded-full", friend.status === "online" ? "bg-green-500" : "bg-gray-400")} />
                          {friend.status === "online" ? "在线" : friend.status === "recent" ? "1小时内在线" : "离线"}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Mock more friends with mixed genders */}
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => {
                    const isFemale = i % 2 === 0;
                    return (
                      <div key={`mock-${i}`} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                        <div className={cn(
                          "w-12 h-12 rounded-full border-2 overflow-hidden bg-slate-100",
                          isFemale ? "border-pink-500" : "border-blue-500"
                        )}>
                          <img 
                            src={isFemale
                              ? `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80&id=${i}` 
                              : `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&q=80&id=${i}`
                            } 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">好友 {i}</div>
                          <div className="text-xs text-slate-500">离线</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Filter Modal */}
        <AnimatePresence>
          {showFilterModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilterModal(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 pb-safe"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900">筛选</h3>
                  <button onClick={() => setShowFilterModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Gender Filter */}
                  <div>
                    <label className="text-sm font-bold text-slate-900 mb-3 block">性别</label>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setGenderFilter("all")}
                        className={cn(
                          "flex-1 py-3 rounded-xl font-medium text-sm transition-all",
                          genderFilter === "all" ? "bg-slate-900 text-white shadow-lg" : "bg-slate-100 text-slate-600"
                        )}
                      >
                        全部
                      </button>
                      <button 
                        onClick={() => setGenderFilter("male")}
                        className={cn(
                          "flex-1 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-1",
                          genderFilter === "male" ? "bg-blue-500 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-600"
                        )}
                      >
                        <span className="text-lg leading-none">♂</span> 男生
                      </button>
                      <button 
                        onClick={() => setGenderFilter("female")}
                        className={cn(
                          "flex-1 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-1",
                          genderFilter === "female" ? "bg-pink-500 text-white shadow-lg shadow-pink-200" : "bg-slate-100 text-slate-600"
                        )}
                      >
                        <span className="text-lg leading-none">♀</span> 女生
                      </button>
                    </div>
                  </div>

                  {/* Age Filter */}
                  <div>
                    <label className="text-sm font-bold text-slate-900 mb-3 block">年龄</label>
                    <div className="flex gap-3">
                      {["18-22", "23-26", "27-35", "35+"].map(age => (
                        <button key={age} className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors">
                          {age}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Zodiac Filter */}
                  <div>
                    <label className="text-sm font-bold text-slate-900 mb-3 block">星座</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["白羊", "金牛", "双子", "巨蟹", "狮子", "处女", "天秤", "天蝎"].map(zodiac => (
                        <button key={zodiac} className="py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors">
                          {zodiac}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setShowFilterModal(false)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform"
                  >
                    确认
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Map View */}
        <MapView 
          className="w-full h-full"
          onMapReady={(map) => {
            setMapInstance(map);
            // Add click listener to close popups when clicking map
            map.addListener('click', () => {
              setSelectedFriend(null);
              setSelectedMoment(null);
              setIsNavVisible(true);
            });
          }}
        />

        {/* Filter Button (Floating) - Only show on Encounter tab */}
        {activeTab === "encounter" && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-32 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-900"
            onClick={() => setShowFilterModal(true)}
          >
            <Filter className="w-5 h-5" />
          </motion.button>
        )}

        {/* Detail Modals */}
        <AnimatePresence>
          {selectedFriend && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl shadow-2xl pb-safe"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) setSelectedFriend(null);
              }}
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-6" />
              <div className="px-6 pb-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className={cn(
                    "w-20 h-20 rounded-full border-4 overflow-hidden shadow-lg",
                    (selectedFriend.gender === "female" || selectedFriend.gender === "Woman") ? "border-pink-500" : "border-blue-500"
                  )}>
                    <img src={selectedFriend.avatar} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-slate-900">用户 {selectedFriend.id}</h2>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5",
                        selectedFriend.status === "online" ? "bg-green-100 text-green-700" : 
                        selectedFriend.status === "recent" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"
                      )}>
                        <div className={cn("w-2 h-2 rounded-full", 
                          selectedFriend.status === "online" ? "bg-green-500" : 
                          selectedFriend.status === "recent" ? "bg-yellow-500" : "bg-slate-400"
                        )} />
                        {selectedFriend.status === "online" ? "在线" : selectedFriend.status === "recent" ? "15分钟前" : "离线"}
                      </div>
                    </div>
                    <p className="text-slate-500 mt-1">北京 · 距离 0.5km</p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">双子座</span>
                      <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">摄影</span>
                      <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">咖啡</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 rounded-xl bg-slate-900 text-white font-bold shadow-lg active:scale-95 transition-transform">
                    打招呼
                  </button>
                  <button className="py-3 rounded-xl bg-slate-100 text-slate-900 font-bold active:scale-95 transition-transform">
                    查看主页
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedMoment && (
            <MomentDetail 
              moment={selectedMoment} 
              onClose={() => setSelectedMoment(null)} 
            />
          )}
        </AnimatePresence>

        {/* Meet Page Overlay */}
        <AnimatePresence>
          {activeTab === "meet" && (
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute inset-0 z-20 bg-slate-50 flex flex-col"
            >
              {/* Meet Page Header - Collapsible */}
              <motion.div 
                className="bg-white z-30 shadow-sm flex-shrink-0"
                animate={{ 
                  height: isMeetHeaderCollapsed ? "auto" : "auto",
                }}
              >
                <div className="pt-safe px-4 pb-2">
                  {/* Search Bar */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 h-10 bg-slate-100 rounded-full flex items-center px-4">
                      <Search className="w-4 h-4 text-slate-400 mr-2" />
                      <input 
                        type="text"
                        placeholder="搜索套餐、商户"
                        className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {/* Scenario Tabs - Horizontal Scroll */}
                  <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                    <div className="flex gap-4 w-max">
                      {SCENARIOS.map(scenario => {
                        const Icon = scenario.icon;
                        const isActive = activeScenario === scenario.id;
                        return (
                          <button
                            key={scenario.id}
                            onClick={() => setActiveScenario(scenario.id)}
                            className={cn(
                              "flex flex-col items-center gap-2 min-w-[60px] transition-all",
                              isActive ? "scale-110" : "opacity-60 hover:opacity-100"
                            )}
                          >
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-colors",
                              isActive ? scenario.bg : "bg-white border border-slate-100"
                            )}>
                              <Icon className={cn("w-6 h-6", scenario.color)} />
                            </div>
                            <span className={cn(
                              "text-xs font-medium",
                              isActive ? "text-slate-900 font-bold" : "text-slate-500"
                            )}>{scenario.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Meet Page Content - Scrollable */}
              <div 
                className="flex-1 overflow-y-auto p-4 pb-32 space-y-6"
                onScroll={(e) => {
                  const scrollTop = e.currentTarget.scrollTop;
                  const isScrollingDown = scrollTop > lastScrollY.current;
                  
                  // Collapse header on scroll down, expand on scroll up (at top)
                  if (scrollTop > 50 && isScrollingDown) {
                    setIsMeetHeaderCollapsed(true);
                  } else if (scrollTop < 20) {
                    setIsMeetHeaderCollapsed(false);
                  }
                  
                  lastScrollY.current = scrollTop;
                }}
              >
                {/* Plans List */}
                <div className="space-y-6">
                  {PLANS[activeScenario as keyof typeof PLANS]?.map((plan: any) => (
                    <div 
                      key={plan.id}
                      className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100"
                      onClick={() => setSelectedPlan(plan)}
                    >
                      {/* Plan Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.title}</h3>
                          <div className="flex gap-2">
                            {plan.tags.map((tag: string) => (
                              <span key={tag} className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>

                      {/* Plan Steps Visual */}
                      <div className="relative mb-4">
                        {/* Connecting Line */}
                        <div className="absolute top-6 left-4 right-4 h-0.5 bg-slate-100 -z-10" />
                        
                        <div className="flex justify-between">
                          {plan.steps.map((step: any, index: number) => (
                            <div key={index} className="flex flex-col items-center gap-2 bg-white px-2">
                              <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center text-xl">
                                {step.icon}
                              </div>
                              <div className="text-center">
                                <div className="text-xs font-bold text-slate-900">{step.label}</div>
                                <div className="text-[10px] text-slate-400">{step.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Plan Preview Image */}
                      <div className="w-full h-32 rounded-2xl overflow-hidden relative">
                        <img src={plan.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                          <span className="text-white text-sm font-bold flex items-center gap-1">
                            查看详情 <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!PLANS[activeScenario as keyof typeof PLANS] || PLANS[activeScenario as keyof typeof PLANS].length === 0) && (
                    <div className="text-center py-12 text-slate-400">
                      <p>该场景暂无推荐方案</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
}
