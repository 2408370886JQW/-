import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Heart,
  Map,
  Menu,
  Search,
  Share2,
  ShoppingBag,
  Star
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// 分类数据结构
interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subTitle: string;
  subCategories: SubCategory[];
}

const CATEGORIES: Category[] = [
  {
    id: "couple",
    name: "情侣套餐",
    subTitle: "约会首选",
    subCategories: [
      { id: "romantic", name: "浪漫晚餐" },
      { id: "casual", name: "轻松休闲" },
      { id: "interactive", name: "互动体验" },
      { id: "view", name: "景观餐厅" },
    ],
  },
  {
    id: "bestie",
    name: "闺蜜套餐",
    subTitle: "出片圣地",
    subCategories: [
      { id: "photo", name: "拍照打卡" },
      { id: "tea", name: "下午茶" },
      { id: "brunch", name: "精致早餐" },
      { id: "shopping", name: "逛吃逛吃" },
    ],
  },
  {
    id: "bro",
    name: "兄弟套餐",
    subTitle: "聚会必去",
    subCategories: [
      { id: "bbq", name: "烧烤撸串" },
      { id: "pub", name: "精酿酒馆" },
      { id: "game", name: "电竞开黑" },
      { id: "sports", name: "运动竞技" },
    ],
  },
  {
    id: "fun",
    name: "情趣套餐",
    subTitle: "人气推荐",
    subCategories: [
      { id: "hotel", name: "主题酒店" },
      { id: "spa", name: "私密SPA" },
      { id: "bar", name: "氛围清吧" },
    ],
  },
];

// 商家数据
const MERCHANTS = [
  {
    id: 1,
    name: "丝路星光·旋转餐厅",
    rating: 4.9,
    price: 320,
    distance: "500m",
    tags: ["大...", "500m"],
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663130971121/bpRqDMEYDEAhvdIV.jpg",
    isAd: true,
    adTitle: "猜你喜欢",
    coupon: {
      title: "周末浪漫抵扣券",
      price: 50,
      originalPrice: 100,
      limit: "仅剩2h",
    },
  },
  {
    id: 2,
    name: "红山顶·云端酒廊",
    rating: 4.7,
    price: 280,
    distance: "1.2km",
    tags: ["高空", "鸡尾酒", "爵士乐"],
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663130971121/XOwNESyTvDvoTIYT.jpg",
    deals: [
      { title: "云端微醺双人...", price: 398, originalPrice: 588 },
      { title: "经典鸡尾酒2杯", price: 128, originalPrice: 198 },
    ],
  },
  {
    id: 3,
    name: "莫奈花园·法式餐厅",
    rating: 4.8,
    price: 450,
    distance: "2.1km",
    tags: ["花园", "法餐", "露台"],
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663130971121/HbmJXeYcBBinWfRt.jpg",
    deals: [
      { title: "法式浪漫双人餐", price: 888, originalPrice: 1288 },
    ],
  },
];

