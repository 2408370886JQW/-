import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import StoreMode from "./StoreMode";
import MomentDetail from "@/components/MomentDetail";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Smile, User, Image as ImageIcon, ShoppingBag, Star, Tag, Heart, Coffee, Beer, Film, Moon, Camera, ArrowRight, ChevronRight, Cake, Briefcase, X, MessageCircle, MessageSquare, Users, ArrowLeft, Filter, ChevronUp, ChevronDown, ScanFace } from "lucide-react";
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

    // Set custom map style
    mapInstance.setOptions({
      styles: [
        {
          "featureType": "all",
          "elementType": "labels.text.fill",
          "stylers": [{"saturation": 36}, {"color": "#333333"}, {"lightness": 40}]
        },
        {
          "featureType": "all",
          "elementType": "labels.text.stroke",
          "stylers": [{"visibility": "on"}, {"color": "#ffffff"}, {"lightness": 16}]
        },
        {
          "featureType": "all",
          "elementType": "labels.icon",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.fill",
          "stylers": [{"color": "#fefefe"}, {"lightness": 20}]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [{"color": "#fefefe"}, {"lightness": 17}, {"weight": 1.2}]
        },
        {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [{"color": "#f5f5f5"}, {"lightness": 20}]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [{"color": "#f5f5f5"}, {"lightness": 21}]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{"color": "#dedede"}, {"lightness": 21}]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [{"color": "#ffffff"}, {"lightness": 17}]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [{"color": "#ffffff"}, {"lightness": 29}, {"weight": 0.2}]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [{"color": "#ffffff"}, {"lightness": 18}]
        },
        {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [{"color": "#ffffff"}, {"lightness": 16}]
        },
        {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [{"color": "#f2f2f2"}, {"lightness": 19}]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{"color": "#e9e9e9"}, {"lightness": 17}]
        }
      ]
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [mapInstance]);

  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [selectedMoment, setSelectedMoment] = useState<any>(null);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isStoreMode, setIsStoreMode] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const lastToggleTimeRef = useRef(0);

  // Function to handle adding a new consumption marker
  const handleAddConsumptionMarker = () => {
    const newMarker = {
      id: Date.now(),
      lat: 39.908, // Near center
      lng: 116.404,
      type: "moment",
      icon: ImageIcon,
      content: "我在这里消费了",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop",
      likes: 0,
      comments: 0,
      isNew: true // Flag for animation
    };

    setMarkerData((prev: any) => ({
      ...prev,
      moments: [newMarker, ...prev.moments]
    }));

    // Switch to moments tab to see the new marker
    setActiveTab("moments");
    
    // Select the new marker to show the bubble immediately
    setTimeout(() => {
      setSelectedMoment(newMarker);
      setIsNavVisible(false);
    }, 500);
  };

  // Update markers when activeTab or markerData changes
  useEffect(() => {
    if (!mapInstance) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    
    const newMarkers: google.maps.Marker[] = [];
    const currentData = markerData[activeTab] || [];

    // Define CustomOverlay class inside useEffect to ensure google is defined
    class CustomOverlay extends google.maps.OverlayView {
      position: google.maps.LatLng;
      content: HTMLElement;
      data: any;

      constructor(position: google.maps.LatLng, content: HTMLElement, data: any) {
        super();
        this.position = position;
        this.content = content;
        this.data = data;
      }

      onAdd() {
        const panes = this.getPanes();
        if (panes) {
          panes.overlayMouseTarget.appendChild(this.content);
        }
      }

      draw() {
        const projection = this.getProjection();
        if (!projection) return;

        const point = projection.fromLatLngToDivPixel(this.position);
        if (point) {
          this.content.style.left = point.x + 'px';
          this.content.style.top = point.y + 'px';
        }
      }

      onRemove() {
        if (this.content.parentElement) {
          this.content.parentElement.removeChild(this.content);
        }
      }
    }

    currentData.forEach((item: any) => {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.cursor = 'pointer';
      div.style.transform = 'translate(-50%, -100%)'; // Center bottom anchor
      
      // Render React component to HTML string
      const root = createRoot(div);
      
      // Determine marker style based on type
      let markerContent;
      
      if (activeTab === 'encounter') {
        markerContent = (
          <div className="relative group">
            {/* Avatar Container */}
            <div className={cn(
              "w-12 h-12 rounded-full border-2 overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-110 relative z-10",
              item.gender === 'female' ? 'border-pink-400' : 'border-blue-400',
              "bg-white"
            )}>
              <img src={item.avatar} className="w-full h-full object-cover" alt="avatar" />
            </div>
            
            {/* Status Dot */}
            <div className={cn(
              "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white z-20",
              item.status === 'online' ? 'bg-green-500' : 
              item.status === 'recent' ? 'bg-yellow-500' : 'bg-slate-400'
            )} />
            
            {/* Info Bubble (Visible on Hover) */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-xs font-medium text-slate-700">
                {item.lastSeen}
              </div>
              <div className="w-2 h-2 bg-white/90 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
            </div>
            
            {/* Pulse Effect for Online Users */}
            {item.status === 'online' && (
              <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping z-0"></div>
            )}
          </div>
        );
      } else if (activeTab === 'friends') {
        markerContent = (
          <div className="relative group">
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-white transition-transform group-hover:scale-110">
              <img src={item.avatar} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white">
              好友
            </div>
          </div>
        );
      } else if (activeTab === 'moments') {
        markerContent = (
          <div className={cn("relative group", item.isNew && "animate-bounce")}>
            <div className="w-14 h-14 rounded-xl border-2 border-white shadow-lg overflow-hidden bg-white transition-transform group-hover:scale-105 relative">
              <img src={item.image} className="w-full h-full object-cover" />
              {item.isNew && (
                <div className="absolute inset-0 bg-yellow-400/20 animate-pulse"></div>
              )}
            </div>
            {item.isNew && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm whitespace-nowrap animate-bounce">
                刚刚发布
              </div>
            )}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full shadow-sm border border-slate-100 flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              <span className="text-[10px] font-bold text-slate-600">{item.likes}</span>
            </div>
          </div>
        );
      } else {
        // Default marker
        markerContent = (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
            <item.icon className="w-4 h-4" />
          </div>
        );
      }

      root.render(markerContent);

      // Create overlay
      const overlay = new CustomOverlay(
        new google.maps.LatLng(item.lat, item.lng),
        div,
        item
      );
      
      overlay.setMap(mapInstance);

      // Add click listener to the div
      div.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent map click
        console.log("Marker clicked:", item);
        
        if (activeTab === 'friends') {
          setSelectedFriend(item);
          setIsNavVisible(false);
        } else if (activeTab === 'moments') {
          setSelectedMoment(item);
          setIsNavVisible(false);
        } else if (activeTab === 'encounter') {
          setSelectedFriend(item); // Reuse friend modal for encounter details
          setIsNavVisible(false);
        }
      });

      // Store overlay reference (using marker array for cleanup, though types mismatch slightly, we manage it manually)
      // @ts-ignore
      newMarkers.push(overlay);
    });

    setMarkers(newMarkers);

  }, [activeTab, mapInstance, markerData]); // Re-run when markerData changes

  return (
    <Layout showNav={isNavVisible}>
      <div className="relative h-screen w-full bg-slate-50">
        {/* Map Container */}
        <div className="absolute inset-0 z-0">
          <MapView onMapReady={setMapInstance} />
        </div>

        {/* Top Search Bar & Tabs */}
        <div className="absolute top-0 left-0 right-0 z-10 pt-safe px-4 pb-4 bg-gradient-to-b from-white/90 via-white/80 to-transparent backdrop-blur-[2px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-slate-200/60 flex items-center px-4">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="text"
                placeholder="搜索好友ID、套餐名称、商户名称"
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-slate-200/60 flex items-center justify-center active:scale-95 transition-transform">
              <Users className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex justify-between items-center px-2">
            {[
              { id: "encounter", label: "偶遇", sub: "身边的人" },
              { id: "friends", label: "好友", sub: "我的好友" },
              { id: "moments", label: "动态", sub: "看看新鲜事" },
              { id: "meet", label: "相见", sub: "发现美好生活" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className="flex flex-col items-center gap-1 group"
              >
                <span className={cn(
                  "text-base font-bold transition-colors",
                  activeTab === tab.id ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                )}>
                  {tab.label}
                </span>
                <span className="text-[10px] text-slate-400 scale-90 origin-top">{tab.sub}</span>
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="w-4 h-1 bg-blue-600 rounded-full mt-1"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="absolute top-40 right-4 z-10 flex flex-col gap-3">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 active:scale-95 transition-transform"
          >
            <Filter className="w-5 h-5" />
          </button>
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="absolute top-12 right-0 bg-white rounded-2xl shadow-xl p-3 w-32 flex flex-col gap-2 origin-top-right"
              >
                <button className="text-xs font-medium text-slate-600 py-2 px-3 hover:bg-slate-50 rounded-lg text-left">只看女生</button>
                <button className="text-xs font-medium text-slate-600 py-2 px-3 hover:bg-slate-50 rounded-lg text-left">只看男生</button>
                <button className="text-xs font-medium text-slate-600 py-2 px-3 hover:bg-slate-50 rounded-lg text-left">在线用户</button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 active:scale-95 transition-transform">
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>

        {/* Meet Tab Content (Overlay) */}
        <AnimatePresence>
          {activeTab === "meet" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 z-20 bg-slate-50 flex flex-col pt-32 px-4 pb-24 overflow-y-auto"
            >
              {/* Scan Code Button (Top Priority) */}
              <button 
                onClick={() => setIsStoreMode(true)}
                className="w-full bg-slate-900 text-white p-6 rounded-3xl shadow-xl active:scale-[0.98] transition-transform flex items-center justify-between group mb-8"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <ScanFace className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold mb-1">扫码进店</h3>
                    <p className="text-white/60 text-sm">扫描桌面二维码，开启相见之旅</p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-3">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">附近好店</h4>
                  <p className="text-xs text-slate-400">发现身边的高分店铺</p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 mb-3">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">约会圣地</h4>
                  <p className="text-xs text-slate-400">浪漫氛围感餐厅推荐</p>
                </div>
              </div>

              {/* Scenario Selection (Directly Shown) */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 px-1">场景推荐</h3>
                <div className="grid grid-cols-4 gap-3">
                  {SCENARIOS.map((scenario) => (
                    <button
                      key={scenario.id}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-active:scale-95 shadow-sm",
                        scenario.bg,
                        scenario.color
                      )}>
                        <scenario.icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium text-slate-600">{scenario.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Plans */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 px-1">热门方案</h3>
                <div className="space-y-4">
                  {PLANS.date.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4">
                      <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={plan.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 py-1">
                        <h4 className="font-bold text-slate-900 mb-2">{plan.title}</h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {plan.tags.map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          {plan.steps.map((step, i) => (
                            <div key={i} className="flex items-center">
                              <span>{step.label}</span>
                              {i < plan.steps.length - 1 && <ChevronRight className="w-3 h-3 mx-1" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Store Mode Overlay */}
        <AnimatePresence>
          {isStoreMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 bg-white"
            >
              <StoreMode 
                onExit={(targetTab) => {
                  setIsStoreMode(false);
                  if (targetTab === "encounter") {
                    // Trigger the consumption marker logic
                    handleAddConsumptionMarker();
                  } else if (targetTab === "moments") {
                    setActiveTab("moments");
                  }
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Friend Detail Modal */}
        <AnimatePresence>
          {selectedFriend && (
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-40 bg-white rounded-t-3xl shadow-2xl pb-safe"
              style={{ maxHeight: "85vh" }}
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-6" />
              
              <div className="px-6 pb-8 overflow-y-auto max-h-[calc(85vh-40px)]">
                {/* Header Info */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden relative">
                      <img src={selectedFriend.avatar} className="w-full h-full object-cover" />
                      <div className={cn(
                        "absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white",
                        selectedFriend.status === 'online' ? 'bg-green-500' : 'bg-slate-300'
                      )} />
                    </div>
                    <div className="pt-2">
                      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        Alex
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full font-bold">Lv.4</span>
                      </h2>
                      <p className="text-slate-400 text-sm mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> 500m · 刚刚活跃
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSelectedFriend(null); setIsNavVisible(true); }}
                    className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {["摄影控", "咖啡重度患者", "夜猫子", "ENFP"].map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs rounded-full font-medium">
                      # {tag}
                    </span>
                  ))}
                </div>

                {/* Recent Moments */}
                <div className="mb-8">
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="font-bold text-slate-900">最近动态</h3>
                    <button className="text-xs text-slate-400 flex items-center">
                      全部 <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-32 h-40 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden relative">
                        <img 
                          src={`https://images.unsplash.com/photo-${1510000000000 + i}?w=200&h=300&fit=crop`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="py-3.5 bg-slate-100 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    <User className="w-5 h-5" />
                    加好友
                  </button>
                  <button className="py-3.5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                    打招呼
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Moment Detail Modal */}
        <AnimatePresence>
          {selectedMoment && (
            <MomentDetail 
              moment={selectedMoment} 
              onClose={() => { setSelectedMoment(null); setIsNavVisible(true); }} 
            />
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
