import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, ChevronRight, Star, Map as MapIcon, List, Heart, Share2, Clock, ScanLine, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import MapView from "@/components/Map";
import { createRoot } from "react-dom/client";
import { Skeleton } from "@/components/ui/skeleton";

// Enriched Mock Data based on Screenshots
const CATEGORIES = [
  { id: "couple", label: "情侣套餐", subLabel: "约会首选" },
  { id: "dinner", label: "浪漫晚餐", subLabel: "" },
  { id: "relax", label: "轻松休闲", subLabel: "" },
  { id: "interactive", label: "互动体验", subLabel: "" },
  { id: "view", label: "景观餐厅", subLabel: "" },
  { id: "bestie", label: "闺蜜套餐", subLabel: "出片圣地" },
  { id: "photo", label: "拍照打卡", subLabel: "" },
  { id: "tea", label: "下午茶", subLabel: "" },
  { id: "breakfast", label: "精致早午餐", subLabel: "" },
  { id: "shop", label: "逛吃逛吃", subLabel: "" },
  { id: "bro", label: "兄弟套餐", subLabel: "聚会必去" },
  { id: "bbq", label: "烧烤撸串", subLabel: "" },
  { id: "drink", label: "小酌一杯", subLabel: "" },
  { id: "game", label: "电竞网咖", subLabel: "" },
  { id: "sport", label: "运动看球", subLabel: "" },
  { id: "fun", label: "情趣套餐", subLabel: "人气推荐" },
];

const MERCHANTS = [
  {
    id: 1,
    title: "丝路星光·旋转餐厅",
    category: "couple",
    subCategory: "dinner",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=400&fit=crop",
    rating: 4.9,
    price: "¥320/人",
    location: "大巴扎步行街",
    distance: "500m",
    isTop: true,
    topLabel: "猜你喜欢",
    coupon: {
      title: "周末浪漫抵扣券",
      value: "¥50",
      condition: "满¥100可用",
      limit: "仅剩2h",
      tag: "限时"
    },
    lat: 39.9355,
    lng: 116.4551
  },
  {
    id: 2,
    title: "天山雪莲·私房菜",
    category: "couple",
    subCategory: "dinner",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=400&fit=crop",
    rating: 4.8,
    price: "¥520/人",
    location: "沙依巴克区",
    distance: "2.5km",
    isTop: true,
    topLabel: "榜单TOP",
    rank: "沙依巴克区私房菜热门榜第2名",
    tags: ["私房菜", "包间", "定制服务", "营业中"],
    deal: {
      title: "520限定告白套餐",
      price: "¥1314",
      originalPrice: "¥1999"
    },
    lat: 39.9255,
    lng: 116.5181
  },
  {
    id: 3,
    title: "花田错·下午茶",
    category: "bestie",
    subCategory: "tea",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=400&fit=crop",
    rating: 4.9,
    price: "¥158/人",
    location: "新市区",
    distance: "800m",
    isTop: true,
    topLabel: "榜单TOP",
    rank: "新市区网红打卡圣地第1名",
    tags: ["粉色主题", "甜点", "出片"],
    deal: {
      title: "梦幻公主双人下午茶",
      price: "¥268",
      originalPrice: "¥398"
    },
    lat: 39.9995,
    lng: 116.4810
  },
  {
    id: 4,
    title: "时光胶片馆",
    category: "bestie",
    subCategory: "photo",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=400&fit=crop",
    rating: 4.6,
    price: "¥88/人",
    location: "天山区",
    distance: "1.5km",
    tags: ["自拍馆", "换装", "场景丰富"],
    deal: {
      title: "双人畅拍2小时",
      price: "¥128",
      originalPrice: "¥256"
    },
    lat: 39.9405,
    lng: 116.4020
  },
  {
    id: 5,
    title: "兄弟烤肉·大巴扎店",
    category: "bro",
    subCategory: "bbq",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop",
    rating: 4.6,
    price: "¥110/人",
    location: "天山区",
    distance: "300m",
    isTop: true,
    topLabel: "榜单TOP",
    rank: "乌鲁木齐烧烤必吃榜",
    tags: ["红柳烤肉", "夺命大乌苏", "热闹"],
    deals: [
      { title: "兄弟畅饮4人餐", price: "¥388", originalPrice: "¥528" },
      { title: "双人撸串套餐", price: "¥168", originalPrice: "¥228" }
    ],
    lat: 40.0100,
    lng: 116.5500
  },
  {
    id: 6,
    title: "小房子·明园店",
    category: "bro",
    subCategory: "bbq",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop",
    rating: 4.5,
    price: "¥85/人",
    location: "沙依巴克区",
    distance: "3.2km",
    tags: ["新疆菜", "老字号", "聚餐", "营业中"],
    deal: {
      title: "经典大盘鸡4人餐",
      price: "¥268",
      originalPrice: "¥358"
    },
    lat: 39.9000,
    lng: 116.4000
  },
  {
    id: 7,
    title: "红山顶·云端酒廊",
    category: "couple",
    subCategory: "drink",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=400&fit=crop",
    rating: 4.7,
    price: "¥280/人",
    location: "水磨沟区",
    distance: "1.2km",
    tags: ["高空", "鸡尾酒", "爵士乐"],
    deals: [
      { title: "云端微醺双人套餐", price: "¥398", originalPrice: "¥588" },
      { title: "经典鸡尾酒2杯", price: "¥128", originalPrice: "¥198" }
    ],
    lat: 39.9500,
    lng: 116.4600
  }
];

