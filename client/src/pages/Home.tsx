import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Search, Filter, MapPin, Star, User, MessageCircle, Heart, Share2, MoreHorizontal, Navigation, Users, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
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
  { id: 5, name: "Eva", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", status: "recent", distance: "3.0km" },
];

const MOCK_SHOPS = [
  {
    id: 1,
    name: "Blue Bottle Coffee",
    type: "Cafe",
    rating: 4.8,
    price: "$$",
    distance: "0.3km",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop",
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
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
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
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop",
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
  const [ageFilter, setAgeFilter] = useState<string | null>(null);
  const [zodiacFilter, setZodiacFilter] = useState<string | null>(null);
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
        
        {/* Map Background */}
        <div className="absolute inset-0 z-0">
          <MapView onMapReady={handleMapReady} />
        </div>

        {/* Top Navigation & Search */}
        <AnimatePresence>
          {!isHeaderCollapsed && (
            <motion.div 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 left-0 right-0 z-20 pt-12 pb-4 px-4 bg-gradient-to-b from-white/90 via-white/80 to-transparent backdrop-blur-[2px]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-white/50 flex items-center px-4">
                  <Search className="w-4 h-4 text-slate-400 mr-2" />
                  <input 
                    type="text"
                    placeholder="搜索好友、动态或地点..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button 
                  className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-white/50 flex items-center justify-center active:scale-95 transition-transform"
                  onClick={() => setShowFilterModal(true)}
                >
                  <Filter className="w-4 h-4 text-slate-700" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center justify-between px-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={cn(
                      "flex flex-col items-center transition-all duration-300",
                      activeTab === tab.id ? "scale-110" : "opacity-60 scale-100"
                    )}
                  >
                    <span className={cn(
                      "text-base font-bold mb-0.5",
                      activeTab === tab.id ? "text-slate-800" : "text-slate-500"
                    )}>
                      {tab.label}
                    </span>
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTabIndicator"
                        className="w-1 h-1 bg-slate-800 rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Toggle Button */}
        <div className="absolute top-28 right-4 z-20 flex flex-col gap-3">
           {/* This is a placeholder to align with the filter button position if needed, 
               but since the filter button is inside the collapsible header, 
               we position this toggle button independently or relative to where the header ends.
               Actually, let's position it just below where the header WOULD be, or fixed.
               Better yet, let's put it below the filter button's usual position.
           */}
           <motion.button
             animate={{ top: isHeaderCollapsed ? 60 : 130 }} // Adjust position based on header state
             className="absolute right-0 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-md border border-white/50 flex items-center justify-center active:scale-95 transition-all duration-300"
             onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
             style={{ top: isHeaderCollapsed ? '60px' : '130px' }} // Fallback/Initial style
           >
             {isHeaderCollapsed ? (
               <ChevronDown className="w-5 h-5 text-slate-600" />
             ) : (
               <ChevronUp className="w-5 h-5 text-slate-600" />
             )}
           </motion.button>
        </div>


        {/* Content Area (Bottom Sheets / Cards) */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-20 pointer-events-none">
          {/* Shop Detail Card */}
          <AnimatePresence>
            {selectedShop && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto"
              >
                <div className="bg-white rounded-3xl shadow-2xl p-5 mb-20">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                      <img src={selectedShop.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 truncate">{selectedShop.name}</h3>
                          <div className="flex items-center gap-1 text-orange-400 mt-1">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-bold">{selectedShop.rating}</span>
                            <span className="text-slate-300 mx-1">|</span>
                            <span className="text-sm text-slate-500">{selectedShop.type}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedShop(null)}
                          className="p-1 hover:bg-slate-100 rounded-full"
                        >
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm text-slate-500">{selectedShop.distance} • {selectedShop.price}</div>
                        <Link href={`/merchant/${selectedShop.id}`}>
                          <button className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-full shadow-lg shadow-slate-900/20 active:scale-95 transition-transform">
                            进店看看
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Moment Detail Card */}
          <AnimatePresence>
            {selectedMoment && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto"
              >
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-20">
                  <div className="relative h-48">
                    <img src={selectedMoment.image} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setSelectedMoment(null)}
                      className="absolute top-4 right-4 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100">
                        <img src={selectedMoment.user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{selectedMoment.user?.name || "Unknown User"}</div>
                        <div className="text-xs text-slate-400">{selectedMoment.time || "Just now"}</div>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {selectedMoment.content}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex gap-4">
                        <button className="flex items-center gap-1.5 text-slate-500 hover:text-pink-500 transition-colors">
                          <Heart className="w-5 h-5" />
                          <span className="text-xs font-medium">{selectedMoment.likes || 0}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-xs font-medium">{selectedMoment.comments || 0}</span>
                        </button>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Horizontal Scroll Lists (When no selection) */}
          <AnimatePresence>
            {!selectedShop && !selectedMoment && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="pointer-events-auto pb-24 pl-4 overflow-x-auto no-scrollbar overscroll-x-contain"
                style={{ overscrollBehaviorX: 'contain' }}
              >
                <div className="flex gap-4 pr-4 w-max">
                  {activeTab === "meet" ? (
                    // Shop Cards
                    MOCK_SHOPS.map((shop, index) => (
                      <Link key={shop.id} href={`/merchant/${shop.id}`}>
                        <div 
                          ref={(el) => { shopCardRefs.current[index] = el; }}
                          className="w-72 bg-white rounded-2xl shadow-lg overflow-hidden shrink-0 active:scale-95 transition-transform duration-200"
                          onClick={() => {
                            setSelectedShop(shop);
                            mapInstance?.panTo({ lat: 39.9042, lng: 116.4074 }); // Mock location
                          }}
                        >
                          <div className="h-32 relative">
                            <img src={shop.image} className="w-full h-full object-cover" />
                            <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-slate-800">
                              {shop.rating} ★
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-slate-900 mb-1">{shop.name}</h3>
                            <div className="flex items-center text-xs text-slate-500 mb-3">
                              <span>{shop.type}</span>
                              <span className="mx-1">•</span>
                              <span>{shop.distance}</span>
                              <span className="mx-1">•</span>
                              <span>{shop.price}</span>
                            </div>
                            <div className="flex gap-2">
                              {shop.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-slate-100 rounded-md text-[10px] text-slate-600 font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : activeTab === "moments" ? (
                    // Moment Cards
                    markerData.moments.map((moment: any) => (
                      <div 
                        key={moment.id}
                        className="w-64 bg-white rounded-2xl shadow-lg overflow-hidden shrink-0 active:scale-95 transition-transform duration-200"
                        onClick={() => {
                          setSelectedMoment(moment);
                          mapInstance?.panTo({ lat: moment.lat, lng: moment.lng });
                        }}
                      >
                        <div className="h-40 relative">
                          <img src={moment.image} className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full border border-white/50 overflow-hidden">
                                <img src={MOCK_MOMENTS[0].user.avatar} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-white text-xs font-medium truncate">User {moment.id}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-slate-700 line-clamp-2 mb-2">
                            {moment.content || "Enjoying a wonderful day out in the city! #lifestyle"}
                          </p>
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>2h ago</span>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {moment.likes}</span>
                              <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {moment.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // User/Friend Cards
                    (activeTab === "friends" ? markerData.friends : markerData.encounter)
                      .slice(0, 10)
                      .map((user: any) => (
                        <div 
                          key={user.id}
                          className="w-20 flex flex-col items-center shrink-0"
                          onClick={() => mapInstance?.panTo({ lat: user.lat, lng: user.lng })}
                        >
                          <div className={cn(
                            "w-16 h-16 rounded-full border-2 p-0.5 mb-2 relative",
                            user.gender === "female" ? "border-pink-400" : "border-blue-400"
                          )}>
                            <img src={user.image} className="w-full h-full object-cover rounded-full" />
                            <div className={cn(
                              "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white",
                              user.status === "online" ? "bg-green-500" : "bg-yellow-500"
                            )} />
                          </div>
                          <span className="text-xs font-medium text-slate-700 truncate w-full text-center">
                            {user.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            0.5km
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filter Modal */}
        <AnimatePresence>
          {showFilterModal && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 z-40 backdrop-blur-sm"
                onClick={() => setShowFilterModal(false)}
              />
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 pb-10"
              >
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
                <h3 className="text-lg font-bold text-slate-900 mb-6">筛选显示</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-3 block">性别</label>
                    <div className="flex gap-3">
                      {[
                        { id: "all", label: "全部" },
                        { id: "male", label: "男生" },
                        { id: "female", label: "女生" }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setGenderFilter(opt.id as any)}
                          className={cn(
                            "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                            genderFilter === opt.id
                              ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
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

                  <button 
                    onClick={() => setShowFilterModal(false)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 active:scale-95 transition-transform mt-4"
                  >
                    确认
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
