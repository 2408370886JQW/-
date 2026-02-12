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
  X,
  Utensils,
  Receipt
} from 'lucide-react';

// --- Data & Constants ---

// Step 1: Relations
const RELATIONS_STEP1 = [
  { id: 'first_meet', icon: Heart, label: '第一次见面', bg: 'bg-pink-50', color: 'text-pink-500' },
  { id: 'couple', icon: Heart, label: '情侣/暧昧', bg: 'bg-red-50', color: 'text-red-500' },
  { id: 'bestie', icon: Camera, label: '闺蜜', bg: 'bg-purple-50', color: 'text-purple-500' },
  { id: 'bro', icon: Beer, label: '兄弟', bg: 'bg-blue-50', color: 'text-blue-500' },
  { id: 'alone', icon: User, label: '独处时光', bg: 'bg-slate-50', color: 'text-slate-500' },
  { id: 'family', icon: Users, label: '阖家团圆', bg: 'bg-orange-50', color: 'text-orange-500' },
];

// Step 2: Restaurants
const RESTAURANTS_STEP2 = [
  {
    id: 1,
    name: '花田错·西餐厅',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    location: '三里屯太古里北区 N4-30',
    tags: ['轻松不尴尬', '环境安静'],
    rating: 4.8,
    price: '¥198/人'
  },
  {
    id: 2,
    name: 'Blue Note Jazz Club',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    location: '前门东大街23号',
    tags: ['爵士乐', '氛围感'],
    rating: 4.9,
    price: '¥320/人'
  },
  {
    id: 3,
    name: 'TRB Hutong',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    location: '沙滩北街23号',
    tags: ['胡同景观', '法餐'],
    rating: 4.7,
    price: '¥580/人'
  },
  {
    id: 4,
    name: 'The Georg',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3c622171d?w=800&q=80',
    location: '东不压桥胡同45号',
    tags: ['北欧风', '艺术感'],
    rating: 4.6,
    price: '¥450/人'
  },
  {
    id: 5,
    name: 'Opera BOMBANA',
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd354ca8?w=800&q=80',
    location: '东大桥路9号侨福芳草地',
    tags: ['米其林', '意式'],
    rating: 4.9,
    price: '¥880/人'
  }
];

interface MeetPageProps {
  onNavigate: (tab: string) => void;
}

