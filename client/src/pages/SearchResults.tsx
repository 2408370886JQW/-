import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Search, User, ShoppingBag, MapPin, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

// Mock Data
const MOCK_RESULTS = {
  friends: [
    { id: 1, name: "Alice", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", status: "online", mutual: 3 },
    { id: 2, name: "Bob", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", status: "offline", mutual: 1 },
    { id: 3, name: "Charlie", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop", status: "away", mutual: 5 },
  ],
  packages: [
    { id: 1, title: "浪漫双人晚餐", shop: "TRB Hutong", price: 888, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&h=200&fit=crop", rating: 4.9 },
    { id: 2, title: "闺蜜下午茶", shop: "Algorithm 算法", price: 298, image: "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=200&h=200&fit=crop", rating: 4.8 },
  ],
  shops: [
    { id: 1, name: "TRB Hutong", type: "法餐", distance: "1.2km", rating: 4.9, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&h=200&fit=crop" },
    { id: 2, name: "Algorithm 算法", type: "咖啡厅", distance: "2.5km", rating: 4.8, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop" },
    { id: 3, name: "京兆尹", type: "素食", distance: "3.1km", rating: 5.0, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&h=200&fit=crop" },
  ]
};

type TabType = "all" | "friends" | "packages" | "shops";

export default function SearchResults() {
  const [location, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  
  // Parse query param from URL if needed, for now we manage state locally
  
  const tabs = [
    { id: "all", label: "综合" },
    { id: "friends", label: "好友" },
    { id: "packages", label: "套餐" },
    { id: "shops", label: "商户" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 px-4 pt-safe pb-2 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => setLocation("/")} className="p-2 -ml-2 text-slate-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索好友、套餐、商户" 
              className="w-full pl-9 bg-slate-100 border-none rounded-full h-9 text-sm"
            />
          </div>
          <button className="text-sm font-medium text-slate-600">搜索</button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 px-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`relative pb-2 text-sm font-medium transition-colors ${
                activeTab === tab.id ? "text-slate-900" : "text-slate-500"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-slate-900 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Friends Section */}
        {(activeTab === "all" || activeTab === "friends") && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900">好友</h3>
              {activeTab === "all" && <button onClick={() => setActiveTab("friends")} className="text-xs text-slate-400 flex items-center">查看更多 <ChevronRight className="w-3 h-3" /></button>}
            </div>
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
              {MOCK_RESULTS.friends.map(friend => (
                <div key={friend.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="relative">
                    <img src={friend.avatar} className="w-10 h-10 rounded-full object-cover" />
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      friend.status === "online" ? "bg-green-500" : 
                      friend.status === "away" ? "bg-yellow-500" : "bg-slate-300"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-sm">{friend.name}</div>
                    <div className="text-xs text-slate-400">{friend.mutual}个共同好友</div>
                  </div>
                  <button className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                    加好友
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Packages Section */}
        {(activeTab === "all" || activeTab === "packages") && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900">热门套餐</h3>
              {activeTab === "all" && <button onClick={() => setActiveTab("packages")} className="text-xs text-slate-400 flex items-center">查看更多 <ChevronRight className="w-3 h-3" /></button>}
            </div>
            <div className="space-y-3">
              {MOCK_RESULTS.packages.map(pkg => (
                <div key={pkg.id} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex gap-3">
                  <img src={pkg.image} className="w-20 h-20 rounded-xl object-cover bg-slate-100" />
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{pkg.title}</h4>
                      <div className="text-xs text-slate-500 mt-1">{pkg.shop}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-red-500 font-bold text-sm">¥{pkg.price}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {pkg.rating}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Shops Section */}
        {(activeTab === "all" || activeTab === "shops") && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900">推荐商户</h3>
              {activeTab === "all" && <button onClick={() => setActiveTab("shops")} className="text-xs text-slate-400 flex items-center">查看更多 <ChevronRight className="w-3 h-3" /></button>}
            </div>
            <div className="space-y-3">
              {MOCK_RESULTS.shops.map(shop => (
                <div key={shop.id} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex gap-3">
                  <img src={shop.image} className="w-16 h-16 rounded-xl object-cover bg-slate-100" />
                  <div className="flex-1 flex flex-col justify-center gap-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 text-sm">{shop.name}</h4>
                      <span className="text-xs text-slate-400">{shop.distance}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">{shop.type}</span>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {shop.rating}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
