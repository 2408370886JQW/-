import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import MomentDetail from "@/components/MomentDetail";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Smile, User, Image as ImageIcon, ShoppingBag, Star, Tag, Heart, Coffee, Beer, Film, Moon, Camera, ArrowRight, ChevronRight, Cake, Briefcase, X, MessageCircle, MessageSquare, Users, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import MapView from "@/components/Map";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { createRoot } from "react-dom/client";

// Mock data for map markers
const INITIAL_MARKERS = {
  encounter: [
    { id: 1, lat: 39.9042, lng: 116.4074, type: "encounter", icon: Smile, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", status: "online", gender: "female", lastSeen: "在线" },
    { id: 2, lat: 39.915, lng: 116.404, type: "encounter", icon: Smile, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", status: "recent", gender: "male", lastSeen: "24小时内在线" },
    { id: 3, lat: 39.908, lng: 116.397, type: "encounter", icon: Smile, avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop", status: "recent", gender: "female", lastSeen: "15分钟前在线" },
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
  const [markerData, setMarkerData] = useState(INITIAL_MARKERS);
  const [overlays, setOverlays] = useState<google.maps.OverlayView[]>([]);
  
  // New state for Meet page
  const [activeScenario, setActiveScenario] = useState("date");
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");

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
      setMarkerData(prev => ({
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
      // Filter out offline users > 24h (simulated by checking if status is 'offline' and not explicitly marked as recent)
      // In a real app, we would check a timestamp. Here we assume 'offline' means > 24h unless we have other data.
      // However, the requirement says "offline > 24h should not show".
      // Let's assume 'offline' status in our mock data means > 24h offline, 
      // and 'recent' means < 1h offline (yellow), and 'online' means online (green).
      // So we should NOT show 'offline' markers on the map.
      if ((marker.type === 'encounter' || marker.type === 'friend') && marker.status === 'offline') {
        return;
      }
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
              (marker.gender === "female" || marker.gender === "Woman") ? "border-pink-500" : "border-blue-500"
            )}>
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
              (marker.gender === "female" || marker.gender === "Woman") ? "border-pink-500" : "border-blue-500"
            )}>
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
        // Moment Marker - Rounded Rectangle (Bubble) Style
        const root = createRoot(div);
        root.render(
          <div 
            className="relative group transition-transform hover:scale-105 active:scale-95"
            onClick={() => setSelectedMoment(marker)}
          >
            <div className="w-28 bg-white rounded-xl shadow-lg overflow-hidden border border-white flex flex-col">
              <div className="aspect-video relative overflow-hidden">
                <img src={marker.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-1 bg-white">
                <p className="text-[9px] text-slate-900 font-medium truncate mb-0.5">{marker.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      <Heart className="w-2 h-2 fill-red-500 text-red-500" />
                      <span className="text-[8px] font-bold text-slate-600">{marker.likes}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <MessageCircle className="w-2 h-2 text-slate-400" />
                      <span className="text-[8px] font-medium text-slate-400">{marker.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Triangle Pointer */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 shadow-sm z-[-1]" />
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
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 100) {
                    setSelectedFriend(null);
                  }
                }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-slate-100 flex flex-col"
                style={{ height: '85vh' }}
              >
                {/* Drag Handle Area */}
                <div className="w-full flex justify-center pt-4 pb-2 shrink-0 cursor-grab active:cursor-grabbing" onClick={() => setSelectedFriend(null)}>
                  <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
                </div>
                
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 pt-2 pb-32">
                  <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-24 h-24 rounded-full border-[4px] shadow-xl overflow-hidden mb-4",
                        (selectedFriend.gender === "female" || selectedFriend.gender === "Woman") ? "border-pink-500" : "border-blue-500"
                      )}>
                      <img src={selectedFriend.avatar} alt="User" className="w-full h-full object-cover" />
                    </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">用户 {selectedFriend.id}</h3>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
                      {selectedFriend.gender === "female" ? "♀ 24岁" : "♂ 26岁"}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 text-xs rounded-full font-medium flex items-center gap-1",
                        selectedFriend.status === "online" ? "bg-green-100 text-green-600" : 
                      selectedFriend.status === "recent" ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-600"
                    )}>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        selectedFriend.status === "online" ? "bg-green-500" : 
                        selectedFriend.status === "recent" ? "bg-yellow-500" : "bg-gray-500"
                      )} />
                      {selectedFriend.lastSeen || (selectedFriend.status === "online" ? "在线" : "离线")}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 w-full mb-8">
                    <button className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-slate-600">发消息</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-pink-500">
                        <Heart className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-slate-600">关注</span>
                    </button>
                    {/* Removed '约个饭' button as requested */}
                  </div>

                  <div className="w-full space-y-4">
                    <h4 className="font-bold text-slate-900">个人动态</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                          <img src={`https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Moment Detail Modal */}
        <AnimatePresence>
          {selectedMoment && (
            <MomentDetail 
              moment={selectedMoment} 
              onClose={() => setSelectedMoment(null)} 
            />
          )}
        </AnimatePresence>

        {/* Map Container - FIXED: Ensure it takes full space and has correct z-index */}
        <div className="absolute inset-0 z-0">
          {/* Gender Filter Controls */}
          {activeTab === "encounter" && (
            <div className="absolute top-28 left-4 z-10 flex flex-col gap-2">
              <button 
                onClick={() => setGenderFilter("all")}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all",
                  genderFilter === "all" ? "bg-slate-900 text-white" : "bg-white text-slate-600"
                )}
              >
                <Users className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setGenderFilter("male")}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all",
                  genderFilter === "male" ? "bg-blue-500 text-white" : "bg-white text-blue-500"
                )}
              >
                <span className="font-bold text-lg">♂</span>
              </button>
              <button 
                onClick={() => setGenderFilter("female")}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all",
                  genderFilter === "female" ? "bg-pink-500 text-white" : "bg-white text-pink-500"
                )}
              >
                <span className="font-bold text-lg">♀</span>
              </button>
            </div>
          )}

          <MapView 
            className="w-full h-full"
            markers={
              activeTab === "encounter" ? markerData.encounter.filter(m => {
                if (genderFilter === "all") return true;
                if (genderFilter === "male") return m.gender === "male" || m.gender === "Man";
                if (genderFilter === "female") return m.gender === "female" || m.gender === "Woman";
                return true;
              }) :
              activeTab === "friends" ? markerData.friends :
              activeTab === "moments" ? markerData.moments :
              markerData.meet
            }
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
                clickableIcons: false,
                gestureHandling: "greedy", // Allow single finger pan
                styles: [
                  {
                    "featureType": "all",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#f5f5f5" }]
                  },
                  {
                    "featureType": "all",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#616161" }]
                  },
                  {
                    "featureType": "all",
                    "elementType": "labels.text.stroke",
                    "stylers": [{ "color": "#f5f5f5" }]
                  },
                  {
                    "featureType": "all",
                    "elementType": "labels.icon",
                    "stylers": [{ "visibility": "off" }]
                  },
                  {
                    "featureType": "administrative.land_parcel",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#bdbdbd" }]
                  },
                  {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#eeeeee" }]
                  },
                  {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#757575" }]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#e5e5e5" }]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#9e9e9e" }]
                  },
                  {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#ffffff" }]
                  },
                  {
                    "featureType": "road.arterial",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#757575" }]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#dadada" }]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#616161" }]
                  },
                  {
                    "featureType": "road.local",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#9e9e9e" }]
                  },
                  {
                    "featureType": "transit.line",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#e5e5e5" }]
                  },
                  {
                    "featureType": "transit.station",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#eeeeee" }]
                  },
                  {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#c9c9c9" }]
                  },
                  {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#9e9e9e" }]
                  }
                ]
              });
            }}
          />
        </div>

        {/* Meet Page Overlay */}
        <AnimatePresence>
          {activeTab === "meet" && (
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute inset-0 z-40 bg-slate-50 flex flex-col"
            >
              {/* Header Image Area - Collapsible on Scroll */}
              <motion.div 
                className="relative shrink-0 overflow-hidden"
                animate={{ height: isMeetHeaderCollapsed ? 0 : 200 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop" 
                  className="w-full h-full object-cover"
                  alt="Meet Header"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
                
                {/* Title */}
                <motion.div 
                  className="absolute bottom-6 left-4 text-white"
                  animate={{ opacity: isMeetHeaderCollapsed ? 0 : 1 }}
                >
                  <h1 className="text-2xl font-bold mb-1">发现美好生活</h1>
                  <p className="text-sm opacity-90">与你喜欢的TA一起发现美好</p>
                </motion.div>
              </motion.div>

              {/* Fixed Back Button Bar */}
              <div className="absolute top-0 left-0 right-0 z-50 p-4 pointer-events-none">
                <button 
                  onClick={() => setActiveTab("encounter")}
                  className={cn(
                    "pointer-events-auto p-2 rounded-full transition-all duration-300 shadow-sm",
                    isMeetHeaderCollapsed 
                      ? "bg-white text-slate-900 border border-slate-200" 
                      : "bg-black/20 backdrop-blur-md text-white hover:bg-black/30"
                  )}
                  style={{ marginTop: 'env(safe-area-inset-top)' }}
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </div>

              {/* Content Area */}
              <div 
                className="flex-1 overflow-y-auto pt-0 pb-24"
                onScroll={(e) => {
                  const scrollTop = e.currentTarget.scrollTop;
                  // More aggressive collapse threshold
                  if (scrollTop > 10 && !isMeetHeaderCollapsed) {
                    setIsMeetHeaderCollapsed(true);
                  } else if (scrollTop < 5 && isMeetHeaderCollapsed) {
                    setIsMeetHeaderCollapsed(false);
                  }
                }}
              >
                {/* Scenario Tabs - Also collapsible */}
                <motion.div 
                  className="bg-white shadow-sm sticky top-0 z-10 overflow-hidden"
                  animate={{ 
                    height: isMeetHeaderCollapsed ? 0 : 'auto',
                    opacity: isMeetHeaderCollapsed ? 0 : 1,
                    padding: isMeetHeaderCollapsed ? 0 : '1rem'
                  }}
                >
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                    {SCENARIOS.map(scenario => (
                      <button
                        key={scenario.id}
                        onClick={() => setActiveScenario(scenario.id)}
                        className={cn(
                          "flex flex-col items-center gap-2 min-w-[64px] transition-all shrink-0",
                          activeScenario === scenario.id ? "scale-110" : "opacity-60 hover:opacity-100"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm overflow-visible",
                          scenario.bg,
                          scenario.color,
                          activeScenario === scenario.id && "ring-2 ring-offset-2 ring-blue-500"
                        )}>
                          <scenario.icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium text-slate-600 whitespace-nowrap">{scenario.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>

                <div className="p-4 space-y-6 pb-24">
                  {/* Recommended Plans */}
                  <div>
                    <h2 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      推荐方案
                    </h2>
                    <div className="space-y-4">
                      {(PLANS[activeScenario as keyof typeof PLANS] || []).map((plan: any) => (
                        <div 
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan)}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-98 transition-transform"
                        >
                          <div className="h-32 relative">
                            <img src={plan.image} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-3 left-3 text-white">
                              <h3 className="font-bold text-lg">{plan.title}</h3>
                              <div className="flex gap-2 mt-1">
                                {plan.tags.map((tag: string) => (
                                  <span key={tag} className="text-xs opacity-90">{tag}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="p-3 flex justify-between items-center">
                            <div className="flex -space-x-2">
                              {plan.steps.map((step: any, idx: number) => (
                                <div key={idx} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs shadow-sm z-10">
                                  {step.icon}
                                </div>
                              ))}
                            </div>
                            <span className="text-xs text-blue-500 font-bold flex items-center">
                              查看详情 <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {(!PLANS[activeScenario as keyof typeof PLANS] || PLANS[activeScenario as keyof typeof PLANS].length === 0) && (
                        <div className="text-center py-8 text-slate-400 text-sm">
                          暂无推荐方案，敬请期待...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Popular Shops */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-red-500" />
                        热门好店
                      </h2>
                      <button 
                        onClick={() => setShowGroupBuying(true)}
                        className="text-xs text-slate-500 flex items-center hover:text-slate-900"
                      >
                        查看全部 <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map(i => (
                        <div 
                          key={i} 
                          className="bg-white rounded-xl overflow-hidden shadow-sm active:scale-95 transition-transform"
                          onClick={() => setSelectedShop({
                            name: `微醺时刻 ${i}`,
                            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop",
                            rating: 4.8,
                            price: 168,
                            desc: "这里是店铺的详细介绍，环境优雅，适合约会..."
                          })}
                        >
                          <div className="aspect-square bg-slate-200 relative">
                            <img src={`https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&h=200&fit=crop`} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-xs font-bold text-orange-500 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-orange-500" /> 4.8
                            </div>
                          </div>
                          <div className="p-2">
                            <h3 className="font-bold text-slate-900 text-sm truncate">微醺时刻 {i}</h3>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-slate-500">酒吧 • 1.2km</span>
                              <span className="text-red-500 font-bold text-sm">¥168</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plan Detail Modal */}
        <AnimatePresence>
          {selectedPlan && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPlan(null)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-0 z-[70] bg-white flex flex-col"
              >
                {/* Header Image */}
                <div className="relative h-64 shrink-0">
                  <img src={selectedPlan.image} alt={selectedPlan.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                  
                  {/* Back Button - CHANGED to ArrowLeft */}
                  <button 
                    onClick={() => setSelectedPlan(null)}
                    className="absolute top-4 left-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/30 transition-colors z-50"
                    style={{ marginTop: 'env(safe-area-inset-top)' }}
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>

                  {/* Title Area */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedPlan.title}</h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlan.tags.map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50">
                  <div className="p-6 space-y-6">
                    {/* Steps */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-4 bg-blue-500 rounded-full" />
                        流程安排
                      </h3>
                      <div className="space-y-6 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100" />
                        
                        {selectedPlan.steps.map((step: any, idx: number) => (
                          <div key={idx} className="relative flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-100 flex items-center justify-center text-lg shadow-sm z-10">
                              {step.icon}
                            </div>
                            <div className="flex-1 pt-1">
                              <h4 className="font-bold text-slate-900">{step.label}</h4>
                              <p className="text-sm text-slate-500 mt-1">{step.desc}</p>
                              
                              {/* Recommended Shop for this step */}
                              <div className="mt-3 bg-slate-50 rounded-xl p-3 flex gap-3 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => window.location.href = `/shop/${idx + 1}`}>
                                <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                                  <img src={`https://images.unsplash.com/photo-1559339352-11d035aa65de?w=100&h=100&fit=crop`} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0 flex justify-between items-center">
                                  <div>
                                    <div className="font-bold text-slate-900 text-sm">推荐店铺 {idx + 1}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">人均 ¥{100 * (idx + 1)}</div>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-slate-400" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                      <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <span className="text-lg">💡</span>
                        小贴士
                      </h3>
                      <p className="text-sm text-blue-700 leading-relaxed">
                        建议提前2天预订餐厅位置。如果是周末出行，记得查看路况信息，预留充足的通勤时间。
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="bg-white border-t border-slate-100 p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                  <div className="flex gap-4">
                    <button className="flex-1 py-3.5 bg-slate-100 text-slate-900 font-bold rounded-2xl active:scale-95 transition-transform">
                      分享给好友
                    </button>
                    <button className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-transform">
                      一键发起
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Shop Details Modal */}
        <AnimatePresence>
          {selectedShop && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedShop(null)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-0 z-[70] bg-white flex flex-col"
              >
                {/* Header Image */}
                <div className="relative h-64 shrink-0">
                  <img src={selectedShop.image} alt={selectedShop.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                  
                  {/* Back Button */}
                  <button 
                    onClick={() => setSelectedShop(null)}
                    className="absolute top-4 left-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/30 transition-colors z-50"
                    style={{ marginTop: 'env(safe-area-inset-top)' }}
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>

                  {/* Title Area */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedShop.name}</h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedShop.tags?.map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50">
                  <div className="p-6 space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <h3 className="font-bold text-slate-900 mb-2">店铺介绍</h3>
                      <p className="text-slate-600 leading-relaxed">{selectedShop.desc}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-slate-900">{selectedShop.rating}</span>
                        <span className="text-slate-400 text-sm">/ 5.0</span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <h3 className="font-bold text-slate-900 mb-4">套餐详情</h3>
                      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                        <div>
                          <div className="font-bold text-slate-900">双人微醺套餐</div>
                          <div className="text-sm text-slate-500 mt-1">含2杯特调鸡尾酒 + 小食拼盘</div>
                        </div>
                        <div className="text-xl font-bold text-red-500">¥{selectedShop.price}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="bg-white border-t border-slate-100 p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                  <button className="w-full py-3.5 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-200 active:scale-95 transition-transform">
                    立即购买
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Group Buying List Modal */}
        <AnimatePresence>
          {showGroupBuying && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowGroupBuying(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-0 z-[70] bg-white flex flex-col"
              >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                  <h3 className="font-bold text-lg text-slate-900">热门团购</h3>
                  <button onClick={() => setShowGroupBuying(false)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4">
                        <div className="w-24 h-24 bg-slate-200 rounded-xl overflow-hidden shrink-0">
                          <img src={`https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&h=200&fit=crop`} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 mb-1">超值双人餐 {i}</h4>
                          <p className="text-xs text-slate-500 mb-2">某某餐厅 • 距离1.2km</p>
                          <div className="flex items-end justify-between">
                            <div className="text-red-500 font-bold text-lg">¥168 <span className="text-xs text-slate-400 font-normal line-through">¥298</span></div>
                            <button className="px-4 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full">抢购</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}