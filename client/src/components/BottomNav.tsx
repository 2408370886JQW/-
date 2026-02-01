import { Link, useLocation } from "wouter";
import { MapPin, Users, Plus, MessageSquare, User, X, Heart, Camera, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function BottomNav() {
  const [location] = useLocation();
  const [isPublishOpen, setIsPublishOpen] = useState(false);

  // Wireframe structure: Map, Circles, Publish (Center), Chat, Friends
  const navItems = [
    { path: "/", icon: MapPin, label: "地图", isMap: true },
    { path: "/circles", icon: Users, label: "圈子" },
    { path: "/publish", icon: Plus, label: "发布", isSpecial: true },
    { path: "/chat", icon: MessageSquare, label: "聊天" },
    { path: "/profile", icon: User, label: "我的" },
  ];

  const togglePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPublishOpen(!isPublishOpen);
  };

  return (
    <>
      {/* Publish Popup Overlay */}
      <AnimatePresence>
        {isPublishOpen && (
          <div className="fixed inset-0 z-[60] flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPublishOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Menu Content */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-t-3xl p-6 pb-safe z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">创建一次见面</h3>
                <button onClick={() => setIsPublishOpen(false)} className="p-2 bg-slate-100 rounded-full">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <button className="flex flex-col items-center gap-3 group">
                  <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center group-active:scale-95 transition-transform">
                    <Heart className="w-8 h-8 text-pink-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">约会</span>
                </button>
                <button className="flex flex-col items-center gap-3 group">
                  <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center group-active:scale-95 transition-transform">
                    <Camera className="w-8 h-8 text-purple-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">聚会</span>
                </button>
                <button className="flex flex-col items-center gap-3 group">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center group-active:scale-95 transition-transform">
                    <Coffee className="w-8 h-8 text-amber-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">搭子</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-900">智能生成流程</span>
                    <span className="text-xs text-slate-400">AI 帮你安排</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">输入你的想法，例如：“想和女朋友去安静的地方吃日料然后看电影”</p>
                  <Button className="w-full bg-slate-900 text-white h-10 rounded-lg text-sm">
                    一键生成
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 pb-safe">
        <div className="flex justify-around items-end h-16 px-2 max-w-md mx-auto relative">
          {navItems.map((item) => {
            const isActive = location === item.path;
            
            if (item.isSpecial) {
              return (
                <div key={item.path} onClick={togglePublish}>
                  <div className="relative -top-5 flex flex-col items-center justify-center cursor-pointer">
                    <motion.div 
                      animate={isPublishOpen ? { rotate: 45 } : { rotate: 0 }}
                      className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <span className="text-[10px] font-medium text-slate-600 mt-1">
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            }

            // Special handling for Map icon with animation
            if (item.isMap) {
              return (
                <Link key={item.path} href={item.path}>
                  <div className="flex flex-col items-center justify-center w-16 h-full pb-2 cursor-pointer relative">
                    {/* Animated Background Effect when Active */}
                    {isActive && (
                      <motion.div
                        className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-100/50 -z-10"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0.2, 0.5]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                    
                    {/* Icon with Bounce Effect */}
                    <motion.div
                      animate={isActive ? { y: [0, -4, 0] } : { y: 0 }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        repeatDelay: 1
                      }}
                    >
                      <item.icon
                        className={cn(
                          "w-6 h-6 mb-1 transition-colors relative z-10",
                          isActive ? "text-blue-600 fill-blue-600" : "text-slate-400"
                        )}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    </motion.div>
                    
                    <span
                      className={cn(
                        "text-[10px] font-medium transition-colors",
                        isActive ? "text-blue-600" : "text-slate-400"
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            }

            return (
              <Link key={item.path} href={item.path}>
                <div className="flex flex-col items-center justify-center w-16 h-full pb-2 cursor-pointer active:scale-95 transition-transform">
                  <item.icon
                    className={cn(
                      "w-6 h-6 mb-1 transition-colors",
                      isActive ? "text-slate-900 fill-slate-900" : "text-slate-400"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium transition-colors",
                      isActive ? "text-slate-900" : "text-slate-400"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
