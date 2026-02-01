import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Smile, User, Image as ImageIcon, ShoppingBag, Star, Tag, Heart, Coffee, Beer, Film, Moon, Camera, ArrowRight, ChevronRight, Cake, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import MapView from "@/components/Map";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

// Mock data for map markers
const INITIAL_MARKERS = {
  encounter: [
    { id: 1, lat: 39.9042, lng: 116.4074, type: "encounter", icon: Smile },
    { id: 2, lat: 39.915, lng: 116.404, type: "encounter", icon: Smile },
  ],
  friends: [
    { id: 3, lat: 39.908, lng: 116.397, type: "friend", icon: User },
    { id: 4, lat: 39.912, lng: 116.415, type: "friend", icon: User },
  ],
  moments: [
    { id: 5, lat: 39.902, lng: 116.395, type: "moment", icon: ImageIcon },
    { id: 6, lat: 39.918, lng: 116.408, type: "moment", icon: ImageIcon },
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
  
  // New state for Meet page
  const [activeScenario, setActiveScenario] = useState("date");

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
            icon: ImageIcon
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

    // Add new markers based on active tab
    const currentMarkers = markerData[activeTab] || [];
    const newMarkers = currentMarkers.map(item => {
      return new google.maps.Marker({
        position: { lat: item.lat, lng: item.lng },
        map: mapInstance,
        title: item.type,
        animation: google.maps.Animation.DROP,
      });
    });

    setMarkers(newMarkers);
  }, [activeTab, mapInstance, markerData]);

  return (
    <Layout showNav={true}>
      <div className="relative h-screen w-full flex flex-col">
        {/* Top Search & Tabs Area - Floating over map */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-md shadow-sm pt-safe">
          <div className="px-4 py-2">
            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="搜索" 
                className="pl-9 bg-slate-100 border-none rounded-full h-9 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-between px-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors",
                    activeTab === tab.id ? "text-slate-900" : "text-slate-500"
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-slate-800 rounded-full" />
                  )}
                  {/* Triangle indicator for active tab (visual match to wireframe) */}
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

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
              });
            }}
          />
          
          {/* --- SCENARIO-BASED MEET PAGE OVERLAY --- */}
          {activeTab === "meet" && (
            <div className="absolute inset-0 z-20 bg-slate-50/95 backdrop-blur-sm flex flex-col pt-[120px] pb-24 overflow-hidden">
              
              {/* 1. Scenario Selector (Entry Level) */}
              <div className="px-4 mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3">这次见面怎么安排？</h2>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {SCENARIOS.map((scenario) => {
                    const Icon = scenario.icon;
                    const isActive = activeScenario === scenario.id;
                    return (
                      <button
                        key={scenario.id}
                        onClick={() => setActiveScenario(scenario.id)}
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
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Plan List (Solution Level) */}
              <div className="flex-1 overflow-y-auto px-4 space-y-4 no-scrollbar">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-800">推荐流程</h3>
                  <span className="text-xs text-slate-400">基于你的选择</span>
                </div>

                {PLANS[activeScenario as keyof typeof PLANS]?.length > 0 ? (
                  PLANS[activeScenario as keyof typeof PLANS].map((plan) => (
                    <Link key={plan.id} href={`/plan/${plan.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden active:scale-[0.98] transition-transform"
                    >
                      {/* Cover Image */}
                      <div className="h-32 w-full relative">
                        <img src={plan.image} alt={plan.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <div>
                            <h4 className="text-white font-bold text-lg">{plan.title}</h4>
                            <div className="flex gap-2 mt-1">
                              {plan.tags.map((tag) => (
                                <span key={tag} className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Steps Preview */}
                      <div className="p-4 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {plan.steps.map((step, index) => (
                              <div key={index} className="flex items-center">
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-lg">{step.icon}</span>
                                  <span className="text-[10px] text-slate-500">{step.label}</span>
                                </div>
                                {index < plan.steps.length - 1 && (
                                  <div className="w-4 h-[1px] bg-slate-300 mx-2" />
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shadow-sm">
                            <ChevronRight className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                      <ShoppingBag className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-sm">该场景暂无推荐流程</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