export default function MeetPage({ onNavigate }: MeetPageProps) {
  // Steps: 
  // 1: Relation Selection (Main View)
  // 2: Restaurant List (Full Screen)
  // 3: Package List (Full Screen)
  // 4: Package Detail (Full Screen)
  // 5: Payment Verification (Overlay)
  // 6: Success Page (Full Screen)
  // 7: Order Detail (Full Screen)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [isPaying, setIsPaying] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof RESTAURANTS_STEP2[0] | null>(null);

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
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7);
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
          {/* Step 2: Restaurant List */}
          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-24"
            >
              <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 pt-12 pb-4 border-b border-slate-100 flex items-center gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-900">推荐餐厅</h1>
              </div>

              <div className="p-4 space-y-4">
                {RESTAURANTS_STEP2.map((restaurant) => (
                  <motion.div
                    key={restaurant.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedRestaurant(restaurant);
                      setStep(3);
                    }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100"
                  >
                    <div className="h-40 relative">
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-orange-500">
                        <Star className="w-3 h-3 fill-current" />
                        {restaurant.rating}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-slate-900">{restaurant.name}</h3>
                        <span className="text-slate-900 font-bold text-sm">{restaurant.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <MapPin className="w-3 h-3" />
                        {restaurant.location}
                      </div>
                      <div className="flex gap-2">
                        {restaurant.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Package List (Restaurant Detail) */}
          {step === 3 && selectedRestaurant && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-24"
            >
              {/* Header Image */}
              <div className="relative h-64 bg-slate-200">
                <img 
                  src={selectedRestaurant.image} 
                  alt={selectedRestaurant.name} 
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
                  <h1 className="text-3xl font-bold mb-2">{selectedRestaurant.name}</h1>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedRestaurant.location}</span>
                  </div>
                </div>
              </div>

              {/* Suggestion Card */}
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
                          支付
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Package 2 */}
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(4)}
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
                          支付
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Package Detail */}
          {step === 4 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col bg-white overflow-y-auto pb-24"
            >
              {/* Header Image */}
              <div className="relative h-72 bg-slate-200 shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80" 
                  alt="Detail" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
                <button 
                  onClick={() => setStep(3)}
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
                  支付
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Payment Verification Overlay (WeChat Style) */}
          {isPaying && (
            <div className="fixed inset-0 z-[2002] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center">
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="relative border-b border-slate-100 p-4 text-center">
                  <button 
                    onClick={() => setIsPaying(false)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-1"
                  >
                    <X className="w-5 h-5 text-slate-900" />
                  </button>
                  <h3 className="font-bold text-slate-900 text-lg">请输入支付密码</h3>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center">
                  <div className="text-sm text-slate-500 mb-2">FIND ME 发现我</div>
                  <div className="text-3xl font-bold text-slate-900 mb-8">¥198.00</div>

                  {/* Password Dots */}
                  <div className="flex gap-2 mb-8">
                    {[1, 2, 3, 4, 5, 6].map((_, i) => (
                      <div key={i} className="w-12 h-12 border border-slate-200 rounded-lg flex items-center justify-center bg-slate-50">
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.3 }}
                          className="w-3 h-3 bg-slate-900 rounded-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keyboard (Visual Only) */}
                <div className="grid grid-cols-3 bg-slate-100 gap-[1px] pt-[1px]">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button key={num} className="bg-white py-5 text-xl font-medium active:bg-slate-50">
                      {num}
                    </button>
                  ))}
                  <div className="bg-slate-100"></div>
                  <button className="bg-white py-5 text-xl font-medium active:bg-slate-50">0</button>
                  <button className="bg-slate-100 flex items-center justify-center active:bg-slate-200">
                    <X className="w-6 h-6 text-slate-900" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Step 6: Success Page */}
          {step === 6 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center bg-white p-6 text-center"
            >
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
                  onClick={() => setStep(7)}
                  className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-lg shadow-lg"
                >
                  查看订单
                </motion.button>
                
                <div className="grid grid-cols-2 gap-4">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { 
                      setStep(1); 
                      onNavigate('encounter'); 
                    }}
                    className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    {/* Radar Effect */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                      <motion.div 
                        animate={{ scale: [1, 2], opacity: [1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-full h-full bg-blue-500 rounded-full"
                      />
                    </div>
                    
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                      <MapPin className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="text-center relative z-10">
                      <div className="font-bold text-slate-900">开启偶遇雷达</div>
                      <div className="text-[10px] text-blue-500 font-medium mt-0.5">附近有28人正在等你</div>
                    </div>
                  </motion.button>

                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { 
                      setStep(1); 
                      onNavigate('moments'); 
                    }}
                    className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all group relative"
                  >
                    {/* Notification Bubble */}
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 500,
                        damping: 15,
                        delay: 0.5 
                      }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-20 flex items-center gap-1 border-2 border-white"
                    >
                      <motion.span
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        +12个新朋友
                      </motion.span>
                    </motion.div>

                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                      <Camera className="w-6 h-6 text-purple-500" />
                    </div>
                    <div className="text-center relative z-10">
                      <div className="font-bold text-slate-900">探索周边新鲜事</div>
                      <div className="text-[10px] text-purple-500 font-medium mt-0.5">发现有趣灵魂</div>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 7: Order Detail Page */}
          {step === 7 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-24"
            >
              <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 pt-12 pb-4 border-b border-slate-100 flex items-center gap-4">
                <button 
                  onClick={() => setStep(6)}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-900">订单详情</h1>
              </div>

              <div className="p-4 space-y-4">
                {/* QR Code Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                  <h3 className="font-bold text-lg text-slate-900 mb-1">初见·双人轻食套餐</h3>
                  <p className="text-slate-500 text-sm mb-6">有效期至 2026-03-15</p>
                  
                  <div className="w-48 h-48 bg-slate-900 rounded-xl flex items-center justify-center mb-4">
                    <ScanLine className="w-24 h-24 text-white opacity-50" />
                  </div>
                  
                  <div className="bg-slate-50 px-4 py-2 rounded-lg mb-2">
                    <span className="text-slate-400 text-xs block mb-1">核销码</span>
                    <span className="text-xl font-mono font-bold text-slate-900 tracking-widest">8829 1034</span>
                  </div>
                  <p className="text-xs text-slate-400">请向店员出示此码核销</p>
                </div>

                {/* Order Info */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" 
                        alt="Restaurant" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">花田错·西餐厅</h4>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3 h-3" />
                        三里屯太古里北区 N4-30
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">下单时间</span>
                      <span className="text-slate-900">2026-02-13 14:30:25</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">支付方式</span>
                      <span className="text-slate-900">Face ID 支付</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">实付金额</span>
                      <span className="font-bold text-slate-900">¥198.00</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm">
                    联系商家
                  </button>
                  <button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm">
                    申请退款
                  </button>
                </div>
              </div>
            </motion.div>
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
              {RELATIONS_STEP1.map((item) => (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setStep(2)}
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
