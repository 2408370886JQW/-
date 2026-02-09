import React, { useState, useEffect, useRef } from "react";
import { 
  MapPin, 
  Search, 
  Bell, 
  User, 
  Filter, 
  Navigation, 
  Heart, 
  MessageCircle, 
  Users, 
  Clock, 
  Star, 
  ChevronRight, 
  Zap, 
  ScanFace, 
  ArrowRight, 
  ChevronUp, 
  X, 
  MoreHorizontal, 
  Share2, 
  ThumbsUp, 
  MessageSquare,
  Coffee,
  Utensils,
  Wine,
  Music,
  Camera,
  BookOpen,
  Briefcase,
  Gamepad2,
  Sparkles,
  Check,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import MapView from "@/components/Map";
import Layout from "@/components/Layout";
import StoreMode from "./StoreMode";

// Types
type TabType = "encounter" | "friends" | "moments" | "meet";
type UserStatus = "online" | "15m" | "3h" | "24h" | "offline";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: UserStatus;
  lastSeen?: string;
  distance?: string;
  location?: { lat: number; lng: number };
  tags?: string[];
  bio?: string;
  photos?: string[];
  age?: number;
  gender?: "male" | "female";
  constellation?: string;
}

interface Moment {
  id: string;
  user: Friend;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
  location?: string;
  isConsumption?: boolean;
}

interface Plan {
  id: string;
  title: string;
  image: string;
  tags: string[];
  steps: { icon: any; label: string }[];
  rating: number;
  price: number;
  category: string;
}

// Mock Data
const FRIENDS: Friend[] = [
  { 
    id: "1", 
    name: "Sarah", 
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", 
    status: "online",
    distance: "0.8km",
    location: { lat: 39.9042, lng: 116.4074 },
    tags: ["Coffee Lover", "Designer"],
    bio: "Always looking for the perfect latte art ☕️",
    photos: [
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&h=400&fit=crop"
    ],
    age: 24,
    gender: "female",
    constellation: "处女座"
  },
  { 
    id: "2", 
    name: "Mike", 
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop", 
    status: "15m",
    distance: "1.2km",
    location: { lat: 39.915, lng: 116.404 },
    tags: ["Tech", "Gym"],
    bio: "Coding by day, lifting by night 💪",
    photos: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop"
    ],
    age: 28,
    gender: "male",
    constellation: "狮子座"
  },
  { 
    id: "3", 
    name: "Emma", 
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop", 
    status: "offline",
    lastSeen: "5m ago",
    distance: "2.5km",
    location: { lat: 39.908, lng: 116.397 },
    tags: ["Art", "Travel"],
    bio: "Collecting moments, not things ✨",
    photos: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop"
    ],
    age: 22,
    gender: "female",
    constellation: "双鱼座"
  },
  { 
    id: "4", 
    name: "Alex", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop", 
    status: "online",
    distance: "0.3km",
    location: { lat: 39.902, lng: 116.410 },
    tags: ["Foodie", "Music"],
    bio: "Music is life 🎵",
    photos: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop"
    ],
    age: 26,
    gender: "male",
    constellation: "天秤座"
  },
  { 
    id: "5", 
    name: "Linda", 
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop", 
    status: "3h",
    distance: "1.5km",
    location: { lat: 39.912, lng: 116.415 },
    tags: ["Yoga", "Nature"],
    bio: "Namaste 🙏",
    photos: [
      "https://images.unsplash.com/photo-1544367563-12123d8965cd?w=400&h=400&fit=crop"
    ],
    age: 25,
    gender: "female",
    constellation: "金牛座"
  },
];

const MOMENTS: Moment[] = [
  {
    id: "1",
    user: FRIENDS[0],
    content: "Found this amazing hidden cafe! The atmosphere is just perfect for working. ☕️✨",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
    likes: 24,
    comments: 5,
    time: "2h ago",
    location: "Blue Bottle Coffee"
  },
  {
    id: "2",
    user: FRIENDS[3],
    content: "Weekend vibes with the crew! 🎸",
    image: "https://images.unsplash.com/photo-1501612766622-27c7f6484984?w=800&h=600&fit=crop",
    likes: 45,
    comments: 12,
    time: "4h ago",
    location: "Live House Beijing"
  },
  {
    id: "3",
    user: FRIENDS[2],
    content: "Sunset view from the rooftop bar. 🌆",
    image: "https://images.unsplash.com/photo-1536250853075-e8504ee040b9?w=800&h=600&fit=crop",
    likes: 89,
    comments: 8,
    time: "6h ago",
    location: "Atmosphere Bar"
  }
];

