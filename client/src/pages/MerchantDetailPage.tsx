import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function MerchantDetailPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeSubCategory, setActiveSubCategory] = useState(0);
  const [activeFilter, setActiveFilter] = useState("离我最近");
  const [isLiked, setIsLiked] = useState(false);

  const categories = [
    "情侣套餐", "闺蜜套餐", "兄弟套餐", "情趣套餐"
  ];

  const subCategories = [
    "约会首选", "浪漫晚餐", "轻松休闲", "互动体验", "景观餐厅"
  ];

  const filters = [
    "离我最近", "服务筛选", "价格不限", "好评优先", "人均排序"
  ];

  const handleBuy = (itemName: string) => {
    toast.success(`已选择：${itemName}`, {
      description: "正在跳转支付页面...",
    });
  };

  return (
    <Layout showNav={false}>
      <div className="min-h-screen bg-background pb-28">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <div className="px-4 py-3 flex items-center gap-3">
            {/* Back button removed for Tab view */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="搜索..." 
                className="w-full pl-9 pr-4 py-2 bg-muted/50 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <button 
                onClick={() => {
                  setIsLiked(!isLiked);
                  toast(isLiked ? "已取消收藏" : "已添加到收藏");
                }}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <Heart className={cn("w-6 h-6 transition-colors", isLiked ? "fill-red-500 text-red-500" : "")} />
              </button>
              <button className="p-1 hover:bg-muted rounded-full transition-colors">
                <MapPin className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Sub Categories (Horizontal Scroll) */}
          <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {subCategories.map((cat, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveSubCategory(i)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95",
                    activeSubCategory === i 
                      ? "bg-orange-100 text-orange-600 shadow-sm" 
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Left Sidebar (Categories) */}
          <div className="w-24 shrink-0 bg-muted/30 min-h-[calc(100vh-110px)] sticky top-[110px]">
            {categories.map((cat, i) => (
              <div 
                key={i}
                onClick={() => setActiveCategory(i)}
                className={cn(
                  "px-2 py-4 text-xs font-medium text-center cursor-pointer transition-all border-l-4 select-none",
                  activeCategory === i 
                    ? "bg-background text-orange-600 border-orange-500 shadow-sm" 
                    : "text-muted-foreground border-transparent hover:bg-muted/50"
                )}
              >
                {cat}
                {activeCategory === i && <div className="mt-1 text-[10px] text-orange-400 font-normal animate-in fade-in zoom-in duration-300">约会首选</div>}
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-3 space-y-4">
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {filters.map((filter, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-2 py-1 rounded text-[10px] whitespace-nowrap transition-colors border",
                    activeFilter === filter
                      ? "bg-orange-50 text-orange-600 border-orange-200 font-medium"
                      : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Recommend Card */}
            <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-1 text-orange-500 font-bold text-sm">
                <Star className="w-3 h-3 fill-current" />
                <span>猜你喜欢 (3)</span>
              </div>
              
              <Card 
                className="border-none shadow-sm overflow-hidden bg-orange-50/50 active:scale-[0.98] transition-transform cursor-pointer"
                onClick={() => handleBuy("丝路星光·旋转餐厅")}
              >
                <div className="flex p-3 gap-3">
                  <div className="w-24 h-24 rounded-lg bg-muted shrink-0 overflow-hidden">
                    <img src="/images/category-food.jpg" alt="Restaurant" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm">丝路星光·旋转餐厅</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span className="text-orange-500 font-bold">4.9分</span>
                        <span className="text-muted-foreground">¥320/人</span>
                        <span className="text-muted-foreground">大巴扎 · 500m</span>
                      </div>
                    </div>
                    <div className="mt-2 bg-white/80 rounded p-2 border border-orange-100">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Badge className="bg-red-500 text-white text-[10px] px-1 py-0 h-4 rounded-sm">限时</Badge>
                          <span className="text-xs font-medium text-orange-700">周末浪漫抵扣券</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-red-500">¥50 <span className="text-[10px] text-muted-foreground line-through font-normal">¥100</span></div>
                          <div className="text-[8px] text-red-400">仅剩 2h</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Top List */}
            <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-500 delay-100">
              <div className="flex items-center gap-1 text-yellow-600 font-bold text-sm">
                <Badge className="bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 mr-1">榜单TOP</Badge>
                <span>人气推荐</span>
              </div>

              <Card className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-3 space-y-3">
                  <div className="flex gap-3 cursor-pointer" onClick={() => handleBuy("天山雪莲·私房菜")}>
                    <div className="w-20 h-20 rounded-lg bg-muted shrink-0 overflow-hidden">
                      <img src="/images/category-food.jpg" alt="Restaurant" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">天山雪莲·私房菜</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span className="text-orange-500 font-bold">4.8分</span>
                        <span className="text-muted-foreground">¥520/人</span>
                        <span className="text-muted-foreground">2.5km</span>
                      </div>
                      <div className="mt-1 text-[10px] text-yellow-600 bg-yellow-50 inline-block px-1.5 py-0.5 rounded">
                        沙依巴克区私房菜热门榜第2名
                      </div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {["私房菜", "包间", "定制服务", "营业中"].map((tag, i) => (
                          <span key={i} className={cn(
                            "text-[10px] px-1 py-0.5 rounded border",
                            tag === "营业中" ? "text-green-600 border-green-200 bg-green-50" : "text-muted-foreground border-border"
                          )}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500 text-white text-[10px] px-1 py-0 h-4 rounded-sm">团</Badge>
                      <span className="text-xs font-medium">520限定告白套餐</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-red-500">¥1314</span>
                      <span className="text-xs text-muted-foreground line-through">¥1999</span>
                      <Button 
                        size="sm" 
                        className="h-6 px-2 text-xs bg-red-500 hover:bg-red-600 rounded-full active:scale-95 transition-transform"
                        onClick={() => handleBuy("520限定告白套餐")}
                      >
                        抢购
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-3 space-y-3">
                  <div className="flex gap-3 cursor-pointer" onClick={() => handleBuy("云端·全景咖啡")}>
                    <div className="w-20 h-20 rounded-lg bg-muted shrink-0 overflow-hidden">
                      <img src="/images/category-coffee.jpg" alt="Cafe" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">云端·全景咖啡</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span className="text-orange-500 font-bold">4.7分</span>
                        <span className="text-muted-foreground">¥88/人</span>
                        <span className="text-muted-foreground">1.2km</span>
                      </div>
                      <div className="mt-1 text-[10px] text-yellow-600 bg-yellow-50 inline-block px-1.5 py-0.5 rounded">
                        景观餐厅好评榜第1名
                      </div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {["下午茶", "景观位", "拍照圣地"].map((tag, i) => (
                          <span key={i} className="text-[10px] px-1 py-0.5 rounded border text-muted-foreground border-border">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500 text-white text-[10px] px-1 py-0 h-4 rounded-sm">团</Badge>
                      <span className="text-xs font-medium">双人云端下午茶</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-red-500">¥168</span>
                      <span className="text-xs text-muted-foreground line-through">¥298</span>
                      <Button 
                        size="sm" 
                        className="h-6 px-2 text-xs bg-red-500 hover:bg-red-600 rounded-full active:scale-95 transition-transform"
                        onClick={() => handleBuy("双人云端下午茶")}
                      >
                        抢购
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="text-center text-xs text-muted-foreground py-4">
              已经到底啦，去其他分类看看吧 ~
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
