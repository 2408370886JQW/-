import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Search, Filter, MapPin, Star, User, MessageCircle, Heart, Share2, MoreHorizontal, Navigation, Users, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import MapView from "@/components/Map";
import { createRoot } from "react-dom/client";

// Mock Data
const MOCK_MOMENTS = [
  {
    id: 1,
    user: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      status: "online"
    },
    content: "Found this amazing coffee shop in Sanlitun! ☕️ The atmosphere is just perfect for working.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop",
    location: "Arabica Coffee, Sanlitun",
    likes: 128,
    comments: 42,
    time: "2h ago",
    hashtags: ["#coffee", "#beijing", "#worklife"]
  },
  {
    id: 2,
    user: {
      name: "Mike Ross",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      status: "offline"
    },
    content: "Weekend hiking at Fragrant Hills. The autumn colors are breathtaking! 🍁",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop",
    location: "Fragrant Hills Park",
    likes: 256,
    comments: 89,
    time: "5h ago",
    hashtags: ["#hiking", "#nature", "#autumn"]
  }
];

const MOCK_FRIENDS = [
  { id: 1, name: "Alice", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", status: "online", distance: "0.5km" },
  { id: 2, name: "Bob", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", status: "recent", distance: "1.2km" },
  { id: 3, name: "Carol", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", status: "offline", distance: "2.5km" },
  { id: 4, name: "David", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", status: "online", distance: "0.8km" },
  { id: 5, name: "Eva", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656ec?w=100&h=100&fit=crop", status: "recent", distance: "3.0km" },
];

const MOCK_SHOPS = [
  {
    id: 1,
    name: "Blue Bottle Coffee",
    type: "Cafe",
    rating: 4.8,
    price: "$$",
    distance: "0.3km",
    image: "https://images.unsplash.com/photo-1453614512568-c4024d139247?w=800&h=600&fit=crop",
    tags: ["Specialty Coffee", "Minimalist"],
    address: "123 Sanlitun Rd"
  },
  {
    id: 2,
    name: "Wagas",
    type: "Healthy Food",
    rating: 4.5,
    price: "$$$",
    distance: "0.5km",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=600&fit=crop",
    tags: ["Salad", "Pasta", "Juice"],
    address: "456 Chaoyang Park Rd"
  },
  {
    id: 3,
    name: "TRB Hutong",
    type: "Fine Dining",
    rating: 4.9,
    price: "$$$$",
    distance: "1.2km",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?w=800&h=600&fit=crop",
    tags: ["French", "Historic", "View"],
    address: "23 Shatan N St"
  },
  {
    id: 4,
    name: "Jing Yaa Tang",
    type: "Chinese",
    rating: 4.7,
    price: "$$$",
    distance: "0.8km",
    image: "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?w=800&h=600&fit=crop",
    tags: ["Peking Duck", "Dim Sum"],
    address: "19 Sanlitun Rd"
  },
  {
    id: 5,
    name: "Great Leap Brewing",
    type: "Bar",
    rating: 4.6,
    price: "$$",
    distance: "1.5km",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop",
    tags: ["Craft Beer", "Burgers"],
    address: "6 Xinzhong St"
  }
];

// Custom Marker Icons (SVG strings)
const UserIcon = {
  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="white" stroke="#3B82F6" stroke-width="2"/>
      <circle cx="20" cy="20" r="16" fill="#EFF6FF"/>
    </svg>
  `)}`,
  scaledSize: { width: 40, height: 40 },
  anchor: { x: 20, y: 20 }
};

const ShopIcon = {
  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm0 24c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" fill="#F59E0B"/>
    </svg>
  `)}`,
  scaledSize: { width: 32, height: 32 },
  anchor: { x: 16, y: 16 }
};

const ImageIcon = {
  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="40" height="40" rx="8" fill="white" stroke="#E2E8F0" stroke-width="2"/>
    </svg>
  `)}`,
  scaledSize: { width: 48, height: 48 },
  anchor: { x: 24, y: 48 }
};

type TabType = "encounter" | "friends" | "moments" | "meet";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("encounter");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markerData, setMarkerData] = useState<any>({
    encounter: [],
    friends: [],
    moments: [],
    meet: []
  });
  const [overlays, setOverlays] = useState<google.maps.OverlayView[]>([]);
  const [selectedMoment, setSelectedMoment] = useState<any>(null);
  const [showFriendList, setShowFriendList] = useState(false);
  const [selectedShop, setSelectedShop] = useState<any>(null);

  // State for Nav Hiding
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [showStoreMode, setShowStoreMode] = useState(false);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLDivElement>(null);
  const shopCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Generate random markers for demo
  useEffect(() => {
    const generateMarkers = (count: number, type: string) => {
      return Array.from({ length: count }).map((_, i) => ({
        id: i,
        lat: 39.9042 + (Math.random() - 0.5) * 0.05,
        lng: 116.4074 + (Math.random() - 0.5) * 0.05,
        type,
        title: `${type} ${i + 1}`,
        gender: Math.random() > 0.5 ? "male" : "female",
        status: Math.random() > 0.3 ? "online" : "recent",
        image: MOCK_MOMENTS[i % MOCK_MOMENTS.length]?.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop",
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20)
      }));
    };

    setMarkerData({
      encounter: generateMarkers(20, "user"),
      friends: generateMarkers(10, "friend"),
      moments: generateMarkers(15, "moment"),
      meet: generateMarkers(12, "shop")
    });
  }, []);

  // Map Ready Handler
  const handleMapReady = (map: google.maps.Map) => {
    setMapInstance(map);
    
    // Set map style to minimal/clean
    map.setOptions({
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        }
      ],
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      clickableIcons: false,
      gestureHandling: "greedy", // Allow single finger pan
    });

    // Add click listener to map to hide overlays/nav
    map.addListener('click', () => {
      setSelectedMoment(null);
      setSelectedShop(null);
      setIsNavVisible(true); // Show nav on map click
    });

    // Add drag listener to hide nav
    map.addListener('dragstart', () => {
      setIsNavVisible(false);
    });

    map.addListener('dragend', () => {
      setTimeout(() => setIsNavVisible(true), 500);
    });
  };

  // Handle "New Moment" event from Create page
  useEffect(() => {
    if (!mapInstance) return;

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
      
      // Pan map to new moment location (simulated)
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
      
      if (currentY < startY - 10) {
        setIsNavVisible(false);
      } else if (currentY > startY + 10) {
        setIsNavVisible(true);
      }
      lastScrollY.current = currentY;
    };

    const handleTouchEnd = () => {
      isDragging = false;
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

  // Update markers on map
  useEffect(() => {
    if (!mapInstance) return;

    // Clear existing overlays
    overlays.forEach(overlay => overlay.setMap(null));
    const newOverlays: google.maps.OverlayView[] = [];

    // Filter markers based on active tab and filters
    let markersToShow = markerData[activeTab as keyof typeof markerData] || [];
    
    if (activeTab === "encounter") {
      markersToShow = markersToShow.filter((m: any) => {
        if (genderFilter === "all") return true;
        if (genderFilter === "male") return m.gender === "male" || m.gender === "Man";
        if (genderFilter === "female") return m.gender === "female" || m.gender === "Woman";
        return true;
      });
    }

    // Create overlays for each marker
    markersToShow.forEach((marker: any) => {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.cursor = 'pointer';
      
      // Render marker content based on type
      const root = createRoot(div);
      
      if (activeTab === "moments") {
        root.render(
          <div 
            className="relative group transform transition-all duration-300 hover:scale-110 hover:z-50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMoment(marker);
              mapInstance.panTo({ lat: marker.lat, lng: marker.lng });
            }}
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-white">
              <img src={marker.image} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <Heart className="w-3 h-3 text-white fill-white" />
            </div>
          </div>
        );
      } else if (activeTab === "meet") {
        // For meet tab, we use MOCK_SHOPS instead of random markers
        // But here we are iterating over random markers generated in useEffect
        // Let's fix this by using MOCK_SHOPS for 'meet' tab if available
      } else {
        // Default user/friend marker
        root.render(
          <div 
            className="relative transform transition-all duration-300 hover:scale-110 hover:z-50"
            onClick={(e) => {
              e.stopPropagation();
              // Show user profile or chat
            }}
          >
            <div className={cn(
              "w-10 h-10 rounded-full border-2 shadow-lg overflow-hidden bg-white",
              marker.gender === "female" ? "border-pink-400" : "border-blue-400"
            )}>
              <img src={marker.image} className="w-full h-full object-cover" />
            </div>
            <div className={cn(
              "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
              marker.status === "online" ? "bg-green-500" : "bg-yellow-500"
            )} />
          </div>
        );
      }

      // Custom Overlay Class
      class CustomOverlay extends google.maps.OverlayView {
        position: google.maps.LatLng;
        container: HTMLDivElement;

        constructor(position: google.maps.LatLng, container: HTMLDivElement) {
          super();
          this.position = position;
          this.container = container;
        }

        onAdd() {
          const panes = this.getPanes();
          if (panes) {
            panes.overlayMouseTarget.appendChild(this.container);
          }
        }

        draw() {
          const projection = this.getProjection();
          if (projection) {
            const point = projection.fromLatLngToDivPixel(this.position);
            if (point) {
              this.container.style.left = (point.x - 20) + 'px'; // Center horizontally
              this.container.style.top = (point.y - 40) + 'px'; // Bottom align
            }
          }
        }

        onRemove() {
          if (this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
          }
        }
      }

      const overlay = new CustomOverlay(
        new google.maps.LatLng(marker.lat, marker.lng),
        div
      );
      
      overlay.setMap(mapInstance);
      newOverlays.push(overlay);
    });

    // Special handling for 'meet' tab shops
    if (activeTab === "meet") {
      MOCK_SHOPS.forEach((shop) => {
        // Generate random position near center for demo shops
        const lat = 39.9042 + (Math.random() - 0.5) * 0.03;
        const lng = 116.4074 + (Math.random() - 0.5) * 0.03;
        
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.cursor = 'pointer';
        
        const root = createRoot(div);
        root.render(
          <div 
            className="relative transform transition-all duration-300 hover:scale-110 hover:z-50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedShop(shop);
              mapInstance.panTo({ lat, lng });
              // Scroll to card
              const index = MOCK_SHOPS.findIndex(s => s.id === shop.id);
              if (shopCardRefs.current[index]) {
                shopCardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
              }
            }}
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-orange-400">
                <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
              </div>
              <div className="mt-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-[10px] font-bold text-slate-800 whitespace-nowrap">
                {shop.name}
              </div>
            </div>
          </div>
        );

        // Reuse CustomOverlay class logic (simplified for brevity, ideally defined outside loop)
        class ShopOverlay extends google.maps.OverlayView {
            position: google.maps.LatLng;
            container: HTMLDivElement;
    
            constructor(position: google.maps.LatLng, container: HTMLDivElement) {
              super();
              this.position = position;
              this.container = container;
            }
    
            onAdd() {
              const panes = this.getPanes();
              if (panes) {
                panes.overlayMouseTarget.appendChild(this.container);
              }
            }
    
            draw() {
              const projection = this.getProjection();
              if (projection) {
                const point = projection.fromLatLngToDivPixel(this.position);
                if (point) {
                  this.container.style.left = (point.x - 20) + 'px';
                  this.container.style.top = (point.y - 40) + 'px';
                }
              }
            }
    
            onRemove() {
              if (this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
              }
            }
          }

        const overlay = new ShopOverlay(
          new google.maps.LatLng(lat, lng),
          div
        );
        overlay.setMap(mapInstance);
        newOverlays.push(overlay);
      });
    }

    setOverlays(newOverlays);

    return () => {
      newOverlays.forEach(overlay => overlay.setMap(null));
    };
  }, [mapInstance, activeTab, markerData, genderFilter]);

  // Calculate markers for fallback view
  let displayMarkers = markerData[activeTab as keyof typeof markerData] || [];
  if (activeTab === "encounter") {
    displayMarkers = displayMarkers.filter((m: any) => {
      if (genderFilter === "all") return true;
      if (genderFilter === "male") return m.gender === "male" || m.gender === "Man";
      if (genderFilter === "female") return m.gender === "female" || m.gender === "Woman";
      return true;
    });
  }

  const tabs = [
    { id: "encounter", label: "偶遇", subtitle: "身边的人" },
    { id: "friends", label: "好友", subtitle: "我的好友" },
    { id: "moments", label: "动态", subtitle: "看看新鲜事" },
    { id: "meet", label: "相见", subtitle: "发现美好生活" }
  ];

  return (
    <Layout showNav={isNavVisible}>
      <div className="relative w-full h-screen overflow-hidden bg-slate-50">
        
        {/* Top Navigation Bar - Auto Hide */}
        <motion.div 
          className="absolute top-0 left-0 right-0 z-30 pt-safe px-4 pb-2 bg-white shadow-sm pointer-events-none"
          animate={{ 
            y: (isNavVisible && activeTab !== 'meet' && !isHeaderCollapsed) ? 0 : -200,
            opacity: (isNavVisible && activeTab !== 'meet' && !isHeaderCollapsed) ? 1 : 0
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
                className="fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-white shadow-2xl z-50 flex flex-col"
              >
                <div className="p-4 border-b flex items-center justify-between bg-slate-50">
                  <h2 className="text-lg font-bold text-slate-800">好友列表</h2>
                  <button onClick={() => setShowFriendList(false)} className="p-2 hover:bg-slate-200 rounded-full">
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {MOCK_FRIENDS.map(friend => (
                    <div key={friend.id} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100 active:scale-95 transition-transform">
                      <div className="relative">
                        <img src={friend.avatar} className="w-12 h-12 rounded-full object-cover" />
                        <div className={cn(
                          "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                          friend.status === "online" ? "bg-green-500" : friend.status === "recent" ? "bg-yellow-500" : "bg-gray-400"
                        )} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800">{friend.name}</h3>
                        <p className="text-xs text-slate-500">{friend.distance} • {friend.status === "online" ? "在线" : "离线"}</p>
                      </div>
                      <button className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Full Screen Map */}
        <div className="absolute inset-0 z-0">
          <MapView onMapReady={handleMapReady} />
        </div>

        {/* Filter Button & Toggle */}
        <motion.div 
          animate={{ top: isHeaderCollapsed ? "1rem" : "9rem" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute right-4 z-10 flex flex-col gap-3"
        >
          <button 
            onClick={() => setShowFilterModal(true)}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-500 active:scale-95 transition-all"
          >
            <Filter className="w-5 h-5" />
          </button>

          {/* Collapse/Expand Toggle */}
          <button 
            onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-500 active:scale-95 transition-all"
          >
            {isHeaderCollapsed ? (
              <ChevronRight className="w-5 h-5 rotate-90" />
            ) : (
              <ChevronRight className="w-5 h-5 -rotate-90" />
            )}
          </button>
        </motion.div>

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
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 pb-safe"
              >
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
                <h3 className="text-lg font-bold text-slate-900 mb-4">筛选显示</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-3 block">性别</label>
                    <div className="flex gap-3">
                      {[
                        { id: "all", label: "全部" },
                        { id: "male", label: "男生" },
                        { id: "female", label: "女生" }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setGenderFilter(opt.id as any)}
                          className={cn(
                            "flex-1 h-10 rounded-full text-sm font-medium transition-all",
                            genderFilter === opt.id 
                              ? "bg-blue-500 text-white shadow-md shadow-blue-200" 
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowFilterModal(false)}
                    className="w-full h-12 bg-slate-900 text-white rounded-full font-bold text-base active:scale-95 transition-transform"
                  >
                    完成
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bottom Card List - Only for 'meet' tab */}
        <AnimatePresence>
          {activeTab === 'meet' && (
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-[80px] left-0 right-0 z-20 px-4 overflow-x-auto flex gap-4 pb-4 snap-x snap-mandatory no-scrollbar overscroll-contain touch-pan-x"
            >
              {MOCK_SHOPS.map((shop) => (
                <Link key={shop.id} href={`/merchant/${shop.id}`}>
                  <div 
                    className="snap-center shrink-0 w-[280px] bg-white rounded-2xl shadow-lg overflow-hidden active:scale-95 transition-transform"
                  >
                    <div className="h-32 relative">
                      <img src={shop.image} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {shop.rating}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-900 truncate flex-1">{shop.name}</h3>
                        <span className="text-xs font-medium text-slate-500">{shop.distance}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{shop.type} • {shop.price}</p>
                      <div className="flex flex-wrap gap-1">
                        {shop.tags.map((tag: string) => (
                          <span key={tag} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Moment Detail Modal */}
        <AnimatePresence>
          {selectedMoment && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedMoment(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-3xl z-50 overflow-hidden shadow-2xl max-h-[80vh] flex flex-col"
              >
                <div className="relative h-64 shrink-0">
                  <img src={selectedMoment.image} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setSelectedMoment(null)}
                    className="absolute top-4 right-4 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                  >
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={selectedMoment.user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h3 className="font-bold text-slate-900">{selectedMoment.user?.name || "Unknown User"}</h3>
                      <p className="text-xs text-slate-500">{selectedMoment.time || "Just now"}</p>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    {selectedMoment.content}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedMoment.hashtags?.map((tag: string) => (
                      <span key={tag} className="text-blue-500 text-sm font-medium">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex gap-4">
                      <button className="flex items-center gap-1 text-slate-500 hover:text-pink-500 transition-colors">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">{selectedMoment.likes || 0}</span>
                      </button>
                      <button className="flex items-center gap-1 text-slate-500 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{selectedMoment.comments || 0}</span>
                      </button>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600">
                      <Share2 className="w-5 h-5" />
                    </button>
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
