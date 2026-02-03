import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import MomentDetail from "@/components/MomentDetail";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Smile, User, Image as ImageIcon, ShoppingBag, Star, Tag, Heart, Coffee, Beer, Film, Moon, Camera, ArrowRight, ChevronRight, Cake, Briefcase, X, MessageCircle, MessageSquare } from "lucide-react";
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
    { id: 3, lat: 39.908, lng: 116.397, type: "encounter", icon: Smile, avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop", status: "away", gender: "male" },
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
    { id: "friends", label: "好友", subtitle: "匹配好友" },
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
      
      // Refresh markers
      if (mapInstance) {
        // Trigger re-render of markers
      }
    };

    window.addEventListener('new-moment-posted', handleNewMoment as EventListener);
    return () => {
      window.removeEventListener('new-moment-posted', handleNewMoment as EventListener);
    };
  }, [mapInstance]);

  // Custom Overlay for Markers
  useEffect(() => {
    if (!mapInstance) return;

    // Clear existing overlays
    overlays.forEach(overlay => overlay.setMap(null));
    setOverlays([]);

    const newOverlays: google.maps.OverlayView[] = [];

    // Helper to create overlay
    const createOverlay = (position: google.maps.LatLngLiteral, content: HTMLElement) => {
      const overlay = new google.maps.OverlayView();
      overlay.onAdd = function() {
        const layer = this.getPanes()?.overlayMouseTarget;
        layer?.appendChild(content);
      };
      overlay.draw = function() {
        const projection = this.getProjection();
        const point = projection.fromLatLngToDivPixel(position);
        if (point) {
          content.style.left = point.x + 'px';
          content.style.top = point.y + 'px';
        }
      };
      overlay.onRemove = function() {
        content.parentNode?.removeChild(content);
      };
      overlay.setMap(mapInstance);
      return overlay;
    };

    // 1. Encounter Markers
    if (activeTab === "encounter") {
      markerData.encounter.forEach(user => {
        const div = document.createElement('div');
        div.className = 'absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10';
        div.innerHTML = `
          <div class="relative">
            <div class="w-12 h-12 rounded-full border-2 ${user.gender === 'female' ? 'border-pink-400' : 'border-blue-500'} overflow-hidden shadow-lg bg-white">
              <img src="${user.avatar}" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-md text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              打招呼
            </div>
          </div>
        `;
        div.onclick = () => setSelectedFriend(user);
        newOverlays.push(createOverlay({ lat: user.lat, lng: user.lng }, div));
      });
    }

    // 2. Friends Markers
    if (activeTab === "friends") {
      markerData.friends.forEach(friend => {
        const div = document.createElement('div');
        div.className = 'absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20';
        div.innerHTML = `
          <div class="relative">
            <div class="w-14 h-14 rounded-full border-[3px] border-green-500 overflow-hidden shadow-xl bg-white">
              <img src="${friend.avatar}" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm border border-slate-100">
              <span class="text-[10px] font-bold text-slate-700 whitespace-nowrap">好友</span>
            </div>
          </div>
        `;
        div.onclick = () => setSelectedFriend(friend);
        newOverlays.push(createOverlay({ lat: friend.lat, lng: friend.lng }, div));
      });
    }

    // 3. Moments Markers
    if (activeTab === "moments") {
      markerData.moments.forEach(moment => {
        const div = document.createElement('div');
        div.className = 'absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10 hover:z-30';
        div.innerHTML = `
          <div class="relative transition-transform duration-300 group-hover:scale-110">
            <div class="w-16 h-20 rounded-xl overflow-hidden shadow-lg border-2 border-white bg-white relative">
              <img src="${moment.image}" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-1 left-1 text-[10px] text-white font-medium flex items-center gap-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                ${moment.likes}
              </div>
            </div>
            <div class="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-sm">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" class="w-full h-full object-cover" />
            </div>
          </div>
        `;
        div.onclick = () => setSelectedMoment(moment);
        newOverlays.push(createOverlay({ lat: moment.lat, lng: moment.lng }, div));
      });
    }

    // 4. Meet Markers (Shops)
    if (activeTab === "meet") {
      markerData.meet.forEach(shop => {
        const div = document.createElement('div');
        div.className = 'absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10';
        div.innerHTML = `
          <div class="relative transition-transform duration-300 group-hover:scale-110">
            <div class="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </div>
            <div class="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="text-xs font-bold text-slate-700">网红店</span>
            </div>
          </div>
        `;
        div.onclick = () => setSelectedShop(shop);
        newOverlays.push(createOverlay({ lat: shop.lat, lng: shop.lng }, div));
      });
    }

    setOverlays(newOverlays);

  }, [mapInstance, activeTab, markerData]);

  return (
    <Layout showNav={true}>
      <div className="relative h-screen w-full overflow-hidden bg-slate-50">
        {/* Top Navigation Bar - Floating - HIDDEN when activeTab is 'meet' */}
        <AnimatePresence>
          {activeTab !== "meet" && (
            <motion.div 
              className="absolute top-0 left-0 right-0 z-40 pt-safe"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: isNavVisible ? 0 : -100, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="mx-4 mt-2 bg-white/90 backdrop-blur-md shadow-sm rounded-2xl p-2 pb-1">
                {/* Search Bar */}
                <div className="flex items-center gap-3 mb-3 px-1">
                  <div className="flex-1 h-10 bg-slate-100 rounded-full flex items-center px-4 gap-2">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="搜索好友ID、套餐名称、商户名称"
                      className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-slate-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Link href="/profile">
                    <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                      <User className="w-5 h-5 text-slate-600" />
                    </button>
                  </Link>
                </div>

                {/* Tabs with Subtitles */}
                <div className="flex items-center justify-between px-1 relative">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "relative flex-1 py-2 flex flex-col items-center justify-center transition-colors duration-300 z-10",
                          isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        <span className={cn(
                          "text-base font-bold relative z-10 leading-none mb-1",
                          isActive ? "scale-110" : "scale-100"
                        )}>
                          {tab.label}
                        </span>
                        <span className={cn(
                          "text-[10px] font-medium leading-none transition-all duration-300",
                          isActive ? "text-slate-500 opacity-100" : "text-slate-300 opacity-0 h-0 overflow-hidden"
                        )}>
                          {tab.subtitle}
                        </span>
                        
                        {isActive && (
                          <motion.div
                            layoutId="activeTabIndicator"
                            className="absolute bottom-0 w-8 h-1 bg-slate-900 rounded-full"
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
          )}
        </AnimatePresence>

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
                        friend.gender === "female" ? "border-pink-400" : "border-blue-500"
                      )}>
                        <img src={friend.avatar} alt="Friend" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">用户 {friend.id}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          在线
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Mock more friends */}
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={`mock-${i}`} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-full border-2 border-slate-200 overflow-hidden bg-slate-100">
                        <User className="w-full h-full p-2 text-slate-300" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">好友 {i}</div>
                        <div className="text-xs text-slate-500">离线</div>
                      </div>
                    </div>
                  ))}
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
                      selectedFriend.gender === "female" ? "border-pink-400" : "border-blue-500"
                    )}>
                      <img src={selectedFriend.avatar} alt="User" className="w-full h-full object-cover" />
                    </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">用户 {selectedFriend.id}</h3>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
                      {selectedFriend.gender === "female" ? "♀ 24岁" : "♂ 26岁"}
                    </span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full font-medium flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      在线
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
                    <Link href={`/appointment/create?userId=${selectedFriend.id}`}>
                      <button className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-500">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-slate-600">约个饭</span>
                      </button>
                    </Link>
                  </div>

                  <div className="w-full space-y-4">
                    <h4 className="font-bold text-slate-900">个人动态</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                          <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=200&h=200&fit=crop`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
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

        {/* Map Container */}
        <div className="absolute inset-0 z-0">
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
          >
            {/* Markers are now handled by the useEffect hook with CustomOverlay */}
          </MapView>
          
          {/* --- SCENARIO-BASED MEET PAGE OVERLAY --- */}
          {activeTab === "meet" && (
            <div className="absolute inset-0 z-20 bg-slate-50 flex flex-col pt-safe pb-24 overflow-hidden">
              {/* Background Image Layer - Only visible when header is NOT collapsed */}
              <motion.div 
                className="absolute inset-0 z-[-1] opacity-10"
                animate={{ opacity: isMeetHeaderCollapsed ? 0 : 0.1 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=1200&fit=crop" 
                  alt="background" 
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Close/Back Button - Positioned at top right */}
              <button 
                onClick={() => setActiveTab("encounter")}
                className="absolute top-safe right-4 z-30 p-2 mt-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
              
              {/* 1. Scenario Selector (Entry Level) - Collapsible */}
              <motion.div 
                className="px-4 relative z-10 overflow-hidden mt-12"
                animate={{ 
                  height: isMeetHeaderCollapsed ? 0 : "auto",
                  opacity: isMeetHeaderCollapsed ? 0 : 1,
                  marginBottom: isMeetHeaderCollapsed ? 0 : "1.5rem",
                  marginTop: isMeetHeaderCollapsed ? 0 : "3rem"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
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
              </motion.div>

              {/* 2. Plan List (Solution Level) */}
              <div 
                className="flex-1 overflow-y-auto px-4 space-y-4 no-scrollbar relative z-10"
                onScroll={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.scrollTop > 50) {
                    setIsMeetHeaderCollapsed(true);
                  } else {
                    setIsMeetHeaderCollapsed(false);
                  }

                  // Check which shop card is in view
                  shopCardRefs.current.forEach((card) => {
                    if (!card) return;
                    const rect = card.getBoundingClientRect();
                    const containerRect = target.getBoundingClientRect();
                    
                    // If card is near the top of the container (active area)
                    if (rect.top >= containerRect.top && rect.top < containerRect.top + 200) {
                      const lat = parseFloat(card.dataset.lat || "0");
                      const lng = parseFloat(card.dataset.lng || "0");
                      if (lat && lng && mapInstance) {
                        mapInstance.panTo({ lat, lng });
                        mapInstance.setZoom(16);
                      }
                    }
                  });
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900">推荐方案</h3>
                  <span className="text-xs text-slate-400">基于场景智能生成</span>
                </div>

                {PLANS[activeScenario as keyof typeof PLANS]?.map((plan) => (
                  <motion.div 
                    key={plan.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // Toggle expansion logic could go here, or open a bottom sheet
                      // For now, let's use a state to show details in a bottom sheet to keep flow on one page
                      const event = new CustomEvent('show-plan-details', { detail: plan });
                      window.dispatchEvent(event);
                    }}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                        <img src={plan.image} alt={plan.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 mb-1">{plan.title}</h4>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {plan.tags.map((tag: string) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          {plan.steps.map((step: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-1">
                              <span>{step.icon}</span>
                              <span>{step.label}</span>
                              {idx < plan.steps.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* 3. Shop List (Execution Level) */}
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900">热门好店</h3>
                    <button className="text-xs text-blue-600 font-medium">查看全部</button>
                  </div>
                  
                  <div className="space-y-3 pb-20">
                    <Link href="/merchant/1">
                      <div 
                        ref={el => { shopCardRefs.current[0] = el; }}
                        data-lat="39.9321" data-lng="116.4543"
                        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                      >
                        <div className="aspect-video relative">
                          <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=400&fit=crop" className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
                            <h4 className="font-bold text-lg text-white">微醺时刻</h4>
                            <p className="text-white/90 text-sm">¥168/双人</p>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-500 text-xs rounded-md">酒吧</span>
                            <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-xs rounded-md">鸡尾酒</span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex gap-3">
                              <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&h=200&fit=crop" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0 pr-2">
                                <div className="flex justify-between items-start">
                                  <h5 className="font-bold text-slate-900 text-sm truncate">Union</h5>
                                  <div className="flex items-center gap-0.5 shrink-0 ml-2">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-medium text-slate-900">4.7</span>
                                  </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2 break-words">三里屯瑜舍酒店一层，氛围极佳的Lounge Bar。</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plan Details Modal */}
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
                
                {/* Back Button */}
                <button 
                  onClick={() => setSelectedPlan(null)}
                  className="absolute top-safe left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
                >
                  <X className="w-6 h-6" />
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
    </Layout>
  );
}
