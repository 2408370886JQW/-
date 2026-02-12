import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import MeetPage from "@/components/MeetPage";
import MomentDetail from "@/components/MomentDetail";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Smile, User, Image as ImageIcon, ShoppingBag, Star, Tag, Heart, Coffee, Beer, Film, Moon, Camera, ArrowRight, ChevronRight, Cake, Briefcase, X, MessageCircle, MessageSquare, Users, ArrowLeft, Filter, ChevronUp, ChevronDown } from "lucide-react";
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
    { id: 3, lat: 39.908, lng: 116.397, type: "encounter", icon: Smile, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", status: "online", gender: "male", lastSeen: "在线" },
    { id: 12, lat: 39.912, lng: 116.402, type: "encounter", icon: Smile, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop", status: "offline", gender: "male", lastSeen: "5小时前在线" },
  ],
  friends: [
    { id: 4, lat: 39.908, lng: 116.397, type: "friend", icon: User, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", status: "online", gender: "male" },
    { id: 5, lat: 39.912, lng: 116.415, type: "friend", icon: User, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", status: "offline", gender: "female" },
    { id: 9, lat: 39.910, lng: 116.400, type: "friend", icon: User, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", status: "online", gender: "female" },
    { id: 10, lat: 39.905, lng: 116.410, type: "friend", icon: User, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", status: "recent", gender: "male" },
    { id: 11, lat: 39.915, lng: 116.395, type: "friend", icon: User, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", status: "offline", gender: "male" },
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
    { 
      id: 13, 
      lat: 39.910, 
      lng: 116.400, 
      type: "moment", 
      icon: ImageIcon,
      content: "周末的快乐时光",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop",
      likes: 45,
      comments: 12
    },
    { 
      id: 14, 
      lat: 39.905, 
      lng: 116.415, 
      type: "moment", 
      icon: ImageIcon,
      content: "偶遇一只可爱的小猫",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop",
      likes: 89,
      comments: 21
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

  // Manage map click listener separately to ensure proper cleanup and prevent duplicates
  useEffect(() => {
    if (!mapInstance) return;

    const listener = mapInstance.addListener('click', () => {
      // Check timestamp lock to prevent map click from interfering with toggle button
      // If less than 1000ms has passed since the last toggle, ignore this click
      if (Date.now() - lastToggleTimeRef.current < 1000) {
        console.log("Map click ignored due to lock");
        return;
      }

      console.log("Map clicked, resetting UI state");
      setSelectedFriend(null);
      setSelectedMoment(null);
      setIsNavVisible(true);
    });

    // Set custom map style - REMOVED to restore default colorful map
    mapInstance.setOptions({
      styles: [], // Empty array restores default styles
      clickableIcons: false, // Keep POI clicks disabled as per preference
    });

    return () => {
      if (listener) google.maps.event.removeListener(listener);
    };
  }, [mapInstance]);
  const [overlays, setOverlays] = useState<google.maps.OverlayView[]>([]);
  
  // New state for Meet page

  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");
  const [ageFilter, setAgeFilter] = useState<string | null>(null);
  const [zodiacFilter, setZodiacFilter] = useState<string | null>(null);
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
  const lastToggleTimeRef = useRef(0);

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
            image: newMoment.image,
            likes: 0,
            comments: 0
          },
          ...prev.moments
        ]
      }));
    };

    window.addEventListener('newMomentPosted', handleNewMoment as EventListener);
    return () => {
      window.removeEventListener('newMomentPosted', handleNewMoment as EventListener);
    };
  }, []);

  const tabs = [
    { id: "encounter", label: "偶遇", subtitle: "身边的人" },
    { id: "friends", label: "好友", subtitle: "我的好友" },
    { id: "moments", label: "动态", subtitle: "看看新鲜事" },
    { id: "meet", label: "相见", subtitle: "发现美好生活" },
  ];

  // Update markers when tab changes
  useEffect(() => {
    if (!mapInstance) {
      console.log("Map instance not ready yet");
      return;
    }
    console.log("Map instance ready, rendering markers for tab:", activeTab);



    // Custom Overlay Class - Defined inside useEffect to ensure google is available
    class CustomOverlay extends google.maps.OverlayView {
      private div: HTMLDivElement;
      private position: google.maps.LatLng;

      constructor(position: google.maps.LatLng, content: HTMLElement) {
        super();
        this.position = position;
        this.div = content as HTMLDivElement;
        this.div.style.position = 'absolute';
        this.div.style.cursor = 'pointer';
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
          this.div.style.left = point.x + 'px';
          this.div.style.top = point.y + 'px';
          this.div.style.transform = 'translate(-50%, -100%)'; // Center bottom anchor
        }
      }

      onRemove() {
        if (this.div.parentElement) {
          this.div.parentElement.removeChild(this.div);
        }
      }
    }

    // Clear existing overlays
    overlays.forEach(overlay => overlay.setMap(null));
    
    const newOverlays: google.maps.OverlayView[] = [];
    const currentMarkers = markerData[activeTab as keyof typeof markerData] || [];

    // Filter markers based on gender if in encounter tab
    const filteredMarkers = activeTab === 'encounter' 
      ? currentMarkers.filter((m: any) => {
          if (genderFilter === 'all') return true;
          // Handle both "female"/"male" and "Woman"/"Man" formats
          const gender = m.gender?.toLowerCase();
          if (genderFilter === 'female') return gender === 'female' || gender === 'woman';
          if (genderFilter === 'male') return gender === 'male' || gender === 'man';
          return true;
        })
      : currentMarkers;

    filteredMarkers.forEach((marker: any) => {
      const div = document.createElement('div');
      
      if (marker.type === 'encounter' || marker.type === 'friend') {
        const root = createRoot(div);
        root.render(
          <div 
            className="relative group"
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              setSelectedFriend(marker);
            }}
          >
            {/* Online Halo Effect */}
            {marker.status === "online" && (
              <div className="absolute -inset-2 bg-green-400/30 rounded-full animate-pulse z-0" />
            )}

            <div className={cn(
              "relative z-10 w-12 h-12 rounded-full border-[3px] shadow-lg overflow-hidden transition-transform hover:scale-110",
              (marker.gender === "female" || marker.gender === "Woman") ? "!border-pink-500" : "!border-blue-500"
            )}
            style={{ borderColor: (marker.gender === "female" || marker.gender === "Woman") ? '#EC4899' : '#3B82F6' }}>
              <img src={marker.avatar} className="w-full h-full object-cover" />
            </div>
            {/* Status Dot */}
            <div className={cn(
              "absolute bottom-0 right-0 z-20 w-3.5 h-3.5 rounded-full border-2 border-white",
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
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              setSelectedMoment(marker);
            }}
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
        
        {/* Top Navigation Bar - Auto Hide - Liquid Glass Effect */}
        <motion.div 
          className="absolute top-0 left-0 right-0 z-30 pt-safe px-4 pb-4 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-sm pointer-events-none"
          animate={{ 
            y: isNavVisible && activeTab !== 'meet' ? 0 : -100,
            opacity: isNavVisible && activeTab !== 'meet' ? 1 : 0
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="pointer-events-auto">
            {/* Search Bar */}
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-10 bg-white/40 backdrop-blur-md border border-white/30 rounded-full flex items-center px-4 shadow-inner">
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
                  onClick={() => setActiveTab(tab.id as TabType)}
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
                className="fixed bottom-0 left-0 right-0 z-[100] bg-white rounded-t-3xl p-6 pb-safe max-h-[85vh] overflow-y-auto flex flex-col"
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
                          "flex-1 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-1 relative",
                          genderFilter === "male" ? "bg-blue-500 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-600"
                        )}
                      >
                        <span className="text-lg leading-none flex items-center justify-center h-full absolute left-4 top-0 bottom-0">♂</span> 
                        <span>男生</span>
                      </button>
                      <button 
                        onClick={() => setGenderFilter("female")}
                        className={cn(
                          "flex-1 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-1 relative",
                          genderFilter === "female" ? "bg-pink-500 text-white shadow-lg shadow-pink-200" : "bg-slate-100 text-slate-600"
                        )}
                      >
                        <span className="text-lg leading-none flex items-center justify-center h-full absolute left-4 top-0 bottom-0">♀</span> 
                        <span>女生</span>
                      </button>
                    </div>
                  </div>

                  {/* Age Filter */}
                  <div>
                    <label className="text-sm font-bold text-slate-900 mb-3 block">年龄</label>
                    <div className="flex gap-3">
                      {["18-22", "23-26", "27-35", "35+"].map(age => (
                        <button 
                          key={age} 
                          onClick={() => setAgeFilter(age === ageFilter ? null : age)}
                          className={cn(
                            "flex-1 py-2 rounded-lg text-xs font-medium transition-colors",
                            age === ageFilter ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          {age}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Zodiac Filter */}
                  <div>
                    <label className="text-sm font-bold text-slate-900 mb-3 block">星座</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["白羊", "金牛", "双子", "巨蟹", "狮子", "处女", "天秤", "天蝎", "射手", "摩羯", "水瓶", "双鱼"].map(zodiac => (
                        <button 
                          key={zodiac} 
                          onClick={() => setZodiacFilter(zodiac === zodiacFilter ? null : zodiac)}
                          className={cn(
                            "py-2 rounded-lg text-xs font-medium transition-colors",
                            zodiac === zodiacFilter ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          {zodiac}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 sticky bottom-0 bg-white pb-4">
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
          initialCenter={{ lat: 39.9042, lng: 116.4074 }} // Beijing
          initialZoom={14}
          onMapReady={(map) => {
            setMapInstance(map);
          }}
        />

        {/* Filter Button (Floating) - Only show on Encounter tab */}
        {activeTab === "encounter" && (
          <div className="absolute top-32 right-4 z-10 flex flex-col gap-3">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-900 border border-slate-100"
              onClick={() => setShowFilterModal(true)}
            >
              <Filter className="w-5 h-5" />
            </motion.button>

            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-900 border border-slate-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                
                // Update timestamp lock
                lastToggleTimeRef.current = Date.now();

                setIsNavVisible(prev => !prev);
              }}
              onMouseDown={(e) => {
                // Aggressive blocking on mouse down
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                lastToggleTimeRef.current = Date.now();
              }}
              onTouchStart={(e) => {
                // Aggressive blocking on touch start
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                lastToggleTimeRef.current = Date.now();
              }}
              onPointerDown={(e) => {
                // Aggressive blocking on pointer down (covers both mouse and touch)
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                lastToggleTimeRef.current = Date.now();
              }}
            >
              {isNavVisible ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        )}

        {/* Detail Modals */}
        <AnimatePresence>
          {selectedFriend && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[100] bg-white rounded-t-3xl shadow-2xl pb-safe"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) setSelectedFriend(null);
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-6" />
              <div className="px-6 pb-8">
                <div className="flex items-center gap-4 mb-6">
                  {/* Avatar with Gender Border */}
                  <div className={cn(
                    "w-20 h-20 rounded-full border-[3px] p-0.5 overflow-hidden shadow-sm shrink-0",
                    (selectedFriend.gender === "female" || selectedFriend.gender === "Woman") ? "border-pink-500" : "border-blue-500"
                  )}>
                    <img src={selectedFriend.avatar} className="w-full h-full object-cover rounded-full" />
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-2xl font-bold text-slate-900 truncate">用户 {selectedFriend.id}</h2>
                      
                      {/* Status Badge */}
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-full">
                        <div className={cn("w-2 h-2 rounded-full", 
                          selectedFriend.status === "online" ? "bg-green-500" : 
                          selectedFriend.status === "recent" ? "bg-yellow-500" : "bg-slate-400"
                        )} />
                        <span className="text-xs font-medium text-slate-600">
                          {selectedFriend.status === "online" ? "在线" : selectedFriend.status === "recent" ? "15分钟前" : "离线"}
                        </span>
                      </div>
                    </div>
                    
                    {/* Tags Row */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">双子座</span>
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">摄影</span>
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">咖啡</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    className="py-3.5 rounded-full bg-slate-900 text-white font-bold text-base shadow-lg active:scale-95 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Say Hi clicked");
                    }}
                  >
                    打招呼
                  </button>
                  <button 
                    className="py-3.5 rounded-full bg-slate-100 text-slate-900 font-bold text-base active:scale-95 transition-transform hover:bg-slate-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("View Profile clicked");
                    }}
                  >
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
              className="absolute inset-0 bg-slate-50 z-0 flex flex-col"
            >
              <MeetPage onNavigate={(tab) => setActiveTab(tab as TabType)} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
}
