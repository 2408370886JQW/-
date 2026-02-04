import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Users, Heart, Coffee, Beer, Star, ChevronRight, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";

// Mock data for store
const STORE_INFO = {
  id: "1",
  name: "Blue Frog 蓝蛙 (三里屯店)",
  address: "三里屯太古里南区3层",
  rating: 4.8,
  image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=400&fit=crop",
  packages: [
    { id: "p1", name: "双人微醺套餐", price: 168, originalPrice: 298, tags: ["情侣", "闺蜜"], image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&h=200&fit=crop" },
    { id: "p2", name: "兄弟畅饮套餐", price: 288, originalPrice: 468, tags: ["兄弟", "聚会"], image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop" },
    { id: "p3", name: "单人工作简餐", price: 58, originalPrice: 88, tags: ["商务", "一人食"], image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&h=200&fit=crop" },
  ]
};

const RELATIONSHIPS = [
  { id: "bros", label: "兄弟", icon: Beer, color: "text-blue-500", bg: "bg-blue-50", desc: "放松畅聊" },
  { id: "bestie", label: "闺蜜", icon: Coffee, color: "text-pink-500", bg: "bg-pink-50", desc: "拍照打卡" },
  { id: "couple", label: "情侣/暧昧", icon: Heart, color: "text-red-500", bg: "bg-red-50", desc: "浪漫升温" },
  { id: "first_meet", label: "第一次见面", icon: Star, color: "text-purple-500", bg: "bg-purple-50", desc: "稳妥不尴尬" },
];

export default function StoreHomePage() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const [showRelationModal, setShowRelationModal] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState<string | null>(null);
  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const sid = params.get("shop_id");
    setShopId(sid);

    // Check if user has already selected relationship today
    const hasSelected = sessionStorage.getItem(`relation_selected_${sid}`);
    if (!hasSelected) {
      setShowRelationModal(true);
    }
  }, [search]);

  const handleRelationSelect = (relationId: string) => {
    setSelectedRelation(relationId);
  };

  const handleConfirmRelation = () => {
    if (!selectedRelation) return;
    
    // Save selection
    sessionStorage.setItem(`relation_selected_${shopId}`, selectedRelation);
    setShowRelationModal(false);
    
    // Navigate to scenario page
    setLocation(`/store/scenario?shop_id=${shopId}&relation=${selectedRelation}`);
  };

  return (
    <Layout showNav={true}>
      <div className="min-h-screen bg-slate-50 pb-20">
        {/* Top Bar */}
        <div className="bg-white px-4 py-3 flex items-center gap-2 shadow-sm sticky top-0 z-10">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-slate-600">你正在：</span>
          <span className="font-bold text-slate-900 truncate">{STORE_INFO.name}</span>
        </div>

        {/* Hero Section */}
        <div className="relative h-48 w-full">
          <img src={STORE_INFO.image} className="w-full h-full object-cover" alt="Store" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <div className="text-white">
              <h1 className="text-xl font-bold mb-1">{STORE_INFO.name}</h1>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{STORE_INFO.rating}</span>
                <span>•</span>
                <span>{STORE_INFO.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="p-4 space-y-6">
          {/* Meet Entry (Primary) */}
          <Card className="border-none shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden relative">
            <CardContent className="p-6 flex items-center justify-between relative z-10">
              <div>
                <h2 className="text-xl font-bold mb-1">开启相见模式</h2>
                <p className="text-blue-100 text-sm">发现此时此刻也在店里的有趣灵魂</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Users className="w-6 h-6 text-white" />
              </div>
            </CardContent>
            {/* Decorative circles */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </Card>

          {/* Recommended Packages */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-red-500" />
                本店推荐套餐
              </h3>
              <span className="text-xs text-slate-400">更多 &gt;</span>
            </div>
            <div className="space-y-3">
              {STORE_INFO.packages.map(pkg => (
                <div key={pkg.id} className="bg-white p-3 rounded-xl shadow-sm flex gap-3" onClick={() => setLocation(`/store/package/${pkg.id}`)}>
                  <img src={pkg.image} className="w-24 h-24 rounded-lg object-cover bg-slate-100" />
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{pkg.name}</h4>
                      <div className="flex gap-1 mt-1">
                        {pkg.tags.map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-red-500 font-bold text-lg">¥{pkg.price}</span>
                        <span className="text-slate-400 text-xs line-through ml-1">¥{pkg.originalPrice}</span>
                      </div>
                      <Button size="sm" className="h-7 px-3 text-xs bg-red-500 hover:bg-red-600 rounded-full">
                        抢购
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby (Weakened) */}
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-bold text-slate-900">附近的人</div>
                <div className="text-xs text-slate-500">查看周边还有谁在玩</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </div>
        </div>

        {/* Mandatory Relationship Selection Modal */}
        <Dialog open={showRelationModal} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-center text-white">
              <h2 className="text-2xl font-bold mb-2">欢迎光临</h2>
              <p className="text-blue-100">为了提供更好的服务，请告诉我们</p>
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-lg font-bold text-center text-slate-900 mb-6">
                你今天是和谁来吃饭？
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {RELATIONSHIPS.map(rel => (
                  <button
                    key={rel.id}
                    onClick={() => handleRelationSelect(rel.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                      selectedRelation === rel.id 
                        ? "border-blue-600 bg-blue-50" 
                        : "border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                      rel.bg
                    )}>
                      <rel.icon className={cn("w-6 h-6", rel.color)} />
                    </div>
                    <span className={cn(
                      "font-bold mb-1",
                      selectedRelation === rel.id ? "text-blue-700" : "text-slate-900"
                    )}>{rel.label}</span>
                    <span className="text-xs text-slate-400">{rel.desc}</span>
                  </button>
                ))}
              </div>
              <Button 
                className="w-full h-12 text-lg font-bold rounded-xl"
                disabled={!selectedRelation}
                onClick={handleConfirmRelation}
              >
                确认进入
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