export default function MeetPage() {
  const [activeCategory, setActiveCategory] = useState("couple");
  const [activeSubCategory, setActiveSubCategory] = useState("dinner");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [overlays, setOverlays] = useState<google.maps.OverlayView[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter logic
  const filteredMerchants = MERCHANTS.filter(m => {
    if (activeSubCategory) {
      return m.subCategory === activeSubCategory;
    }
    return m.category === activeCategory;
  });

  // Simulate loading when category changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); // 600ms loading simulation
    return () => clearTimeout(timer);
  }, [activeCategory, activeSubCategory]);

  // Map Effect
  useEffect(() => {
    if (!mapInstance || viewMode !== "map") return;
    overlays.forEach(overlay => overlay.setMap(null));
    setOverlays([]);
    const newOverlays: google.maps.OverlayView[] = [];

    class CustomOverlay extends google.maps.OverlayView {
      position: google.maps.LatLng;
      content: HTMLElement;
      constructor(position: google.maps.LatLng, content: HTMLElement) {
        super();
        this.position = position;
        this.content = content;
      }
      onAdd() {
        const panes = this.getPanes();
        if (panes) {
          panes.overlayMouseTarget.appendChild(this.content);
          ['click', 'mousedown', 'touchstart', 'pointerdown'].forEach(eventName => {
            google.maps.event.addDomListener(this.content, eventName, (e: Event) => { e.stopPropagation(); });
          });
        }
      }
      draw() {
        const projection = this.getProjection();
        if (projection) {
          const pixel = projection.fromLatLngToDivPixel(this.position);
          if (pixel) {
            this.content.style.position = 'absolute';
            this.content.style.left = pixel.x + 'px';
            this.content.style.top = pixel.y + 'px';
            this.content.style.zIndex = '100';
            this.content.style.transform = 'translate(-50%, -100%)';
          }
        }
      }
      onRemove() {
        if (this.content.parentElement) this.content.parentElement.removeChild(this.content);
      }
    }

    filteredMerchants.forEach((merchant) => {
      const div = document.createElement('div');
      div.style.cursor = 'pointer';
      const root = createRoot(div);
      root.render(
        <div className="relative group">
          <div className="relative z-10 bg-white rounded-xl shadow-lg p-1 border border-slate-100 transform transition-transform hover:scale-110">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img src={merchant.image} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-slate-100"></div>
          </div>
        </div>
      );
      const overlay = new CustomOverlay(new google.maps.LatLng(merchant.lat, merchant.lng), div);
      overlay.setMap(mapInstance);
      newOverlays.push(overlay);
    });
    setOverlays(newOverlays);
    if (filteredMerchants.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      filteredMerchants.forEach(m => bounds.extend({ lat: m.lat, lng: m.lng }));
      mapInstance.fitBounds(bounds);
    }
    return () => { newOverlays.forEach(overlay => overlay.setMap(null)); };
  }, [mapInstance, filteredMerchants, viewMode]);

  return (
    <Layout showNav={true}>
      <div className="flex flex-col h-screen bg-slate-50">
        {/* Top Header */}
        <div className="bg-white px-4 pt-safe pb-2 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3 flex-1">
            <Button variant="ghost" size="icon" className="-ml-2">
              <List className="w-6 h-6 text-slate-900" />
            </Button>
            <div className="flex-1 h-9 bg-slate-100 rounded-full flex items-center px-3 gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">搜索...</span>
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Button variant="ghost" size="icon" className="text-slate-600">
              <ShoppingBag className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-600">
              <Heart className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-600"
              onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
            >
              {viewMode === "list" ? <MapIcon className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Store Mode Entry (Floating) */}
        <Link href="/store-mode">
          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-24 right-4 z-30 bg-slate-900 text-white p-3 rounded-full shadow-xl flex items-center justify-center"
          >
            <ScanLine className="w-6 h-6" />
          </motion.div>
        </Link>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-24 bg-white h-full overflow-y-auto pb-24 flex-shrink-0 border-r border-slate-100">
            <div className="flex items-center gap-1 px-3 py-3 text-sm font-bold text-slate-900">
              <span>全城</span>
              <ChevronRight className="w-3 h-3" />
            </div>
            
            <div className="space-y-1">
              {CATEGORIES.map(cat => {
                const isMain = !!cat.subLabel;
                
                if (isMain) {
                  return (
                    <div key={cat.id} className="mt-4 mb-1">
                      <button
                        onClick={() => { setActiveCategory(cat.id); setActiveSubCategory(""); }}
                        className={cn(
                          "w-full text-left px-3 py-1 text-sm font-bold relative",
                          activeCategory === cat.id ? "text-orange-500" : "text-slate-900"
                        )}
                      >
                        {activeCategory === cat.id && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-orange-500 rounded-r-full" />
                        )}
                        {cat.label}
                      </button>
                      {cat.subLabel && (
                        <div className="px-3 text-[10px] text-slate-400 mb-2">{cat.subLabel}</div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveSubCategory(cat.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm transition-colors",
                        activeSubCategory === cat.id 
                          ? "bg-orange-50 text-orange-600 font-medium rounded-r-full mr-2" 
                          : "text-slate-500"
                      )}
                    >
                      {cat.label}
                    </button>
                  );
                }
              })}
            </div>
          </div>

          {/* Right Content Stream */}
          <div className="flex-1 h-full overflow-y-auto bg-slate-50 pb-24 relative">
            {viewMode === "map" ? (
              <div className="absolute inset-0 z-10">
                <MapView onMapReady={setMapInstance} />
              </div>
            ) : (
              <div className="p-3 space-y-3">
                {/* Top Banner / Recommendations */}
                <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                      <div className="bg-white/20 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        猜你喜欢 (3)
                      </div>
                      <div className="bg-white/20 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full">
                        周末去哪儿
                      </div>
                      <div className="bg-white/20 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full">
                        深夜食堂
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2 pb-1">
                  <button className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1">
                    离我最近 <ChevronRight className="w-3 h-3 rotate-90" />
                  </button>
                  <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs whitespace-nowrap flex items-center gap-1">
                    服务筛选 <ChevronRight className="w-3 h-3 rotate-90" />
                  </button>
                  <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs whitespace-nowrap flex items-center gap-1">
                    价格不限 <ChevronRight className="w-3 h-3 rotate-90" />
                  </button>
                  <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs whitespace-nowrap">
                    好评优先
                  </button>
                </div>

                {/* Merchant Cards with Skeleton Loading */}
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 p-3">
                          <div className="flex gap-3">
                            <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-5 w-3/4" />
                              <div className="flex gap-2">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-16" />
                              </div>
                              <Skeleton className="h-4 w-1/2" />
                              <div className="flex gap-1 pt-1">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-12" />
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-50">
                            <Skeleton className="h-6 w-full rounded" />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {filteredMerchants.length > 0 ? (
                        filteredMerchants.map((item) => (
                          <Link key={item.id} href={`/merchant/${item.id}`}>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 mb-4 block"
                            >
                              <div className="flex p-3 gap-3">
                                {/* Image */}
                                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                                  <img src={item.image} className="w-full h-full object-cover" />
                                  {item.isTop && (
                                    <div className="absolute top-0 left-0 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-br-lg flex items-center gap-0.5">
                                      <Star className="w-2 h-2 fill-white" />
                                      {item.topLabel}
                                    </div>
                                  )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-slate-900 truncate text-base">{item.title}</h3>
                                    <div className="flex gap-2 text-slate-400">
                                      <Share2 className="w-4 h-4" />
                                      <Heart className="w-4 h-4" />
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 mt-1 text-xs">
                                    <span className="text-orange-500 font-bold text-sm">{item.rating}分</span>
                                    <span className="text-slate-900 font-medium">{item.price}</span>
                                    <span className="text-slate-400">|</span>
                                    <span className="text-slate-400 truncate">{item.location} · {item.distance}</span>
                                  </div>

                                  {item.rank && (
                                    <div className="mt-1.5 inline-block bg-orange-50 text-orange-600 text-[10px] px-1.5 py-0.5 rounded">
                                      {item.rank}
                                    </div>
                                  )}

                                  {item.tags && (
                                    <div className="flex gap-1 mt-1.5 flex-wrap">
                                      {item.tags.map((tag, i) => (
                                        <span key={i} className="border border-slate-200 text-slate-500 text-[10px] px-1 py-0.5 rounded">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Coupon / Deal Section */}
                              {item.coupon && (
                                <div className="mx-3 mb-3 bg-red-50 rounded-lg p-2 flex items-center justify-between border border-red-100">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-red-400 text-white text-[10px] px-1 rounded">{item.coupon.tag}</span>
                                    <span className="text-red-500 font-bold text-sm">{item.coupon.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-red-600 font-bold text-lg">{item.coupon.value}</span>
                                    <div className="text-[10px] text-red-400 text-right leading-tight">
                                      <div className="line-through">¥100</div>
                                      <div>{item.coupon.limit}</div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {item.deal && (
                                <div className="mx-3 mb-3 flex items-center gap-2 text-sm border-t border-slate-50 pt-2">
                                  <span className="bg-red-100 text-red-500 text-[10px] w-4 h-4 flex items-center justify-center rounded">团</span>
                                  <span className="text-slate-700 truncate flex-1">{item.deal.title}</span>
                                  <span className="text-red-500 font-bold">{item.deal.price}</span>
                                  <span className="text-slate-300 text-xs line-through">{item.deal.originalPrice}</span>
                                </div>
                              )}

                              {item.deals && item.deals.map((deal, i) => (
                                <div key={i} className="mx-3 mb-2 flex items-center gap-2 text-sm last:mb-3">
                                  <span className="bg-red-100 text-red-500 text-[10px] w-4 h-4 flex items-center justify-center rounded">团</span>
                                  <span className="text-slate-700 truncate flex-1">{deal.title}</span>
                                  <span className="text-red-500 font-bold">{deal.price}</span>
                                  <span className="text-slate-300 text-xs line-through">{deal.originalPrice}</span>
                                </div>
                              ))}
                            </motion.div>
                          </Link>
                        ))
                      ) : (
                        <div className="text-center text-slate-300 text-xs py-12">
                          <div className="mb-2 text-4xl">🏜️</div>
                          该分类下暂无商家，去其他分类看看吧 ~
                        </div>
                      )}
                      
                      {filteredMerchants.length > 0 && (
                        <div className="text-center text-slate-300 text-xs py-4">
                          已经到底啦，去其他分类看看吧 ~
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