export default function MerchantDetailPage() {
  const [activeCategory, setActiveCategory] = useState<string>("couple");
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("couple");

  // 处理一级分类点击
  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      // 如果点击已展开的分类，收起它
      setExpandedCategory(null);
    } else {
      // 展开新分类，并设为激活状态
      setExpandedCategory(categoryId);
      setActiveCategory(categoryId);
      // 默认选中第一个子分类
      const category = CATEGORIES.find(c => c.id === categoryId);
      if (category && category.subCategories.length > 0) {
        setActiveSubCategory(category.subCategories[0].id);
      }
    }
  };

  // 处理二级分类点击
  const handleSubCategoryClick = (subId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发一级分类点击
    setActiveSubCategory(subId);
    // 移除 toast 提示
  };

  return (
    <div className="flex flex-col h-screen bg-white text-slate-900 font-sans">
      {/* 顶部搜索栏 - 1:1 复刻 */}
      <div className="flex items-center px-4 py-3 bg-white border-b border-slate-100 sticky top-0 z-50">
        <Button variant="ghost" size="icon" className="mr-2 text-slate-800 active:scale-95 transition-transform">
          <Menu className="w-6 h-6" />
        </Button>
        <div 
          className="flex-1 h-9 bg-slate-100 rounded-full flex items-center px-3 active:scale-[0.99] transition-transform cursor-pointer"
          onClick={() => toast.info("正在搜索...")}
        >
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <span className="text-sm text-slate-400">搜索...</span>
        </div>
        <div className="flex items-center ml-2 space-x-1">
          <Button variant="ghost" size="icon" className="text-slate-800 w-9 h-9 active:scale-95 transition-transform" onClick={() => toast.success("已加入购物袋")}>
            <ShoppingBag className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-800 w-9 h-9 active:scale-95 transition-transform" onClick={() => toast.success("已收藏")}>
            <Heart className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-800 w-9 h-9 active:scale-95 transition-transform" onClick={() => toast.info("正在定位...")}>
            <Map className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 左侧分类导航 - 手风琴交互 */}
        <ScrollArea className="w-[100px] min-w-[100px] bg-slate-50 h-full border-r border-slate-100 flex-shrink-0">
          <div className="flex flex-col py-2 w-full">
            {/* 全城筛选 */}
            <div className="px-3 py-4 text-sm font-bold text-slate-800 flex items-center cursor-pointer active:bg-slate-100 whitespace-nowrap">
              全城 <ChevronDown className="w-3 h-3 ml-1" />
            </div>

            {CATEGORIES.map((category) => {
              const isExpanded = expandedCategory === category.id;
              const isActive = activeCategory === category.id;

              return (
                <div key={category.id} className="flex flex-col">
                  {/* 一级标题 */}
                  <div
                    className={cn(
                      "relative px-2 py-3 cursor-pointer transition-all duration-200 select-none active:bg-white/50 whitespace-nowrap flex flex-col items-center justify-center text-center",
                      isActive && !isExpanded ? "bg-white" : "bg-transparent"
                    )}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {/* 选中指示条 */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#FF4D00] rounded-r-full" />
                    )}
                    
                    <div className={cn(
                      "text-[15px] font-bold leading-tight transition-colors",
                      isActive ? "text-[#FF4D00]" : "text-slate-700"
                    )}>
                      {category.name}
                    </div>
                    
                    {/* 二级标题（胶囊样式） */}
                    <div className={cn(
                      "text-[10px] mt-1.5 px-2 py-0.5 rounded-full transition-all duration-200",
                      isActive 
                        ? "bg-[#FF4D00] text-white font-medium shadow-sm" 
                        : "bg-transparent text-slate-400"
                    )}>
                      {category.subTitle}
                    </div>
                  </div>

                  {/* 二级标题 - 手风琴展开 */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden bg-white"
                      >
                        <div className="flex flex-col py-1 space-y-1">
                          {category.subCategories.map((sub) => {
                            const isSubActive = activeSubCategory === sub.id;
                            return (
                              <div
                                key={sub.id}
                                className="px-2 py-1 flex justify-center"
                                onClick={(e) => handleSubCategoryClick(sub.id, e)}
                              >
                                <div
                                  className={cn(
                                    "text-[12px] px-3 py-1.5 rounded-full transition-all duration-200 w-full text-center cursor-pointer active:scale-95 whitespace-nowrap",
                                    isSubActive
                                      ? "bg-[#FF4D00] text-white shadow-sm font-medium"
                                      : "text-slate-500 hover:bg-slate-50"
                                  )}
                                >
                                  {sub.name}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* 右侧内容区域 - 强制限制宽度防止溢出 */}
        <ScrollArea className="flex-1 bg-white h-full w-0 min-w-0">
          <div className="p-3 pb-24 w-full max-w-full overflow-hidden">
            {/* 顶部Banner与筛选 */}
            <div className="relative mb-4 rounded-xl overflow-hidden h-32">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663130971121/XlfUrRWZauqFhOwG.jpg" 
                alt="Banner" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 w-full">
                  <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-white text-xs whitespace-nowrap border border-white/30">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span>猜你喜欢 (3)</span>
                  </div>
                  <div className="bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg text-white text-xs whitespace-nowrap border border-white/10">
                    周末去哪儿
                  </div>
                  <div className="bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg text-white text-xs whitespace-nowrap border border-white/10">
                    深夜食堂
                  </div>
                </div>
              </div>
              <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full text-white text-xs flex items-center">
                <Map className="w-3 h-3 mr-1" />
                距离 500m
              </div>
            </div>

            {/* 筛选标签 */}
            <div className="flex space-x-2 overflow-x-auto no-scrollbar mb-4 pb-1 w-full">
              {["离我最近", "服务筛选", "价格不限", "好评优先"].map((filter, i) => (
                <div 
                  key={i}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs whitespace-nowrap border flex items-center cursor-pointer active:scale-95 transition-transform",
                    i === 0 
                      ? "bg-[#FFF0E9] text-[#FF4D00] border-[#FF4D00]/20 font-medium" 
                      : "bg-white text-slate-600 border-slate-200"
                  )}
                  onClick={() => toast.success(`已应用筛选: ${filter}`)}
                >
                  {filter}
                  {i !== 0 && <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />}
                </div>
              ))}
            </div>

            {/* 商家列表 */}
            <div className="space-y-3">
              {MERCHANTS.map((merchant) => (
                <div 
                  key={merchant.id} 
                  className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden active:scale-[0.99] transition-transform cursor-pointer"
                  onClick={() => toast.info(`进入商家: ${merchant.name}`)}
                >
                  {/* 上半部分：图片与基本信息 */}
                  <div className="flex p-3">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={merchant.image} alt={merchant.name} className="w-full h-full object-cover" />
                      {merchant.isAd && (
                        <div className="absolute top-0 left-0 bg-[#FF4D00] text-white text-[10px] px-1.5 py-0.5 rounded-br-lg font-medium flex items-center">
                          <Star className="w-2 h-2 mr-0.5 fill-white" />
                          {merchant.adTitle}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 ml-3 flex flex-col justify-between py-0.5 min-w-0">
                      <div>
                        <div className="flex justify-between items-start w-full">
                          <h3 className="font-bold text-slate-900 text-[15px] leading-tight truncate pr-2">{merchant.name}</h3>
                          <div className="flex space-x-3 text-slate-400">
                            <Share2 className="w-4 h-4 active:text-slate-600" onClick={(e) => { e.stopPropagation(); toast.success("分享成功"); }} />
                            <Heart className="w-4 h-4 active:text-red-500 active:fill-red-500" onClick={(e) => { e.stopPropagation(); toast.success("已收藏"); }} />
                          </div>
                        </div>
                        <div className="flex items-center mt-1.5 text-xs flex-wrap gap-y-1">
                          <span className="text-[#FF4D00] font-bold text-sm mr-1">{merchant.rating}分</span>
                          <span className="text-slate-400 mx-1">|</span>
                          <span className="text-slate-600">¥{merchant.price}/人</span>
                          <span className="text-slate-400 mx-1">|</span>
                          <span className="text-slate-400 truncate max-w-[60px]">{merchant.tags[0]}</span>
                          <div className="flex-1 min-w-[4px]" />
                          <span className="text-slate-400">{merchant.distance}</span>
                        </div>
                      </div>
                      
                      {/* 优惠券/团购 */}
                      {merchant.coupon && (
                        <div className="mt-2 bg-[#FFF0E9] rounded-lg p-2 flex items-center justify-between border border-[#FF4D00]/10 flex-wrap gap-1">
                          <div className="flex items-center min-w-0">
                            <span className="bg-[#FF4D00] text-white text-[10px] px-1 rounded mr-2">限时</span>
                            <span className="text-xs font-medium text-slate-800 truncate">{merchant.coupon.title}</span>
                          </div>
                          <div className="flex items-baseline">
                            <span className="text-[#FF4D00] font-bold text-sm">¥{merchant.coupon.price}</span>
                            <span className="text-slate-400 text-[10px] line-through ml-1">¥{merchant.coupon.originalPrice}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 下半部分：更多团购 */}
                  {merchant.deals && (
                    <div className="px-3 pb-3 pt-0">
                      {merchant.deals.map((deal, idx) => (
                        <div key={idx} className="flex items-center justify-between mt-2 pl-24 flex-wrap gap-1">
                          <div className="flex items-center min-w-0">
                            <span className="bg-[#FF4D00]/10 text-[#FF4D00] text-[10px] px-1 rounded mr-2">团</span>
                            <span className="text-xs text-slate-700">{deal.title}</span>
                          </div>
                          <div className="flex items-baseline">
                            <span className="text-[#FF4D00] font-bold text-sm">¥{deal.price}</span>
                            <span className="text-slate-400 text-[10px] line-through ml-1">¥{deal.originalPrice}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="text-center text-xs text-slate-400 py-4">
                已经到底啦，去其他分类看看吧 ~
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
