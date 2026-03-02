import { useState, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, MapPin, Star, ChevronRight, Check, Send, Clock, X, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Mock merchant data (reuse from MeetPage concept)
const MERCHANTS = [
  {
    id: "m1",
    name: "花田错·西餐厅",
    category: "西餐",
    address: "三里屯太古里北区",
    rating: 4.8,
    avgPrice: 158,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    distance: "1.2km",
    packages: [
      { id: "p1", name: "初见·双人轻食套餐", price: 198, originalPrice: 298, items: ["前菜沙拉×2", "意面/披萨二选一×2", "饮品×2"], validity: 30 },
      { id: "p2", name: "浪漫·烛光晚餐套餐", price: 388, originalPrice: 528, items: ["法式浓汤×2", "牛排/鱼排二选一×2", "甜品×2", "红酒1瓶"], validity: 30 },
    ]
  },
  {
    id: "m2",
    name: "丝路有约·新疆菜",
    category: "新疆菜",
    address: "朝阳大悦城5层",
    rating: 4.6,
    avgPrice: 98,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop",
    distance: "2.5km",
    packages: [
      { id: "p3", name: "丝路双人套餐", price: 168, originalPrice: 238, items: ["大盘鸡(中份)", "馕×2", "酸奶×2", "烤串拼盘"], validity: 30 },
      { id: "p4", name: "欢聚四人套餐", price: 328, originalPrice: 468, items: ["大盘鸡(大份)", "手抓饭", "烤串拼盘(大)", "凉菜×2", "饮品×4"], validity: 30 },
    ]
  },
  {
    id: "m3",
    name: "GREYBOX·精品咖啡",
    category: "咖啡",
    address: "国贸商城B1层",
    rating: 4.9,
    avgPrice: 58,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    distance: "0.8km",
    packages: [
      { id: "p5", name: "下午茶双人套餐", price: 88, originalPrice: 136, items: ["手冲咖啡×2", "甜品×1"], validity: 30 },
      { id: "p6", name: "精品品鉴套餐", price: 128, originalPrice: 186, items: ["SOE手冲×2", "可颂×2", "提拉米苏×1"], validity: 30 },
    ]
  },
  {
    id: "m4",
    name: "万达影城IMAX",
    category: "电影",
    address: "CBD万达广场9层",
    rating: 4.5,
    avgPrice: 68,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop",
    distance: "1.8km",
    packages: [
      { id: "p7", name: "双人观影套餐", price: 99, originalPrice: 156, items: ["IMAX电影票×2", "爆米花(大)×1", "可乐×2"], validity: 15 },
    ]
  },
  {
    id: "m5",
    name: "K歌之王KTV",
    category: "KTV",
    address: "工体北路8号",
    rating: 4.3,
    avgPrice: 128,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
    distance: "3.2km",
    packages: [
      { id: "p8", name: "欢唱3小时套餐", price: 188, originalPrice: 298, items: ["中包3小时", "果盘×1", "饮品×4"], validity: 30 },
      { id: "p9", name: "狂欢5小时套餐", price: 328, originalPrice: 498, items: ["大包5小时", "果盘×2", "小食拼盘×1", "饮品×6"], validity: 30 },
    ]
  },
];

type FlowStep = "select-merchant" | "select-package" | "preview-card" | "sent";

export default function InvitePage() {
  const [, params] = useRoute("/invite/:userId");
  const [, setLocation] = useLocation();
  
  // Get invited user info from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const invitedName = searchParams.get("name") || "好友";
  const invitedAvatar = searchParams.get("avatar") || "";
  const userId = params?.userId || "0";

  const [step, setStep] = useState<FlowStep>("select-merchant");
  const [selectedMerchant, setSelectedMerchant] = useState<typeof MERCHANTS[0] | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<typeof MERCHANTS[0]["packages"][0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("全部");

  const categories = useMemo(() => {
    const cats = ["全部", ...Array.from(new Set(MERCHANTS.map(m => m.category)))];
    return cats;
  }, []);

  const filteredMerchants = useMemo(() => {
    return MERCHANTS.filter(m => {
      const matchCategory = categoryFilter === "全部" || m.category === categoryFilter;
      const matchSearch = !searchQuery || m.name.includes(searchQuery) || m.category.includes(searchQuery);
      return matchCategory && matchSearch;
    });
  }, [categoryFilter, searchQuery]);

  const handleBack = () => {
    if (step === "select-package") {
      setStep("select-merchant");
      setSelectedPackage(null);
    } else if (step === "preview-card") {
      setStep("select-package");
    } else {
      // Go back to map
      window.history.back();
    }
  };

  const handleSelectMerchant = (merchant: typeof MERCHANTS[0]) => {
    setSelectedMerchant(merchant);
    setStep("select-package");
  };

  const handleSelectPackage = (pkg: typeof MERCHANTS[0]["packages"][0]) => {
    setSelectedPackage(pkg);
    setStep("preview-card");
  };

  const handleSend = () => {
    setStep("sent");
  };

  const stepTitle = () => {
    switch (step) {
      case "select-merchant": return "选择商家";
      case "select-package": return "选择套餐";
      case "preview-card": return "确认邀约";
      case "sent": return "发送成功";
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col" style={{ maxWidth: 430, margin: "0 auto" }}>
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-100">
        <div className="flex items-center px-4 pt-3 pb-2">
          <button onClick={handleBack} className="p-1 -ml-1 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <span className="ml-3 text-base font-bold text-slate-900">{stepTitle()}</span>
        </div>
        {/* Invite banner */}
        <div className="mx-4 mb-3 px-3 py-2.5 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-orange-400 flex-shrink-0">
            <img src={invitedAvatar} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-orange-700 truncate">邀请 {invitedName} 一起</p>
            <p className="text-xs text-orange-500">选择一个好去处，发送邀约吧</p>
          </div>
        </div>
        {/* Step indicator */}
        <div className="px-4 pb-3 flex items-center gap-2">
          {["选商家", "选套餐", "发邀约"].map((label, i) => {
            const stepIndex = step === "select-merchant" ? 0 : step === "select-package" ? 1 : 2;
            const isActive = i === stepIndex;
            const isDone = i < stepIndex;
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors",
                  isActive ? "bg-orange-500 text-white" : isDone ? "bg-green-500 text-white" : "bg-slate-200 text-slate-400"
                )}>
                  {isDone ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isActive ? "text-orange-600" : isDone ? "text-green-600" : "text-slate-400"
                )}>{label}</span>
                {i < 2 && <div className={cn("flex-1 h-0.5 rounded-full", isDone ? "bg-green-400" : "bg-slate-200")} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Merchant */}
          {step === "select-merchant" && (
            <motion.div
              key="merchant"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              {/* Search */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="搜索商家名称..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-orange-400 transition-colors"
                />
              </div>

              {/* Category filter */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                      categoryFilter === cat ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Merchant list */}
              <div className="space-y-3">
                {filteredMerchants.map(merchant => (
                  <div
                    key={merchant.id}
                    onClick={() => handleSelectMerchant(merchant)}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    <div className="flex">
                      <div className="w-28 h-24 flex-shrink-0">
                        <img src={merchant.image} alt={merchant.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-3 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold text-slate-900 truncate">{merchant.name}</h3>
                          <span className="text-xs text-slate-400 whitespace-nowrap">{merchant.distance}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium text-slate-700">{merchant.rating}</span>
                          <span className="text-xs text-slate-400 ml-1">人均¥{merchant.avgPrice}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-400 truncate">{merchant.address}</span>
                        </div>
                        <div className="mt-1.5">
                          <span className="text-xs text-orange-500 font-medium">{merchant.packages.length}个套餐可选</span>
                        </div>
                      </div>
                      <div className="flex items-center pr-3">
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Package */}
          {step === "select-package" && selectedMerchant && (
            <motion.div
              key="package"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              {/* Merchant info card */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={selectedMerchant.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 truncate">{selectedMerchant.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{selectedMerchant.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Package list */}
              <h3 className="text-sm font-bold text-slate-900 mb-3">选择套餐</h3>
              <div className="space-y-3">
                {selectedMerchant.packages.map(pkg => (
                  <div
                    key={pkg.id}
                    onClick={() => handleSelectPackage(pkg)}
                    className={cn(
                      "bg-white rounded-2xl border-2 p-4 cursor-pointer transition-all active:scale-[0.98]",
                      selectedPackage?.id === pkg.id ? "border-orange-500 shadow-md" : "border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900">{pkg.name}</h4>
                        <div className="mt-2 space-y-1">
                          {pkg.items.map((item, idx) => (
                            <p key={idx} className="text-xs text-slate-500 flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                              {item}
                            </p>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-400">有效期 {pkg.validity}天</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="text-lg font-black text-orange-600">¥{pkg.price}</p>
                        <p className="text-xs text-slate-400 line-through">¥{pkg.originalPrice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Preview Invite Card */}
          {step === "preview-card" && selectedMerchant && selectedPackage && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 flex flex-col items-center"
            >
              <p className="text-sm text-slate-500 mb-4">邀约卡片预览</p>

              {/* Invite Card */}
              <div className="w-full max-w-sm bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-5 shadow-2xl">
                {/* Header: Inviter info */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <span className="text-white text-lg">📍</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">[{invitedName}] 邀请你一起去</p>
                  </div>
                </div>

                {/* Merchant info */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span className="text-white font-bold text-sm">{selectedMerchant.name}</span>
                  </div>
                  <p className="text-white/60 text-xs ml-6">{selectedMerchant.address}</p>
                </div>

                {/* Package info */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Utensils className="w-4 h-4 text-orange-400" />
                    <span className="text-white font-bold text-sm">{selectedPackage.name}</span>
                    <span className="text-orange-400 font-black text-sm ml-auto">¥{selectedPackage.price}</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    {selectedPackage.items.map((item, idx) => (
                      <p key={idx} className="text-white/50 text-xs">{item}</p>
                    ))}
                  </div>
                </div>

                {/* Validity */}
                <div className="flex items-center gap-2 mb-5 px-1">
                  <Clock className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-white/40 text-xs">有效期 {selectedPackage.validity}天</span>
                </div>

                {/* Action buttons (display only in preview) */}
                <div className="flex gap-3">
                  <div className="flex-1 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm text-center">
                    接受邀约
                  </div>
                  <div className="flex-1 py-3 rounded-full bg-white/10 text-white/70 font-bold text-sm text-center border border-white/20">
                    换一个
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-4 text-center">
                邀约状态：待回复 → 已接受 / 已拒绝 / 已过期(24h)
              </p>
              <p className="text-xs text-slate-400 mt-1 text-center">
                费用：默认邀请方付 · 可AA
              </p>
            </motion.div>
          )}

          {/* Step 4: Sent Success */}
          {step === "sent" && (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-8"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">邀约已发送</h2>
              <p className="text-sm text-slate-500 text-center mb-2">
                已向 <span className="font-bold text-slate-700">{invitedName}</span> 发送邀约卡片
              </p>
              <p className="text-xs text-slate-400 text-center mb-8">
                对方将在消息中收到你的邀约，24小时内有效
              </p>

              {/* Summary */}
              <div className="w-full max-w-xs bg-slate-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold text-slate-900">{selectedMerchant?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-slate-600">{selectedPackage?.name}</span>
                  <span className="text-sm font-bold text-orange-600 ml-auto">¥{selectedPackage?.price}</span>
                </div>
              </div>

              <div className="flex gap-3 w-full max-w-xs">
                <button
                  onClick={() => setLocation("/")}
                  className="flex-1 py-3 rounded-full bg-slate-900 text-white font-bold text-sm active:scale-95 transition-transform"
                >
                  返回地图
                </button>
                <button
                  onClick={() => setLocation("/chat")}
                  className="flex-1 py-3 rounded-full bg-orange-500 text-white font-bold text-sm active:scale-95 transition-transform"
                >
                  查看消息
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom action bar */}
      {step === "preview-card" && (
        <div className="flex-shrink-0 p-4 bg-white border-t border-slate-100">
          <button
            onClick={handleSend}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-base shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            发送邀约给 {invitedName}
          </button>
        </div>
      )}
    </div>
  );
}
