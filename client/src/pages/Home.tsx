import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Users, MapPin, MessageCircle, User, Plus, 
  Filter, Heart, Navigation, X, ChevronRight, Camera,
  Calendar, Coffee, Utensils, Moon, Gift, Star, ArrowLeft,
  CheckCircle, ShoppingBag, Clock, MapPin as MapPinIcon
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

const STORE_PACKAGES = [
  {
    id: 1,
    title: "双人浪漫晚餐套餐",
    price: 298,
    originalPrice: 598,
    sold: 1205,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop&q=80",
    tags: ["约会首选", "氛围感", "免预约"]
  },
  {
    id: 2,
    title: "闺蜜下午茶套餐",
    price: 168,
    originalPrice: 298,
    sold: 856,
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=400&h=300&fit=crop&q=80",
    tags: ["拍照出片", "甜点", "无限续杯"]
  },
  {
    id: 3,
    title: "4人聚会超值套餐",
    price: 498,
    originalPrice: 888,
    sold: 432,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop&q=80",
    tags: ["量大管饱", "包间可用", "周末通用"]
  }
];

const SCENARIOS = [
  { id: 'date', label: '约会', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'friends', label: '闺蜜', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'bros', label: '哥们', icon: Coffee, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'anniversary', label: '纪念日', icon: Gift, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'night', label: '深夜', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
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
      
      {/* Bottom Navigation (Floating Style) */}
      <AnimatePresence>
        {showNav && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-8 left-4 right-4 h-[72px] bg-white/90 backdrop-blur-md rounded-[32px] flex items-center justify-around px-2 z-50 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/50"
          >
            {navItems.map((item) => {
              const isActive = location === item.id;
              
              if (item.isFab) {
                return (
                  <button 
                    key={item.id}
                    onClick={() => setLocation(item.id)}
                    className="relative -top-8 group"
                  >
                    <div className="w-[72px] h-[72px] bg-[#0F172A] rounded-full flex items-center justify-center shadow-xl shadow-slate-900/30 active:scale-95 transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 border-4 border-white">
                      <Plus className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.label}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setLocation(item.id)}
                  className="flex flex-col items-center gap-1 w-14 h-full justify-center active:scale-90 transition-transform"
                >
                  <div className={cn(
                    "relative transition-all duration-300",
                    isActive ? "-translate-y-1" : ""
                  )}>
                    <item.icon 
                      className={cn(
                        "w-6 h-6 transition-colors duration-300",
                        isActive ? "text-blue-600 fill-blue-600" : "text-slate-400"
                      )} 
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                      />
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold transition-all duration-300",
                    isActive ? "text-blue-600 opacity-100" : "text-slate-400 opacity-0 h-0 overflow-hidden"
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
  
  // Store Mode States
  const [storeModeStep, setStoreModeStep] = useState<"none" | "scenario" | "store_home" | "package_detail" | "payment_success">("none");
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);

  const tabs = [
    { id: "encounter", label: "偶遇", subLabel: "身边的人" },
    { id: "friends", label: "好友", subLabel: "我的好友" },
    { id: "moments", label: "动态", subLabel: "看看新鲜事" },
    { id: "meet", label: "相见", subLabel: "发现美好生活" },
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
      
      div.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Marker clicked:', marker.id);
      });

      const overlay = new CustomOverlay(
        new google.maps.LatLng(marker.lat, marker.lng),
        div
      );

      if (marker.type === 'moment') {
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

  // --- Store Mode Handlers ---
  const handleScanCode = () => {
    setStoreModeStep("scenario");
  };

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setStoreModeStep("store_home");
  };

  const handleSelectPackage = (pkg: any) => {
    setSelectedPackage(pkg);
    setStoreModeStep("package_detail");
  };

  const handlePayment = () => {
    setStoreModeStep("payment_success");
  };

  const handleCloseStoreMode = () => {
    setStoreModeStep("none");
    setSelectedScenario(null);
    setSelectedPackage(null);
  };

  return (
    <Layout showNav={storeModeStep === "none"}>
      <div className="relative w-full h-full bg-slate-50">
        
        {/* --- Top Navigation Bar (Hidden in Store Mode) --- */}
        {storeModeStep === "none" && (
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
          </div>
        )}

        {/* --- Top Navigation Tabs --- */}
        {storeModeStep === "none" && (
          <div className="absolute top-[110px] left-0 right-0 z-50 px-4">
            <div className="flex justify-between items-start px-4">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex flex-col items-center gap-1 relative py-2 group"
                  >
                    <span className={cn(
                      "text-[18px] font-bold transition-all duration-300",
                      isActive ? "text-slate-900 scale-105" : "text-slate-400 group-hover:text-slate-600"
                    )}>
                      {tab.label}
                    </span>
                    <span className={cn(
                      "text-[10px] font-medium transition-all duration-300",
                      isActive ? "text-blue-600 opacity-100 translate-y-0" : "text-slate-300 opacity-80"
                    )}>
                      {tab.subLabel}
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabIndicator"
                        className="absolute -bottom-1 w-5 h-1.5 bg-blue-600 rounded-full shadow-sm shadow-blue-200"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* --- Main Content Area --- */}
        <div className={cn(
          "absolute inset-0",
          storeModeStep === "none" ? "pt-[140px] pb-[88px]" : "pt-0 pb-0 z-50 bg-white"
        )}>
          
          {/* Map View (Visible for Encounter, Friends, Moments) */}
          <div className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-300 z-0",
            (activeTab === 'meet' || storeModeStep !== "none") ? "opacity-0 pointer-events-none" : "opacity-100"
          )}>
            <MapView className="w-full h-full" onMapReady={setMapInstance} />
            
            {/* Filter Button (Only on Map Tabs) */}
            {activeTab !== 'meet' && (
              <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center z-10 active:scale-95 transition-transform">
                <Filter className="w-5 h-5 text-slate-700" />
              </button>
            )}
          </div>

          {/* Meet View (Visible only for Meet tab) */}
          {activeTab === 'meet' && storeModeStep === "none" && (
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
                    
                    <button 
                      onClick={handleScanCode}
                      className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
                    >
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

          {/* --- Store Mode: Scenario Selection --- */}
          {storeModeStep === "scenario" && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
              <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">这次和谁来？</h3>
                    <p className="text-sm text-slate-500">选择同行伙伴，解锁专属玩法</p>
                  </div>
                  <button onClick={handleCloseStoreMode} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {SCENARIOS.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => handleSelectScenario(scenario.id)}
                      className="group flex flex-col items-center gap-3"
                    >
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300 group-active:scale-95",
                        scenario.bg,
                        "group-hover:shadow-md"
                      )}>
                        <scenario.icon className={cn("w-7 h-7 transition-transform group-hover:scale-110", scenario.color)} strokeWidth={2} />
                      </div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{scenario.label}</span>
                    </button>
                  ))}
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Star className="w-3 h-3 text-blue-600 fill-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-800 mb-1">为什么选择场景？</h4>
                    <p className="text-[10px] text-blue-600 leading-relaxed">
                      不同的社交场景会触发不同的店铺优惠和互动玩法。比如“约会”场景下，我们会为您推荐更私密、氛围感更强的座位和双人套餐。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- Store Mode: Store Home --- */}
          {storeModeStep === "store_home" && (
            <div className="absolute inset-0 bg-slate-50 z-50 overflow-y-auto">
              {/* Header Image */}
              <div className="relative h-48">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop&q=80" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button 
                  onClick={() => setStoreModeStep("scenario")}
                  className="absolute top-12 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 text-white">
                  <h1 className="text-2xl font-bold mb-1">Blue Bottle Coffee</h1>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <MapPinIcon className="w-4 h-4" />
                    <span>静安嘉里中心店</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 -mt-4 relative z-10 bg-slate-50 rounded-t-3xl min-h-[calc(100vh-180px)]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900">超值套餐</h2>
                  <span className="text-xs text-slate-500">已售 2345</span>
                </div>

                <div className="space-y-4">
                  {STORE_PACKAGES.map((pkg) => (
                    <div 
                      key={pkg.id}
                      onClick={() => handleSelectPackage(pkg)}
                      className="bg-white p-3 rounded-2xl shadow-sm flex gap-4 active:scale-[0.98] transition-transform"
                    >
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <img src={pkg.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1">{pkg.title}</h3>
                          <div className="flex gap-2">
                            {pkg.tags.map(tag => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-end justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-red-500">¥{pkg.price}</span>
                            <span className="text-xs text-slate-400 line-through">¥{pkg.originalPrice}</span>
                          </div>
                          <button className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                            抢购
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- Store Mode: Package Detail --- */}
          {storeModeStep === "package_detail" && selectedPackage && (
            <div className="absolute inset-0 bg-white z-50 overflow-y-auto flex flex-col">
              {/* Header */}
              <div className="relative h-64 shrink-0">
                <img src={selectedPackage.image} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setStoreModeStep("store_home")}
                  className="absolute top-12 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 p-6 -mt-6 bg-white rounded-t-3xl relative z-10">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{selectedPackage.title}</h1>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-red-500">¥{selectedPackage.price}</span>
                  <span className="text-sm text-slate-400 line-through">¥{selectedPackage.originalPrice}</span>
                  <span className="ml-auto text-sm text-slate-500">已售 {selectedPackage.sold}</span>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      套餐内容
                    </h3>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>主食任选 x2</span>
                        <span>¥128</span>
                      </div>
                      <div className="flex justify-between">
                        <span>特色饮品 x2</span>
                        <span>¥68</span>
                      </div>
                      <div className="flex justify-between">
                        <span>精美甜点 x1</span>
                        <span>¥48</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      使用规则
                    </h3>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      <li>有效期：购买后30天内有效</li>
                      <li>使用时间：10:00 - 22:00</li>
                      <li>无需预约，消费高峰期可能需要等位</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="p-4 border-t border-slate-100 bg-white safe-area-bottom">
                <button 
                  onClick={handlePayment}
                  className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-transform"
                >
                  立即支付 ¥{selectedPackage.price}
                </button>
              </div>
            </div>
          )}

          {/* --- Store Mode: Payment Success --- */}
          {storeModeStep === "payment_success" && (
            <div className="absolute inset-0 bg-white z-50 flex flex-col animate-in fade-in duration-300">
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">支付成功</h2>
                <p className="text-slate-500 mb-8">请向店员出示核销码，或在“我的-订单”中查看</p>
                
                <div className="w-full bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                  <div className="text-sm text-slate-400 mb-2">核销码</div>
                  <div className="text-4xl font-mono font-bold text-slate-900 tracking-widest mb-4">
                    8829 1034
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>有效期至 2026-03-09</span>
                  </div>
                </div>

                {/* Guidance Section */}
                <div className="w-full space-y-3">
                  <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-sm">加入店铺群聊</h4>
                      <p className="text-xs text-slate-500">和 234 位同店小伙伴一起聊天</p>
                    </div>
                    <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                      加入
                    </button>
                  </div>

                  <div className="bg-pink-50 p-4 rounded-xl flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center shrink-0">
                      <Heart className="w-5 h-5 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-sm">发布探店动态</h4>
                      <p className="text-xs text-slate-500">分享此刻美好，赢取免单机会</p>
                    </div>
                    <button className="px-3 py-1.5 bg-pink-600 text-white text-xs font-bold rounded-full">
                      发布
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 safe-area-bottom">
                <button 
                  onClick={handleCloseStoreMode}
                  className="w-full bg-slate-900 text-white py-4 rounded-full font-bold active:scale-[0.98] transition-transform"
                >
                  完成
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