const SCENARIOS = [
  { id: "date", label: "约会", icon: Heart, color: "text-pink-500", bg: "bg-pink-50" },
  { id: "party", label: "聚会", icon: Wine, color: "text-purple-500", bg: "bg-purple-50" },
  { id: "chill", label: "独处", icon: Coffee, color: "text-amber-500", bg: "bg-amber-50" },
  { id: "business", label: "商务", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-50" },
];

const ALL_PLANS: Plan[] = [
  // Date Plans
  {
    id: "d1",
    title: "浪漫屋顶晚餐",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop",
    tags: ["夜景绝美", "西餐", "氛围感"],
    steps: [{ icon: Utensils, label: "晚餐" }, { icon: Wine, label: "小酌" }],
    rating: 4.9,
    price: 580,
    category: "date"
  },
  {
    id: "d2",
    title: "午后艺术漫步",
    image: "https://images.unsplash.com/photo-1561839561-b13bcfe95249?w=800&h=600&fit=crop",
    tags: ["看展", "咖啡", "拍照"],
    steps: [{ icon: Camera, label: "看展" }, { icon: Coffee, label: "下午茶" }],
    rating: 4.7,
    price: 120,
    category: "date"
  },
  // Party Plans
  {
    id: "p1",
    title: "周末狂欢夜",
    image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&h=600&fit=crop",
    tags: ["Livehouse", "精酿", "热闹"],
    steps: [{ icon: Music, label: "演出" }, { icon: Wine, label: "畅饮" }],
    rating: 4.8,
    price: 200,
    category: "party"
  },
  {
    id: "p2",
    title: "剧本杀通宵",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=600&fit=crop",
    tags: ["烧脑", "社交", "沉浸式"],
    steps: [{ icon: Gamepad2, label: "剧本杀" }, { icon: Utensils, label: "夜宵" }],
    rating: 4.6,
    price: 158,
    category: "party"
  },
  // Chill Plans (Solo)
  {
    id: "c1",
    title: "深夜书房",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=600&fit=crop",
    tags: ["安静", "24小时", "阅读"],
    steps: [{ icon: BookOpen, label: "阅读" }, { icon: Coffee, label: "咖啡" }],
    rating: 4.9,
    price: 45,
    category: "chill"
  },
  {
    id: "c2",
    title: "街角便利店",
    image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&h=600&fit=crop",
    tags: ["关东煮", "治愈", "烟火气"],
    steps: [{ icon: Utensils, label: "觅食" }],
    rating: 4.5,
    price: 25,
    category: "chill"
  },
  // Business Plans
  {
    id: "b1",
    title: "商务洽谈茶室",
    image: "https://images.unsplash.com/photo-1576014131341-fe1486fb2475?w=800&h=600&fit=crop",
    tags: ["私密", "高端", "茶道"],
    steps: [{ icon: Coffee, label: "品茶" }],
    rating: 4.8,
    price: 300,
    category: "business"
  }
];

const CONSTELLATIONS = [
  "白羊座", "金牛座", "双子座", "巨蟹座", 
  "狮子座", "处女座", "天秤座", "天蝎座", 
  "射手座", "摩羯座", "水瓶座", "双鱼座"
];

const AGE_RANGES = [
  "18-22", "23-26", "27-30", "30+"
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("encounter");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isStoreMode, setIsStoreMode] = useState(false);
  const [moments, setMoments] = useState<Moment[]>(MOMENTS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter states
  const [filterGender, setFilterGender] = useState<"male" | "female" | null>(null);
  const [filterAge, setFilterAge] = useState<string | null>(null);
  const [filterConstellation, setFilterConstellation] = useState<string | null>(null);

  // Map related refs
  const mapRef = useRef<any>(null);
  const setMarkerDataRef = useRef<((data: any[]) => void) | null>(null);

  // Filter plans based on selected category
  const filteredPlans = selectedCategory 
    ? ALL_PLANS.filter(plan => plan.category === selectedCategory)
    : ALL_PLANS;

  // Handle adding a consumption marker
  const handleAddConsumptionMarker = () => {
    // Switch to encounter tab (map view)
    setActiveTab("encounter");
    
    // Create a new consumption moment
    const newMoment: Moment = {
      id: `consumption-${Date.now()}`,
      user: {
        id: "me",
        name: "我",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
        status: "online",
        location: { lat: 39.9042, lng: 116.4074 } // Current user location (mock)
      },
      content: "我在这里消费了",
      likes: 0,
      comments: 0,
      time: "刚刚",
      location: "当前店铺",
      isConsumption: true
    };

    // Add to moments list
    setMoments(prev => [newMoment, ...prev]);

    // Add marker to map if map is ready
    if (setMarkerDataRef.current) {
      // Get current markers
      const currentMarkers = FRIENDS.map(f => ({
        id: f.id,
        lat: f.location!.lat,
        lng: f.location!.lng,
        type: "user",
        data: f
      }));

      // Add new marker
      const newMarker = {
        id: newMoment.id,
        lat: 39.9042,
        lng: 116.4074,
        type: "consumption",
        data: newMoment
      };

      setMarkerDataRef.current([...currentMarkers, newMarker]);
    }
  };

  // Listen for new moments from BottomNav
  useEffect(() => {
    const handleNewMoment = (e: CustomEvent) => {
      const newMoment = e.detail;
      // Transform to match Moment interface
      const moment: Moment = {
        id: newMoment.id.toString(),
        user: {
          id: "me",
          name: "我",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
          status: "online",
          location: { lat: 39.9042, lng: 116.4074 }
        },
        content: newMoment.content,
        image: newMoment.media[0],
        likes: 0,
        comments: 0,
        time: "刚刚",
        location: newMoment.location
      };
      setMoments(prev => [moment, ...prev]);
      setActiveTab("moments");
    };

    window.addEventListener('new-moment-posted' as any, handleNewMoment as any);
    return () => {
      window.removeEventListener('new-moment-posted' as any, handleNewMoment as any);
    };
  }, []);

  if (isStoreMode) {
    return <StoreMode onExit={() => setIsStoreMode(false)} onBack={() => setIsStoreMode(false)} onConsume={handleAddConsumptionMarker} />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="relative h-full w-full overflow-hidden bg-slate-50">
        {/* Map Background (Always rendered but hidden when not active) */}
        <div className={cn("absolute inset-0 z-0 transition-opacity duration-500", activeTab === "encounter" ? "opacity-100" : "opacity-0 pointer-events-none")}>
          <MapView 
            onMapReady={(map: any, setMarkerData: any) => {
              mapRef.current = map;
              setMarkerDataRef.current = setMarkerData;
              
              // Add click listener to map to close user card
              map.addListener('click', () => {
                setSelectedFriend(null);
                setIsNavVisible(true);
              });

              // Custom overlay for user markers
              const createMarkerContent = (user: Friend) => {
                const div = document.createElement('div');
                div.className = 'relative group cursor-pointer transform transition-transform hover:scale-110';
                
                // Status color mapping
                let statusColor = 'bg-slate-300'; // offline
                if (user.status === 'online') statusColor = 'bg-green-500';
                else if (user.status === '15m') statusColor = 'bg-green-400';
                else if (user.status === '3h') statusColor = 'bg-yellow-400';
                else if (user.status === '24h') statusColor = 'bg-orange-400';

                div.innerHTML = `
                  <div class="w-12 h-12 rounded-full p-0.5 ${user.gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'} shadow-lg relative">
                    <img src="${user.avatar}" class="w-full h-full rounded-full object-cover border-2 border-white" />
                    <div class="absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${statusColor}"></div>
                  </div>
                `;
                return div;
              };

              // Add markers
              const overlays: any[] = [];
              
              // Override setMarkerData to handle custom markers
              setMarkerDataRef.current = (data: any[]) => {
                // Clear existing overlays
                overlays.forEach(o => o.setMap(null));
                overlays.length = 0;

                data.forEach((point: any) => {
                  if (!point || !point.data) return;
                  
                  // Use AdvancedMarkerElement if available, otherwise fallback to OverlayView
                  const overlay = new google.maps.OverlayView();
                  overlay.onAdd = function() {
                    const layer = this.getPanes()?.floatPane;
                    if (layer) {
                      const element = createMarkerContent(point.data);
                      element.style.position = 'absolute';
                      element.onclick = (e) => {
                        e.stopPropagation();
                        setSelectedFriend(point.data);
                        setIsNavVisible(false);
                        
                        // Center map on user
                        map.panTo({ lat: point.lat, lng: point.lng });
                        map.setZoom(16);
                      };
                      layer.appendChild(element);
                      (this as any).element = element;
                    }
                  };
                  overlay.draw = function() {
                    const projection = this.getProjection();
                    if (projection && (this as any).element) {
                      const position = projection.fromLatLngToDivPixel(new google.maps.LatLng(point.lat, point.lng));
                      if (position) {
                        (this as any).element.style.left = (position.x - 24) + 'px';
                        (this as any).element.style.top = (position.y - 48) + 'px';
                      }
                    }
                  };
                  overlay.onRemove = function() {
                    if ((this as any).element) {
                      (this as any).element.parentNode.removeChild((this as any).element);
                      (this as any).element = null;
                    }
                  };
                  overlay.setMap(map);
                  overlays.push(overlay);
                });
              };
              
              // Initial load
              const markers = FRIENDS.map(f => ({
                id: f.id,
                lat: f.location!.lat,
                lng: f.location!.lng,
                type: "user",
                data: f
              }));
              if (setMarkerDataRef.current) {
                setMarkerDataRef.current(markers);
              }
            }}
          />
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
            <button 
              onClick={() => setActiveTab("friends")}
              className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-slate-200/60 flex items-center justify-center active:scale-95 transition-transform"
            >
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

        {/* Right Side Actions (Only for Map) */}
        {activeTab === "encounter" && (
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
                  className="absolute top-12 right-0 bg-white rounded-2xl shadow-xl p-4 w-64 flex flex-col gap-4 origin-top-right"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 mb-2">性别</div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setFilterGender(filterGender === 'male' ? null : 'male')}
                        className={cn(
                          "flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors",
                          filterGender === 'male' ? "bg-blue-50 text-blue-600 border border-blue-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                      >
                        男生
                      </button>
                      <button 
                        onClick={() => setFilterGender(filterGender === 'female' ? null : 'female')}
                        className={cn(
                          "flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors",
                          filterGender === 'female' ? "bg-pink-50 text-pink-600 border border-pink-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                      >
                        女生
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 mb-2">年龄</div>
                    <div className="grid grid-cols-4 gap-2">
                      {AGE_RANGES.map(range => (
                        <button 
                          key={range}
                          onClick={() => setFilterAge(filterAge === range ? null : range)}
                          className={cn(
                            "py-1.5 rounded-lg text-[10px] font-medium transition-colors",
                            filterAge === range ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 mb-2">星座</div>
                    <div className="grid grid-cols-4 gap-2">
                      {CONSTELLATIONS.map(constellation => (
                        <button 
                          key={constellation}
                          onClick={() => setFilterConstellation(filterConstellation === constellation ? null : constellation)}
                          className={cn(
                            "py-1.5 rounded-lg text-[10px] font-medium transition-colors",
                            filterConstellation === constellation ? "bg-purple-50 text-purple-600 border border-purple-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          {constellation}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full bg-slate-900 text-white py-2 rounded-xl text-xs font-bold mt-2 active:scale-95 transition-transform"
                  >
                    确认筛选
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 active:scale-95 transition-transform">
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Friends Tab Content */}
        <AnimatePresence>
          {activeTab === "friends" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-slate-50 pt-32 px-4 pb-24 overflow-y-auto"
            >
              <div className="space-y-3">
                {FRIENDS.map((friend) => (
                  <div key={friend.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 active:scale-[0.99] transition-transform" onClick={() => {
                    setSelectedFriend(friend);
                    setIsNavVisible(false);
                  }}>
                    <div className="relative">
                      <img src={friend.avatar} className="w-12 h-12 rounded-full object-cover" />
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white rounded-full",
                        friend.status === "online" ? "bg-green-500" : 
                        friend.status === "15m" ? "bg-green-400" :
                        friend.status === "3h" ? "bg-yellow-400" :
                        friend.status === "24h" ? "bg-orange-400" : "bg-slate-300"
                      )} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-900">{friend.name}</h3>
                        <span className="text-xs text-slate-400">{friend.distance}</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{friend.bio}</p>
                      <div className="flex gap-2 mt-2">
                        {friend.tags?.map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Moments Tab Content (Xiaohongshu Style) */}
        <AnimatePresence>
          {activeTab === "moments" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-slate-50 pt-32 px-2 pb-24 overflow-y-auto"
            >
              <div className="columns-2 gap-2 space-y-2">
                {moments.map((moment) => (
                  <div key={moment.id} className="break-inside-avoid bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
                    {moment.image && (
                      <div className="w-full aspect-[3/4] relative">
                        <img src={moment.image} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-2">
                      <p className="text-slate-900 text-sm font-medium line-clamp-2 mb-2">{moment.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <img src={moment.user.avatar} className="w-4 h-4 rounded-full object-cover" />
                          <span className="text-[10px] text-slate-500 truncate max-w-[60px]">{moment.user.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] text-slate-400">{moment.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Floating Action Button for Moments */}
              <button className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 active:scale-95 transition-transform z-30">
                <Plus className="w-5 h-5" />
                <span className="font-bold text-sm">发布动态</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Meet Tab Content (Refactored) */}
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

              {/* Scenario Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">场景推荐</h3>
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                  {SCENARIOS.map(scenario => (
                    <button
                      key={scenario.id}
                      onClick={() => setSelectedCategory(selectedCategory === scenario.id ? null : scenario.id)}
                      className={cn(
                        "flex-shrink-0 px-4 py-2 rounded-full flex items-center gap-2 transition-all",
                        selectedCategory === scenario.id 
                          ? "bg-slate-900 text-white shadow-lg scale-105" 
                          : "bg-white text-slate-600 border border-slate-100"
                      )}
                    >
                      <scenario.icon className={cn("w-4 h-4", selectedCategory === scenario.id ? "text-white" : scenario.color)} />
                      <span className="text-sm font-medium">{scenario.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan Recommendations */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">精选方案</h3>
                {filteredPlans.map(plan => (
                  <div key={plan.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 active:scale-[0.99] transition-transform">
                    <img src={plan.image} className="w-24 h-24 rounded-xl object-cover" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-slate-900">{plan.title}</h4>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-xs font-bold">{plan.rating}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mb-2">
                          {plan.tags.map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {plan.steps.map((step, i) => (
                            <div key={i} className="flex items-center gap-1 text-xs text-slate-400">
                              <step.icon className="w-3 h-3" />
                              <span>{step.label}</span>
                              {i < plan.steps.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                            </div>
                          ))}
                        </div>
                        <span className="text-sm font-bold text-slate-900">¥{plan.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Detail Modal */}
        <AnimatePresence>
          {selectedFriend && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setSelectedFriend(null);
                  setIsNavVisible(true);
                }}
                className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-40"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
              >
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6" />
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <img src={selectedFriend.avatar} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" />
                    <div className={cn(
                      "absolute bottom-0 right-0 w-5 h-5 border-2 border-white rounded-full flex items-center justify-center",
                      selectedFriend.status === "online" ? "bg-green-500" : 
                      selectedFriend.status === "15m" ? "bg-green-400" :
                      selectedFriend.status === "3h" ? "bg-yellow-400" :
                      selectedFriend.status === "24h" ? "bg-orange-400" : "bg-slate-300"
                    )}>
                      {selectedFriend.status === "online" && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedFriend.name}</h2>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {selectedFriend.distance}
                          </span>
                          <span>•</span>
                          <span>{selectedFriend.status === 'offline' ? selectedFriend.lastSeen || '离线' : '在线'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center active:scale-95 transition-transform">
                          <MessageCircle className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center active:scale-95 transition-transform">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1",
                        selectedFriend.gender === 'female' ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"
                      )}>
                        <span>{selectedFriend.age}岁</span>
                      </div>
                      <div className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 text-[10px] font-medium">
                        {selectedFriend.constellation}
                      </div>
                      {selectedFriend.tags?.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                  <p className="text-slate-600 text-sm leading-relaxed">
                    "{selectedFriend.bio}"
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">最近动态</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {selectedFriend.photos?.map((photo, i) => (
                      <img key={i} src={photo} className="w-24 h-32 rounded-xl object-cover flex-shrink-0" />
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedFriend(null);
                    setIsNavVisible(true);
                  }}
                  className="w-full bg-slate-100 text-slate-900 font-bold py-3 rounded-xl active:scale-[0.98] transition-transform"
                >
                  关闭卡片
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
