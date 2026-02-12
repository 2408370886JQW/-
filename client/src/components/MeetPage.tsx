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
  // 1: Relation Selection (Main View) + Scan Entry (Bottom Card)
  // 2: Venue & Package List (Full Screen)
  // 3: Detail Page (Full Screen)
  // 4: Payment Verification (Overlay)
  // 5: Success Page (Full Screen)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isPaying, setIsPaying] = useState(false);

  // Simulate Face ID scan
  useEffect(() => {
    if (isPaying) {
      const timer = setTimeout(() => {
        setStep(5);
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
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5);
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
          {/* Step 2: Venue & Package List (Optimized Flow) */}
          {step === 2 && (
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
                  onClick={() => setStep(1)}
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
                  onClick={() => setStep(3)}
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
                  onClick={() => setStep(3)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer"
                >
                  <div className="flex gap-4">
                    <img 
                      src="https://images.unsplash.com/photo-1544025162-d76690b6d0ce?w=400&q=80" 
                      alt="Food" 
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg mb-1">心动·法式浪漫晚餐</h4>
                        <p className="text-slate-400 text-xs line-clamp-2">澳洲M5和牛眼肉 + 鹅肝慕斯 + 甜点拼盘</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-orange-500 font-bold text-sm">¥</span>
                          <span className="text-orange-500 font-bold text-xl">520</span>
                          <span className="text-slate-300 text-xs line-through ml-1">¥888</span>
                        </div>
                        <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs font-bold">
                          抢购
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Step 3: Detail Page */}
          {step === 3 && (
            <div className="flex-1 flex flex-col bg-white overflow-y-auto pb-24">
              {/* Header Image */}
              <div className="relative h-72 bg-slate-200 shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80" 
                  alt="Detail" 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => setStep(2)}
                  className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 px-6 py-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">初见·双人轻食套餐</h1>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-orange-500 font-bold text-2xl">¥198</span>
                  <span className="text-slate-400 text-sm line-through">¥298</span>
                  <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded ml-2">6.6折</span>
                </div>

                <div className="space-y-6">
                  <section>
                    <h3 className="font-bold text-slate-900 mb-3">套餐内容</h3>
                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>牛油果鲜虾沙拉</span>
                        <span>x1</span>
                      </div>
                      <div className="flex justify-between">
                        <span>黑松露奶油意面</span>
                        <span>x1</span>
                      </div>
                      <div className="flex justify-between">
                        <span>特调气泡水</span>
                        <span>x2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>餐前面包</span>
                        <span>x1</span>
                      </div>
                    </div>
                  </section>

                  <div className="h-[1px] bg-slate-100"></div>

                  <section>
                    <h3 className="font-bold text-slate-900 mb-3">购买须知</h3>
                    <ul className="space-y-2 text-sm text-slate-500 list-disc pl-4">
                      <li>有效期：购买后30天内有效</li>
                      <li>使用时间：11:00 - 21:00</li>
                      <li>需提前2小时预约</li>
                      <li>不可与其他优惠同享</li>
                    </ul>
                  </section>
                </div>
              </div>

              {/* Bottom Bar - Fixed at bottom of flex container */}
              <div className="p-4 border-t border-slate-100 bg-white shrink-0 z-[2001]">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPaying(true)}
                  className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-slate-200"
                >
                  立即抢购 ¥198
                </motion.button>
              </div>
            </div>
          )}

          {/* Step 4: Payment Verification Overlay */}
          {isPaying && (
            <div className="fixed inset-0 z-[2002] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl p-8 w-full max-w-sm text-center"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
                  <motion.div 
                    animate={{ y: [0, 80, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 right-0 h-1 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                  ></motion.div>
                  <ScanLine className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Face ID 支付</h3>
                <p className="text-slate-500 mb-8">请注视屏幕以确认支付</p>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2 }}
                    className="h-full bg-slate-900"
                  ></motion.div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Step 5: Success Page */}
          {step === 5 && (
            <div className="flex-1 flex flex-col items-center justify-center bg-white p-6 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
              >
                <Check className="w-12 h-12 text-green-600" />
              </motion.div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">支付成功</h2>
              <p className="text-slate-500 mb-12">订单已确认，请前往门店使用</p>
              
              <div className="w-full space-y-4">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setStep(1); onNavigate('encounter'); }}
                  className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-lg shadow-lg"
                >
                  查看订单
                </motion.button>
                
                <div className="grid grid-cols-2 gap-4">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setStep(1); onNavigate('encounter'); }}
                    className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <MapPin className="w-6 h-6 text-blue-500" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">去偶遇</span>
                  </motion.button>
                  
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setStep(1); onNavigate('moments'); }}
                    className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                      <Camera className="w-6 h-6 text-purple-500" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">看看附近动态</span>
                  </motion.button>
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

      {/* Step 1: Relation Selection (Main View) */}
      {step === 1 && (
        <div className="flex-1 flex flex-col bg-white relative h-full">
          {/* Global Back Button - Fixed at Top Left */}
          <button 
            onClick={() => onNavigate('encounter')}
            className="fixed top-12 left-6 w-10 h-10 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform z-[10000]"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>

          <div className="px-6 pt-24 pb-4">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">今天和谁相见</h1>
            <p className="text-slate-400 text-sm">选择一个场景，开启你的社交之旅</p>
          </div>

          <div className="flex-1 px-6 overflow-y-auto pb-48">
            <div className="grid grid-cols-2 gap-4">
              {RELATIONS_STEP2.map((item) => (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setStep(2)} // This actually goes to the package list now, logic needs to be updated
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

          {/* Bottom Scan Card - Fixed at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pb-24 bg-gradient-to-t from-white via-white to-transparent pt-12 z-[100]">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden"
            >
              {/* Decorative Circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl mb-1">到店相见</h3>
                    <p className="text-indigo-100 text-xs opacity-90">扫码解锁专属优惠与社交玩法</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                    <ScanLine className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(2)}
                  className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg text-sm"
                >
                  <Camera className="w-4 h-4" />
                  模拟扫码进店
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
