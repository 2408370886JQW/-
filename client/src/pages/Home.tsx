import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Smile, User, Image as ImageIcon, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import MapView from "@/components/Map";

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
  merchants: [
    { id: 7, lat: 39.906, lng: 116.412, type: "merchant", icon: ShoppingBag },
    { id: 8, lat: 39.910, lng: 116.402, type: "merchant", icon: ShoppingBag },
  ],
};

type TabType = "encounter" | "friends" | "moments" | "merchants";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("encounter");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  const tabs: { id: TabType; label: string }[] = [
    { id: "encounter", label: "偶遇" },
    { id: "friends", label: "好友" },
    { id: "moments", label: "动态" },
    { id: "merchants", label: "商家" },
  ];

  // Update markers when tab changes
  useEffect(() => {
    if (!mapInstance) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    // Add new markers based on active tab
    const newMarkers = MOCK_MARKERS[activeTab].map(item => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = `
        <div class="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-slate-800 transform transition-transform hover:scale-110">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${getIconPath(item.type)}
          </svg>
        </div>
      `;

      // Note: Since we're using standard Google Maps Marker, we can't easily use custom HTML elements 
      // without AdvancedMarkerElement (which might need map ID). 
      // For simplicity in this prototype, we'll use standard markers with labels or simple icons if possible,
      // or just rely on the default marker for now and simulate the visual with overlays if needed.
      // However, to match the wireframe better, let's try to use standard markers with different colors/labels first.
      
      return new google.maps.Marker({
        position: { lat: item.lat, lng: item.lng },
        map: mapInstance,
        title: item.type,
        animation: google.maps.Animation.DROP,
      });
    });

    setMarkers(newMarkers);
  }, [activeTab, mapInstance]);

  // Helper to get SVG path for different types (for reference/future custom overlay implementation)
  const getIconPath = (type: string) => {
    switch(type) {
      case 'encounter': return '<circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>'; // Smile
      case 'friend': return '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>'; // User
      case 'moment': return '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>'; // Image
      case 'merchant': return '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>'; // ShoppingBag
      default: return '';
    }
  };

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
          
          {/* Center "MAP" Label Placeholder (Visual match to wireframe) */}
          {/* In a real app this would be the actual map content. 
              Adding a visual cue here to mimic the wireframe's "MAP" box if map fails to load 
              or just as a center anchor point */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0">
            <div className="bg-white/80 backdrop-blur px-6 py-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-lg font-bold text-slate-400 tracking-widest">MAP</span>
            </div>
          </div>

          {/* Wireframe-style connection lines (Visual decoration) */}
          {/* These are just static SVG overlays to mimic the wireframe look, 
              in a real app these would be dynamic connections between users */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
            <line x1="50%" y1="50%" x2="20%" y2="30%" stroke="currentColor" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="currentColor" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="20%" y2="70%" stroke="currentColor" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="80%" y2="70%" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </Layout>
  );
}
