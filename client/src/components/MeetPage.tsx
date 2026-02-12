import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Camera, 
  Beer, 
  Briefcase, 
  Coffee, 
  Moon, 
  Heart, 
  Gift, 
  User, 
  Users, 
  Share2, 
  Check, 
  ScanLine,
  ChevronRight,
  MapPin,
  Clock,
  Star,
  Navigation,
  X
} from 'lucide-react';

// --- Data & Constants ---

// Step 1: Scenarios
const SCENARIOS_STEP1 = [
  { id: 'date', icon: Heart, label: '约会', bg: 'bg-pink-50', color: 'text-pink-500' },
  { id: 'bestie', icon: Camera, label: '闺蜜', bg: 'bg-purple-50', color: 'text-purple-500' },
  { id: 'bro', icon: Beer, label: '兄弟', bg: 'bg-blue-50', color: 'text-blue-500', selected: true },
  { id: 'birthday', icon: Gift, label: '生日', bg: 'bg-red-50', color: 'text-red-500' },
  { id: 'business', icon: Briefcase, label: '商务', bg: 'bg-slate-50', color: 'text-slate-500' },
  { id: 'hangout', icon: Coffee, label: '坐坐', bg: 'bg-yellow-50', color: 'text-yellow-500' },
  { id: 'latenight', icon: Moon, label: '深夜', bg: 'bg-indigo-50', color: 'text-indigo-500' },
];

// Step 2: Relations
const RELATIONS_STEP2 = [
  { id: 'first_meet', icon: Heart, label: '第一次见面', bg: 'bg-pink-50', color: 'text-pink-500' },
  { id: 'couple', icon: Heart, label: '情侣/暧昧', bg: 'bg-red-50', color: 'text-red-500' },
  { id: 'bestie', icon: Camera, label: '闺蜜', bg: 'bg-purple-50', color: 'text-purple-500' },
  { id: 'bro', icon: Beer, label: '兄弟', bg: 'bg-blue-50', color: 'text-blue-500' },
  { id: 'alone', icon: User, label: '独处时光', bg: 'bg-slate-50', color: 'text-slate-500' },
  { id: 'family', icon: Users, label: '阖家团圆', bg: 'bg-orange-50', color: 'text-orange-500' },
];

interface MeetPageProps {
  onNavigate: (tab: string) => void;
}

