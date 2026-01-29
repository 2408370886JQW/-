import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Heart, Share2, Moon, ShoppingBag, Map as MapIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function MerchantDetailPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeSubCategory, setActiveSubCategory] = useState(1); // 默认选中"浪漫晚餐"
  const [activeFilter, setActiveFilter] = useState("离我最近");
  const [isLiked, setIsLiked] = useState(false);

  const categories = [
    { name: "情侣套餐", sub: "约会首选" },
    { name: "闺蜜套餐", sub: "出片圣地" },
    { name: "兄弟套餐", sub: "聚会必去" },
    { name: "情趣套餐", sub: "人气推荐" }
  ];

  const subCategories = [
    "情侣套餐", "约会首选", "浪漫晚餐", "轻松休闲", "互动体验", "景观餐厅"
  ];

  const filters = [
    "离我最近", "服务筛选", "价格不限", "好评优先", "人均排序"
  ];

  const handleInteraction = (message: string) => {
    toast(message, {
      duration: 1500,
      position: "top-center",
    });
  };

  const handleBuy = (itemName: string) => {
    toast.success(`已选择：${itemName}`, {
      description: "正在跳转支付页面...",
      duration: 2000,
    });
  };

  return (
    <Layout showNav={false}>
      <div className="min-h-screen bg-[#f5f5f5] pb-28 font-sans">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white shadow-sm">
          <div className="px-4 py-3 flex items-center gap-3">
            <div 
              className="flex items-center gap-1 text-red-500 font-bold text-lg shrink-0 active:scale-95 transition-transform cursor-pointer"
              onClick={() => handleInteraction("定位功能演示：当前位置已刷新")}
            >
              <MapPin className="w-5 h-5 fill-current" />
              <span>FIND ME</span>
            </div>
            
            <div className="flex-1 relative active:scale-[0.98] transition-transform">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="搜索..." 
                readOnly
                onClick={() => handleInteraction("搜索功能演示：弹出搜索键盘")}
                className="w-full pl-9 pr-4 py-1.5 bg-gray-100 rounded-full text-sm focus:outline-none text-gray-600 cursor-pointer"
              />
            </div>
            
            <div className="flex items-center gap-3 text-gray-600">
              <button onClick={() => handleInteraction("切换夜间模式")} className="active:scale-90 transition-transform">
                <Moon className="w-5 h-5" />
              </button>
              <button onClick={() => handleInteraction("查看购物车")} className="active:scale-90 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  setIsLiked(!isLiked);
                  toast(isLiked ? "已取消收藏" : "已添加到收藏");
                }}
                className="active:scale-90 transition-transform"
              >
                <Heart className={cn("w-5 h-5 transition-colors", isLiked ? "fill-red-500 text-red-500" : "")} />
              </button>
              <button 
                className="flex items-center gap-0.5 text-xs active:scale-95 transition-transform"
                onClick={() => handleInteraction("切换地图模式")}
              >
                <MapIcon className="w-4 h-4" />
                <span>地图</span>
              </button>
            </div>
          </div>
          
          {/* Location Bar */}
          <div 
            className="px-4 py-2 flex items-center justify-between text-sm border-t border-gray-100 active:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => handleInteraction("切换城市/区域")}
          >
            <div className="flex items-center gap-1 font-medium">
              <span>全城</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-gray-400 text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>距离 500m</span>
            </div>
          </div>
        </div>

        {/* Hero Banner Background (Simulated) */}
        <div className="h-48 w-full bg-cover bg-center relative" style={{ backgroundImage: 'url(/images/hero-banner.jpg)' }}>
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Top Categories Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto scrollbar-hide">
             <button 
               onClick={() => handleInteraction("查看猜你喜欢列表")}
               className="px-3 py-1.5 bg-black/40 backdrop-blur-md text-white rounded-full text-xs flex items-center gap-1 border border-white/20 active:scale-95 transition-transform"
             >
               <span>✨</span> 猜你喜欢 (3)
             </button>
             <button 
               onClick={() => handleInteraction("查看周末去哪儿专题")}
               className="px-3 py-1.5 bg-black/40 backdrop-blur-md text-white rounded-full text-xs flex items-center gap-1 border border-white/20 active:scale-95 transition-transform"
             >
               <span>🎡</span> 周末去哪儿
             </button>
             <button 
               onClick={() => handleInteraction("查看深夜食堂专题")}
               className="px-3 py-1.5 bg-black/40 backdrop-blur-md text-white rounded-full text-xs flex items-center gap-1 border border-white/20 active:scale-95 transition-transform"
             >
               <span>🌙</span> 深夜食堂
             </button>
          </div>
        </div>

        <div className="flex relative -mt-4 rounded-t-xl bg-[#f5f5f5] overflow-hidden">
          {/* Left Sidebar (Categories) */}
          <div className="w-24 shrink-0 bg-white min-h-[calc(100vh-280px)] pb-20">
            {categories.map((cat, i) => (
              <div 
                key={i}
                onClick={() => setActiveCategory(i)}
                className={cn(
                  "px-2 py-4 text-center cursor-pointer transition-all relative active:bg-gray-100",
                  activeCategory === i 
                    ? "bg-[#f5f5f5]" 
                    : "bg-white hover:bg-gray-50"
                )}
              >
                {activeCategory === i && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-red-500 rounded-r-full"></div>
                )}
                <div className={cn("text-sm font-bold mb-1", activeCategory === i ? "text-red-500" : "text-gray-700")}>
                  {cat.name}
                </div>
                <div className={cn("text-[10px]", activeCategory === i ? "text-red-400" : "text-gray-400")}>
                  {cat.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-3 space-y-3">
            {/* Sub Categories */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {subCategories.map((cat, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveSubCategory(i)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95",
                    activeSubCategory === i 
                      ? "bg-red-500 text-white shadow-sm" 
                      : "bg-white text-gray-600 border border-gray-100"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {filters.map((filter, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-2 py-1 rounded-full text-[10px] whitespace-nowrap transition-colors border flex items-center gap-1 active:scale-95",
                    activeFilter === filter
                      ? "bg-orange-50 text-orange-600 border-orange-200 font-medium"
                      : "bg-white text-gray-500 border-gray-200"
                  )}
                >
                  {filter}
                  <ChevronDown className="w-3 h-3" />
                </button>
              ))}
            </div>

            {/* Recommend Card (Big) */}
            <Card 
              className="border-none shadow-sm overflow-hidden bg-white rounded-xl cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => handleBuy("丝路星光·旋转餐厅")}
            >
              <div className="relative h-32">
                <img src="/images/category-food.jpg" alt="Restaurant" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-white" /> 猜你喜欢
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleInteraction("分享成功"); }}
                    className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 transition-colors active:scale-90"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleInteraction("收藏成功"); }}
                    className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 transition-colors active:scale-90"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-gray-900">丝路星光·旋转餐厅</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="text-orange-500 font-bold">4.9分</span>
                      <span className="w-px h-3 bg-gray-300"></span>
                      <span className="text-red-500 font-medium">¥320/人</span>
                      <span className="w-px h-3 bg-gray-300"></span>
                      <span className="text-gray-400">大巴扎 · 500m</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 bg-red-50 rounded-lg p-2 flex items-center justify-between border border-red-100">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500 text-white text-[10px] px-1 py-0 h-4 rounded-sm font-normal">限时</Badge>
                    <span className="text-xs font-medium text-red-800">周末浪漫抵扣券</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-red-600">¥50 <span className="text-[10px] text-gray-400 line-through font-normal">¥100</span></div>
                      <div className="text-[8px] text-red-400">仅剩 2h</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* List Item 1 */}
            <Card 
              className="border-none shadow-sm overflow-hidden bg-white rounded-xl p-3 cursor-pointer active:scale-[0.98] transition-transform" 
              onClick={() => handleBuy("天山雪莲·私房菜")}
            >
              <div className="flex gap-3">
                <div className="w-24 h-24 rounded-lg bg-gray-100 shrink-0 overflow-hidden relative">
                  <img src="/images/category-food.jpg" alt="Restaurant" className="w-full h-full object-cover" />
                  <div className="absolute top-0 left-0 bg-yellow-500 text-white text-[9px] px-1.5 py-0.5 rounded-br-lg font-medium">
                    榜单TOP
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-gray-900 truncate">天山雪莲·私房菜</h3>
                    <div className="flex gap-2 text-gray-400">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleInteraction("分享成功"); }}
                        className="active:scale-90 transition-transform"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleInteraction("收藏成功"); }}
                        className="active:scale-90 transition-transform"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="text-orange-500 font-bold">4.8分</span>
                    <span className="w-px h-3 bg-gray-300"></span>
                    <span className="text-gray-500">¥520/人</span>
                    <span className="w-px h-3 bg-gray-300"></span>
                    <span className="text-gray-400">2.5km</span>
                  </div>
                  
                  <div className="mt-1.5 flex items-center gap-1">
                    <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">沙依巴克区私房菜热门榜第2名</span>
                  </div>
                  
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {["私房菜", "包间", "定制服务"].map((tag, i) => (
                      <span key={i} className="text-[10px] px-1 py-0.5 rounded border border-gray-200 text-gray-500">
                        {tag}
                      </span>
                    ))}
                    <span className="text-[10px] px-1 py-0.5 rounded border border-green-200 text-green-600 bg-green-50">营业中</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500 text-white text-[10px] px-1 py-0 h-4 rounded-sm font-normal">团</Badge>
                  <span className="text-xs text-gray-700">520限定告白套餐</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-red-600">¥1314</span>
                  <span className="text-xs text-gray-400 line-through">¥1999</span>
                </div>
              </div>
            </Card>

            {/* List Item 2 */}
            <Card 
              className="border-none shadow-sm overflow-hidden bg-white rounded-xl p-3 cursor-pointer active:scale-[0.98] transition-transform" 
              onClick={() => handleBuy("云端·全景咖啡")}
            >
              <div className="flex gap-3">
                <div className="w-24 h-24 rounded-lg bg-gray-100 shrink-0 overflow-hidden relative">
                  <img src="/images/category-coffee.jpg" alt="Cafe" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-gray-900 truncate">云端·全景咖啡</h3>
                    <div className="flex gap-2 text-gray-400">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleInteraction("分享成功"); }}
                        className="active:scale-90 transition-transform"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleInteraction("收藏成功"); }}
                        className="active:scale-90 transition-transform"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="text-orange-500 font-bold">4.7分</span>
                    <span className="w-px h-3 bg-gray-300"></span>
                    <span className="text-gray-500">¥88/人</span>
                    <span className="w-px h-3 bg-gray-300"></span>
                    <span className="text-gray-400">1.2km</span>
                  </div>
                  
                  <div className="mt-1.5 flex items-center gap-1">
                    <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">景观餐厅好评榜第1名</span>
                  </div>
                  
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {["下午茶", "景观位", "拍照圣地"].map((tag, i) => (
                      <span key={i} className="text-[10px] px-1 py-0.5 rounded border border-gray-200 text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500 text-white text-[10px] px-1 py-0 h-4 rounded-sm font-normal">团</Badge>
                  <span className="text-xs text-gray-700">双人云端下午茶</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-red-600">¥168</span>
                  <span className="text-xs text-gray-400 line-through">¥298</span>
                </div>
              </div>
            </Card>
            
            <div className="text-center text-xs text-gray-400 py-6">
              已经到底啦，去其他分类看看吧 ~
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
