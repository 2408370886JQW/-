import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Users, Utensils, Heart, Beer, Camera, Sparkles, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock data for shop
const SHOP_INFO = {
  id: "123",
  name: "Blue Frog 蓝蛙 (三里屯店)",
  address: "三里屯太古里南区3层",
  distance: "0m",
};

// Relationship options
const RELATIONSHIPS = [
  { id: "date", label: "情侣/暧昧", icon: Heart, color: "text-pink-500", bg: "bg-pink-50", border: "border-pink-200" },
  { id: "bestie", label: "闺蜜", icon: Camera, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200" },
  { id: "bros", label: "兄弟", icon: Beer, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
  { id: "first_meet", label: "第一次见面", icon: Sparkles, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" },
];

export default function StoreHomePage() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const [showModal, setShowModal] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState<string | null>(null);

  useEffect(() => {
    // Check if it's the first visit today for this store scene
    // In a real app, this would check the 'scene' param and localStorage
    const hasVisitedToday = localStorage.getItem(`visited_${SHOP_INFO.id}_${new Date().toDateString()}`);
    
    if (!hasVisitedToday) {
      // Show mandatory modal
      setShowModal(true);
    }
  }, []);

  const handleRelationSelect = (id: string) => {
    setSelectedRelation(id);
  };

  const handleConfirmRelation = () => {
    if (!selectedRelation) return;
    
    // Mark as visited
    localStorage.setItem(`visited_${SHOP_INFO.id}_${new Date().toDateString()}`, "true");
    
    // Redirect to scenario page
    setLocation(`/store/scenario?relation=${selectedRelation}&shop_id=${SHOP_INFO.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Bar */}
      <div className="bg-white px-4 py-3 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#FF4D00]" />
          <span className="font-medium text-slate-900 text-sm">你正在：{SHOP_INFO.name}</span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 1. 相见入口 (Meet Entrance) */}
        <div 
          className="bg-gradient-to-r from-[#FF4D00] to-[#FF8534] rounded-2xl p-5 text-white shadow-lg shadow-orange-200 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
          onClick={() => setLocation("/meet")}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-6 h-6" />
              <h2 className="text-xl font-bold">看看谁在店里</h2>
            </div>
            <p className="text-white/90 text-sm mb-4">发现此时此刻也在店里的有趣灵魂</p>
            <Button size="sm" className="bg-white text-[#FF4D00] hover:bg-white/90 font-bold rounded-full px-6">
              立即查看
            </Button>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="absolute right-10 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        </div>

        {/* 2. 本店推荐套餐 (Recommended Packages) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-[#FF4D00]" />
              本店推荐套餐
            </h3>
            <span className="text-xs text-slate-400 flex items-center">
              全部 <ChevronRight className="w-3 h-3" />
            </span>
          </div>
          
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Card key={i} className="overflow-hidden border-none shadow-sm active:scale-[0.99] transition-transform">
                <div className="flex">
                  <div className="w-24 h-24 bg-slate-200 shrink-0">
                    <img 
                      src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop&q=80&id=${i}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">双人浪漫微醺套餐</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">含主食2份 + 特调鸡尾酒2杯 + 甜品</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[#FF4D00] text-sm font-bold">¥</span>
                        <span className="text-[#FF4D00] text-lg font-bold">298</span>
                        <span className="text-slate-400 text-xs line-through ml-1">¥468</span>
                      </div>
                      <Button size="sm" className="h-7 text-xs bg-[#FF4D00] hover:bg-[#FF4D00]/90 rounded-full">
                        抢购
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 3. 地图/附近人 (Weakened) */}
        <div className="pt-2">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900">附近的人</h3>
              <span className="text-xs text-slate-400">查看更多</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-100">
                    <img 
                      src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80&id=${i}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">0.1km</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed left-4 right-4 top-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 z-50 shadow-2xl"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">你今天是和谁来吃饭？</h2>
                <p className="text-slate-500 text-sm">选择关系，为你推荐最合适的玩法</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {RELATIONSHIPS.map((rel) => {
                  const Icon = rel.icon;
                  const isSelected = selectedRelation === rel.id;
                  return (
                    <button
                      key={rel.id}
                      onClick={() => handleRelationSelect(rel.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200",
                        isSelected 
                          ? `${rel.border} ${rel.bg} ring-2 ring-offset-2 ring-[#FF4D00]/20` 
                          : "border-slate-100 bg-white hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center mb-2",
                        isSelected ? "bg-white" : rel.bg
                      )}>
                        <Icon className={cn("w-5 h-5", rel.color)} />
                      </div>
                      <span className={cn(
                        "font-bold text-sm",
                        isSelected ? "text-slate-900" : "text-slate-600"
                      )}>
                        {rel.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <Button 
                className={cn(
                  "w-full h-12 text-lg font-bold rounded-xl transition-all",
                  selectedRelation 
                    ? "bg-[#FF4D00] hover:bg-[#FF4D00]/90 text-white shadow-lg shadow-orange-200" 
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
                disabled={!selectedRelation}
                onClick={handleConfirmRelation}
              >
                确认进入
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