export default function MeetPage({ onNavigate }: MeetPageProps) {
  // Steps: 
  // 1: Scan Entry (Overlay on Map)
  // 2: Relation Selection (Full Screen)
  // 3: Venue & Package List (Full Screen) - NEW STEP
  // 4: Detail Page (Full Screen)
  // 5: Payment Verification (Overlay)
  // 6: Success Page (Full Screen)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isPaying, setIsPaying] = useState(false);

  // Simulate Face ID scan
  useEffect(() => {
    if (isPaying) {
      const timer = setTimeout(() => {
        setStep(6);
        setIsPaying(false);
        // Trigger confetti on success
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF69B4', '#FFD700', '#00BFFF', '#32CD32']
        });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isPaying]);

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5 | 6);
    } else {
      onNavigate('encounter');
    }
  };

  // --- Portal Content for Full Screen Steps ---
  // This ensures these steps are rendered at document.body level, 
  // completely bypassing the main app layout and bottom tab bar.
  const fullScreenContent = (
    <AnimatePresence mode="wait">
      {step >= 2 && (
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[9999] bg-slate-50 flex flex-col overflow-hidden"
        >
          {/* Step 2: Relation Selection */}
          {step === 2 && (
            <div className="flex-1 flex flex-col bg-white relative">
              {/* Back to Home Button */}
              <button 
                onClick={() => onNavigate('encounter')}
                className="absolute top-12 right-6 w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform z-10"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              <div className="px-6 pt-12 pb-4">
                <button 
                  onClick={() => setStep(1)}
                  className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm mb-6 active:scale-95 transition-transform"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">今天和谁相见</h1>
                <p className="text-slate-400 text-sm">选择一个场景，开启你的社交之旅</p>
              </div>

              <div className="flex-1 px-6 overflow-y-auto pb-24">
                <div className="grid grid-cols-2 gap-4">
                  {RELATIONS_STEP2.map((item) => (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setStep(3)}
                      className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-sm hover:shadow-md transition-all"
                    >
                      <motion.div 
                        whileTap={{ scale: 1.2, rotate: 10 }}
                        className={`w-16 h-16 ${item.bg} rounded-full flex items-center justify-center`}
                      >
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                      </motion.div>
                      <span className="font-bold text-slate-900">{item.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Venue & Package List (Optimized Flow) */}
          {step === 3 && (
            <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-24">
              {/* Header Image */}
              <div className="relative h-64 bg-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" 
                  alt="Restaurant" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
                <button 
                  onClick={() => setStep(2)}
                  className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 left-6 text-white">
                  <h1 className="text-3xl font-bold mb-2">花田错·西餐厅</h1>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <MapPin className="w-4 h-4" />
                    <span>三里屯太古里北区 N4-30</span>
                  </div>
                </div>
              </div>

              {/* Suggestion Card - NEW ADDITION */}
              <div className="px-6 pt-6 pb-2">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 rounded-full -mr-8 -mt-8 blur-xl"></div>
                  
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-500 shrink-0">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h3 className="font-bold text-indigo-900 mb-1">今日约会建议</h3>
                      <div className="flex items-center gap-2 text-sm text-indigo-700/80 mb-3">
                        <span className="bg-white/60 px-2 py-0.5 rounded text-xs font-medium">轻松不尴尬</span>
                        <span className="bg-white/60 px-2 py-0.5 rounded text-xs font-medium">环境安静</span>
                      </div>
                      
                      {/* Timeline */}
                      <div className="flex items-center gap-2 text-xs text-indigo-800">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>14:00 见面破冰</span>
                        </div>
                        <div className="w-4 h-[1px] bg-indigo-300"></div>
                        <div className="flex items-center gap-1 opacity-60">
                          <Camera className="w-3 h-3" />
                          <span>16:00 一起看展</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Package List */}
              <div className="px-6 py-6 space-y-6">
                <h3 className="font-bold text-lg text-slate-900">精选套餐</h3>
                
                {/* Package 1 */}
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(4)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer"
                >
                  <div className="flex gap-4">
                    <img 
                      src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80" 
                      alt="Food" 
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg mb-1">初见·双人轻食套餐</h4>
                        <p className="text-slate-400 text-xs line-clamp-2">牛油果鲜虾沙拉 + 黑松露奶油意面 + 特调气泡水x2</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-orange-500 font-bold text-sm">¥</span>
                          <span className="text-orange-500 font-bold text-xl">198</span>
                          <span className="text-slate-300 text-xs line-through ml-1">¥298</span>
                        </div>
                        <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs font-bold">
                          抢购
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Package 2 */}
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 opacity-60"
                >
                  <div className="flex gap-4">
                    <img 
                      src="https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" 
                      alt="Food" 
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg mb-1">豪华·澳洲M5牛排餐</h4>
                        <p className="text-slate-400 text-xs line-clamp-2">澳洲M5和牛 + 鹅肝 + 红酒x2</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-orange-500 font-bold text-sm">¥</span>
                          <span className="text-orange-500 font-bold text-xl">520</span>
                          <span className="text-slate-300 text-xs line-through ml-1">¥888</span>
                        </div>
                        <div className="bg-slate-100 text-slate-400 px-4 py-1.5 rounded-full text-xs font-bold">
                          售罄
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Step 4: Detail Page */}
          {step === 4 && (
            <div className="flex-1 flex flex-col bg-white h-full relative">
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto pb-32">
                {/* Header Image */}
                <div className="relative h-72">
                  <img 
                    src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80" 
                    alt="Detail" 
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={() => setStep(3)}
                    className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95 transition-transform z-10"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                </div>

                {/* Content Body */}
                <div className="px-6 py-8 -mt-6 bg-white rounded-t-[2rem] relative z-0">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 mb-2">初见 双人轻食套餐</h1>
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>三里屯·花田错餐厅</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold text-orange-500">¥198</span>
                      <span className="text-slate-400 text-sm line-through">¥298</span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-6 mb-8">
                    <h3 className="font-bold text-lg text-slate-900">套餐内容</h3>
                    
                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                      <div>
                        <div className="font-medium text-slate-900">牛油果鲜虾沙拉</div>
                        <div className="text-slate-400 text-xs mt-1">清新开胃，分量足</div>
                      </div>
                      <span className="font-mono text-slate-500">x1</span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                      <div>
                        <div className="font-medium text-slate-900">黑松露奶油意面</div>
                        <div className="text-slate-400 text-xs mt-1">招牌主食，奶香浓郁</div>
                      </div>
                      <span className="font-mono text-slate-500">x1</span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                      <div>
                        <div className="font-medium text-slate-900">特调气泡水 (2选2)</div>
                        <div className="text-slate-400 text-xs mt-1">白桃乌龙 / 阳光青提</div>
                      </div>
                      <span className="font-mono text-slate-500">x2</span>
                    </div>
                  </div>

                  {/* Info Cards */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <Clock className="w-6 h-6 text-slate-400 mb-2" />
                      <div className="font-bold text-slate-900 text-sm">免预约</div>
                      <div className="text-slate-400 text-xs">随时可用</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <Check className="w-6 h-6 text-slate-400 mb-2" />
                      <div className="font-bold text-slate-900 text-sm">随时退</div>
                      <div className="text-slate-400 text-xs">过期自动退</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar - FIXED IN PORTAL */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[10000]">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-xs text-slate-400">总计</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-orange-500 font-bold">¥</span>
                      <span className="text-2xl text-orange-500 font-bold">198</span>
                    </div>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(5)}
                    className="flex-[2] bg-slate-900 text-white h-14 rounded-full font-bold text-lg shadow-lg shadow-slate-200 flex items-center justify-center"
                  >
                    立即下单
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Payment Overlay */}
          <AnimatePresence>
            {step === 5 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10001] bg-black/60 backdrop-blur-sm flex items-end justify-center"
              >
                <motion.div 
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  className="bg-white w-full sm:w-[90%] max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-8 pb-12"
                >
                  <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-8"></div>
                  
                  <div className="flex justify-between items-center mb-12">
                    <span className="text-slate-500">订单金额</span>
                    <span className="text-3xl font-bold text-slate-900">¥198</span>
                  </div>

                  {!isPaying ? (
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-6 h-6 text-white" />
                          </div>
                          <span className="font-bold text-slate-900">微信支付</span>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center">
                          <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
                        </div>
                      </div>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsPaying(true)}
                        className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-slate-200"
                      >
                        确认支付 ¥198
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="relative w-24 h-24 mb-6">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 border-4 border-blue-100 border-t-blue-500 rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ScanLine className="w-10 h-10 text-blue-500" />
                        </div>
                      </div>
                      <p className="text-slate-900 font-medium mb-2">正在验证面容 ID...</p>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <div className="w-4 h-4 border border-slate-300 rounded-full flex items-center justify-center text-[10px]">ID</div>
                        安全支付保障中
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 6: Success Page */}
          {step === 6 && (
            <div className="fixed inset-0 z-[10002] bg-white flex flex-col">
              {/* Header */}
              <div className="px-6 pt-12 pb-4 flex justify-between items-center">
                <button onClick={() => { setStep(1); onNavigate('encounter'); }} className="p-2 -ml-2">
                  <ArrowLeft className="w-6 h-6 text-slate-900" />
                </button>
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                  <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                  <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                </div>
              </div>

              <div className="flex-1 px-6 flex flex-col">
                {/* Success Icon */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="mb-6"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-200">
                    <Check className="w-8 h-8 text-white stroke-[3]" />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-1">支付</h1>
                  <h1 className="text-3xl font-bold text-slate-900">已完成</h1>
                </motion.div>

                <p className="text-slate-400 text-sm mb-6">祝你们玩得开心！请向店员出示核销码</p>

                {/* QR Code Card */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] mb-8 flex flex-col items-center"
                >
                  <div className="w-48 h-48 bg-slate-900 rounded-3xl p-4 mb-6 relative overflow-hidden">
                    {/* Mock QR Code */}
                    <div className="absolute inset-0 border-[16px] border-white rounded-3xl"></div>
                    <div className="absolute top-4 left-4 w-12 h-12 border-4 border-white rounded-lg"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 border-4 border-white rounded-lg"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-4 border-white rounded-lg"></div>
                    <div className="w-full h-full flex flex-wrap content-center justify-center gap-2 p-4">
                       <div className="w-2 h-2 bg-white rounded-full"></div>
                       <div className="w-2 h-2 bg-white rounded-full"></div>
                       <div className="w-2 h-2 bg-white rounded-full"></div>
                       <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-900 tracking-widest">
                    8392 1029
                  </div>
                </motion.div>

                {/* Status List */}
                <div className="space-y-4 mb-8">
                  {['此刻', '附近', '有趣的灵魂', '正在游荡'].map((item, index) => (
                    <motion.div 
                      key={item} 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="text-slate-600 font-medium"
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="mt-auto pb-8 space-y-4">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setStep(1); onNavigate('encounter'); }}
                    className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-slate-200 flex items-center justify-between px-8"
                  >
                    <span>去偶遇</span>
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </motion.button>
                  
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-white text-slate-900 border border-slate-100 py-4 rounded-full font-bold text-lg shadow-sm flex items-center justify-between px-8"
                  >
                    <span>打发你的等待时间</span>
                    <Share2 className="w-5 h-5 text-slate-400" />
                  </motion.button>

                  <div className="text-center pt-2">
                    <button onClick={() => setStep(1)} className="text-slate-400 text-sm">
                      返回相见
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="absolute inset-0 bg-white flex flex-col overflow-hidden">
      {/* Render Full Screen Steps via Portal */}
      {createPortal(fullScreenContent, document.body)}

      {/* Step 1: Scan Entry (Main View) */}
      {step === 1 && (
        <>
          {/* Bottom Scan Card - Replicating Frame 060 Style */}
          <div className="fixed bottom-24 left-4 right-4 z-[100]">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden"
            >
              {/* Decorative Circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-2xl mb-1">到店相见</h3>
                    <p className="text-indigo-100 text-sm opacity-90">扫码解锁专属优惠与社交玩法</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                    <ScanLine className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(2)}
                  className="w-full bg-white text-indigo-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                  模拟扫码进店
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
