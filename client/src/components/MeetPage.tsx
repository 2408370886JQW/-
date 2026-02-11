import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, Camera, Beer, User, Users, ScanLine, ArrowRight, Share2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for Scenarios
const SCENARIOS = [
  { id: "first-date", label: "第一次见面", icon: Star, color: "text-pink-500", bg: "bg-pink-50" },
  { id: "couple", label: "情侣/暧昧", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
  { id: "bestie", label: "闺蜜", icon: Camera, color: "text-purple-500", bg: "bg-purple-50" },
  { id: "bros", label: "兄弟", icon: Beer, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "solo", label: "独处时光", icon: User, color: "text-slate-500", bg: "bg-slate-50" },
  { id: "family", label: "阖家团圆", icon: Users, color: "text-orange-500", bg: "bg-orange-50" },
];

interface MeetPageProps {
  onNavigate: (tab: string) => void;
}

export default function MeetPage({ onNavigate }: MeetPageProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"idle" | "processing" | "success">("idle");
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle Payment Flow
  useEffect(() => {
    if (showPayment) {
      setPaymentStep("processing");
      const timer = setTimeout(() => {
        setPaymentStep("success");
        setTimeout(() => {
          setShowPayment(false);
          setShowSuccess(true);
        }, 1000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showPayment]);

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col items-center pt-20 pb-safe px-6">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200"
        >
          <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-2">支付</h2>
        <h2 className="text-3xl font-bold text-slate-900 mb-12">已完成</h2>
        
        <p className="text-slate-400 text-sm mb-6">请向店员出示核销码</p>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
          <div className="w-48 h-48 bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden">
            {/* Mock QR Code Style */}
            <div className="absolute inset-4 border-4 border-white rounded-lg opacity-20"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="w-8 h-8 bg-white rounded-sm"></div>
              <div className="w-8 h-8 bg-white rounded-sm"></div>
              <div className="w-8 h-8 bg-white rounded-sm"></div>
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="text-2xl font-mono font-bold text-slate-900 tracking-widest mb-auto">
          8392 1029
        </div>

        {/* Bottom Actions */}
        <div className="w-full space-y-4">
          <button 
            onClick={() => onNavigate("encounter")}
            className="w-full py-4 bg-slate-900 text-white rounded-full font-bold text-lg flex items-center justify-between px-8 active:scale-95 transition-transform"
          >
            <span>去偶遇</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button className="w-full py-4 bg-white text-slate-600 rounded-full font-bold text-lg flex items-center justify-between px-8 border border-slate-200 active:scale-95 transition-transform">
            <span>打发你的等待时间</span>
            <Share2 className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setShowSuccess(false)}
            className="w-full py-4 text-slate-400 text-sm font-medium"
          >
            返回相见
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Header Image */}
      <div className="h-64 w-full relative shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop" 
          className="w-full h-full object-cover"
          alt="Restaurant"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-slate-50"></div>
        <div className="absolute top-12 left-6 text-white">
          <div className="text-xs opacity-80 mb-1 tracking-widest">当前位置</div>
          <div className="text-xl font-bold">花田错·创意餐厅</div>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 -mt-10 relative z-10 px-6 pb-32 overflow-y-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-slate-900">今天和谁相见</h2>
        </div>

        {/* Scenario Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {SCENARIOS.map((scenario) => {
            const Icon = scenario.icon;
            return (
              <button
                key={scenario.id}
                onClick={() => setShowPayment(true)}
                className={cn(
                  "aspect-[4/3] rounded-3xl flex flex-col items-center justify-center gap-3 transition-transform active:scale-95",
                  scenario.bg
                )}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Icon className={cn("w-6 h-6", scenario.color)} />
                </div>
                <span className="text-sm font-medium text-slate-700">{scenario.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scan Card */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-lg font-bold mb-1">扫码进店</h3>
              <p className="text-slate-400 text-xs">已在店内？直接扫码</p>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <button 
            onClick={() => setShowPayment(true)}
            className="w-full py-3 bg-blue-500 rounded-full font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <ScanLine className="w-5 h-5" />
            开启扫码
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full bg-white rounded-t-3xl p-8 pb-safe"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
              
              <div className="flex justify-between items-center mb-12">
                <span className="text-slate-500 text-lg">订单金额</span>
                <span className="text-4xl font-bold text-slate-900">¥198</span>
              </div>

              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative w-24 h-24 mb-6">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-blue-100 rounded-full border-t-blue-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ScanLine className="w-10 h-10 text-blue-500" />
                  </div>
                </div>
                <p className="text-slate-600 font-medium">正在验证面容 ID...</p>
              </div>

              <div className="text-center mt-8 flex items-center justify-center gap-2 text-slate-400 text-sm">
                <div className="w-4 h-4 border border-slate-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full" />
                </div>
                安全支付保障中
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
