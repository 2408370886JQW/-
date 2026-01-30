import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Smile, User, Image as ImageIcon, ShoppingBag, Star, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import MapView from "@/components/Map";
import { Link } from "wouter";

// Mock data for map markers
const MOCK_MARKERS = {
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
  meet: [ // Renamed from merchants
    { id: 7, lat: 39.906, lng: 116.412, type: "meet", icon: ShoppingBag },
    { id: 8, lat: 39.910, lng: 116.402, type: "meet", icon: ShoppingBag },
  ],
};

// Mock data for Group Buy / Price Comparison (Meet tab)
const GROUP_BUY_DEALS = [
  {
    id: 1,
    name: "星巴克 (三里屯店)",
    distance: "500m",
    rating: 4.8,
    deals: [
      { title: "双人下午茶套餐", price: "¥68", originalPrice: "¥98", discount: "7折" },
      { title: "大杯拿铁兑换券", price: "¥28", originalPrice: "¥35", discount: "8折" }
    ],
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop"
  },
  {
    id: 2,
    name: "海底捞火锅 (王府井店)",
    distance: "1.2km",
    rating: 4.9,
    deals: [
      { title: "工作日午市双人餐", price: "¥198", originalPrice: "¥268", discount: "7.4折" },
      { title: "100元代金券", price: "¥88", originalPrice: "¥100", discount: "8.8折" }
    ],
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop"
  },
  {
    id: 3,
    name: "Blue Frog 蓝蛙",
    distance: "800m",
    rating: 4.6,
    deals: [
      { title: "汉堡啤酒套餐", price: "¥88", originalPrice: "¥128", discount: "6.9折" }
    ],
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&h=200&fit=crop"
  }
];

type TabType = "encounter" | "friends" | "moments" | "meet";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("encounter");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  const tabs: { id: TabType; label: string }[] = [
    { id: "encounter", label: "偶遇" },
    { id: "friends", label: "好友" },
    { id: "moments", label: "动态" },
    { id: "meet", label: "相见" }, // Renamed from 商家 to 相见
  ];

  // Update markers when tab changes
  useEffect(() => {
    if (!mapInstance) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    // Add new markers based on active tab
    const currentMarkers = MOCK_MARKERS[activeTab] || [];
    const newMarkers = currentMarkers.map(item => {
      return new google.maps.Marker({
        position: { lat: item.lat, lng: item.lng },
        map: mapInstance,
        title: item.type,
        animation: google.maps.Animation.DROP,
      });
    });

    setMarkers(newMarkers);
  }, [activeTab, mapInstance]);

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
          
          {/* Group Buy / Price Comparison List Overlay (Only for 'Meet' tab) */}
          {activeTab === "meet" && (
            <div className="absolute bottom-20 left-0 right-0 px-4 pb-4 z-10 max-h-[50%] overflow-y-auto no-scrollbar space-y-3">
              {GROUP_BUY_DEALS.map((deal) => (
                <Link key={deal.id} href={`/merchant/${deal.id}`}>
                  <div className="bg-white rounded-xl shadow-lg p-3 mb-3 flex gap-3 active:scale-98 transition-transform cursor-pointer">
                    {/* Merchant Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                      <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-900 truncate">{deal.name}</h3>
                        <span className="text-xs text-slate-500">{deal.distance}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-1 mb-2">
                        <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                        <span className="text-xs font-medium text-orange-400">{deal.rating}</span>
                      </div>

                      {/* Deals List */}
                      <div className="space-y-1.5">
                        {deal.deals.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-orange-50/50 rounded-md p-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Tag className="w-3 h-3 text-orange-500 flex-shrink-0" />
                              <span className="text-xs text-slate-700 truncate">{item.title}</span>
                            </div>
                            <div className="flex items-baseline gap-1 pl-2 flex-shrink-0">
                              <span className="text-sm font-bold text-orange-600">{item.price}</span>
                              <span className="text-[10px] text-slate-400 line-through">{item.originalPrice}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Wireframe-style connection lines (Visual decoration - only for encounter/friends) */}
          {(activeTab === "encounter" || activeTab === "friends") && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
              <line x1="50%" y1="50%" x2="20%" y2="30%" stroke="currentColor" strokeWidth="1" />
              <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="currentColor" strokeWidth="1" />
              <line x1="50%" y1="50%" x2="20%" y2="70%" stroke="currentColor" strokeWidth="1" />
              <line x1="50%" y1="50%" x2="80%" y2="70%" stroke="currentColor" strokeWidth="1" />
            </svg>
          )}
        </div>
      </div>
    </Layout>
  );
}
