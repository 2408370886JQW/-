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
  Receipt,
  SkipForward
} from 'lucide-react';

// --- Data & Constants ---

// Relations for the overlay card
const RELATIONS = [
  { id: 'first_meet', icon: Heart, label: '第一次见面', bg: 'bg-pink-50', color: 'text-pink-500', tag: 'romantic' },
  { id: 'couple', icon: Heart, label: '情侣/暧昧', bg: 'bg-red-50', color: 'text-red-500', tag: 'romantic' },
  { id: 'bestie', icon: Camera, label: '闺蜜', bg: 'bg-purple-50', color: 'text-purple-500', tag: 'friends' },
  { id: 'bro', icon: Beer, label: '兄弟', bg: 'bg-blue-50', color: 'text-blue-500', tag: 'friends' },
  { id: 'alone', icon: User, label: '独处时光', bg: 'bg-slate-50', color: 'text-slate-500', tag: 'solo' },
  { id: 'family', icon: Users, label: '阖家团圆', bg: 'bg-orange-50', color: 'text-orange-500', tag: 'family' },
];

// The FIXED restaurant that the user "scanned into"
const CURRENT_RESTAURANT = {
  id: 1,
  name: '花田错·西餐厅',
  image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  location: '三里屯太古里北区 N4-30',
  tags: ['轻松不尴尬', '环境安静'],
  rating: 4.8,
  price: '¥198/人',
  phone: '010-6417-8899',
  hours: '11:00 - 22:00',
  gallery: [
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80'
  ],
  dishes: [
    { name: '澳洲M5和牛', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80', price: '¥288' },
    { name: '黑松露意面', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80', price: '¥128' },
    { name: '提拉米苏', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', price: '¥68' }
  ],
  reviews: [
    { user: 'Alice', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', content: '环境非常棒，适合约会！', rating: 5 },
    { user: 'Bob', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80', content: '牛排鲜嫩多汁，服务也很周到。', rating: 4.8 }
  ]
};

// Packages for this restaurant, with relation tags for filtering
const RESTAURANT_PACKAGES = [
  {
    id: 101,
    name: '初见·双人轻食套餐',
    desc: '牛油果鲜虾沙拉 + 黑松露奶油意面 + 特调气泡水x2',
    price: 198,
    originalPrice: 298,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80',
    heroImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    relationTags: ['romantic', 'friends', 'solo'],
    items: [
      { name: '牛油果鲜虾沙拉', qty: 1 },
      { name: '黑松露奶油意面', qty: 1 },
      { name: '特调气泡水', qty: 2 },
      { name: '餐前面包', qty: 1 }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80'
    ],
    notes: ['有效期：购买后30天内有效', '使用时间：11:00 - 21:00', '需提前2小时预约', '不可与其他优惠同享']
  },
  {
    id: 102,
    name: '心动·法式浪漫晚餐',
    desc: '澳洲M5和牛眼肉 + 鹅肝慕斯 + 甜点拼盘 + 红酒x2',
    price: 520,
    originalPrice: 888,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80',
    heroImage: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
    relationTags: ['romantic'],
    items: [
      { name: '澳洲M5和牛眼肉', qty: 1 },
      { name: '鹅肝慕斯', qty: 1 },
      { name: '甜点拼盘', qty: 1 },
      { name: '红酒一杯', qty: 2 }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80',
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80',
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80'
    ],
    notes: ['有效期：购买后15天内有效', '仅限晚餐时段 17:30 - 22:00', '需提前1天预约', '含服务费，不可与其他优惠同享']
  },
  {
    id: 103,
    name: '微醺·下午茶甜蜜时光',
    desc: '精选甜点三层塔 + 手冲咖啡x2 + 季节限定蛋糕',
    price: 128,
    originalPrice: 198,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80',
    heroImage: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80',
    relationTags: ['romantic', 'friends', 'solo'],
    items: [
      { name: '精选甜点三层塔', qty: 1 },
      { name: '手冲咖啡', qty: 2 },
      { name: '季节限定蛋糕', qty: 1 }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80'
    ],
    notes: ['有效期：购买后30天内有效', '使用时间：14:00 - 17:00', '需提前1小时预约']
  },
  {
    id: 104,
    name: '兄弟·豪华烤肉拼盘',
    desc: '澳洲安格斯牛排 + 黑椒猪排 + 精酿啤酒x4',
    price: 368,
    originalPrice: 568,
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80',
    heroImage: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80',
    relationTags: ['friends', 'family'],
    items: [
      { name: '澳洲安格斯牛排', qty: 1 },
      { name: '黑椒猪排', qty: 1 },
      { name: '精酿啤酒', qty: 4 },
      { name: '薯条拼盘', qty: 1 }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80'
    ],
    notes: ['有效期：购买后30天内有效', '使用时间：11:00 - 22:00', '需提前1小时预约']
  },
  {
    id: 105,
    name: '阖家·团圆家宴套餐',
    desc: '红烧肉 + 清蒸鲈鱼 + 时蔬拼盘 + 汤品 (4-6人)',
    price: 688,
    originalPrice: 1088,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
    heroImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    relationTags: ['family'],
    items: [
      { name: '红烧肉', qty: 1 },
      { name: '清蒸鲈鱼', qty: 1 },
      { name: '时蔬拼盘', qty: 2 },
      { name: '老火靓汤', qty: 1 },
      { name: '米饭', qty: 6 }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80'
    ],
    notes: ['有效期：购买后15天内有效', '使用时间：11:00 - 21:00', '需提前1天预约', '4-6人套餐']
  }
];

interface MeetPageProps {
  onNavigate: (tab: string) => void;
}

export default function MeetPage({ onNavigate }: MeetPageProps) {
  // New simplified steps:
  // 1: Scan Entry Page (with scan button)
  // 2: Restaurant Detail + Package List (single restaurant, blurred bg + relation card overlay)
  // 3: Package Detail (full screen single package)
  // 4: Payment Page (payment method selection)
  // 5: Success Page (with encounter/moments navigation)
  // 6: Order Detail Page
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isPaying, setIsPaying] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<typeof RESTAURANT_PACKAGES[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('wechat');
  
  // Relation overlay state
  const [showRelationOverlay, setShowRelationOverlay] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState<string | null>(null);
  const [relationTag, setRelationTag] = useState<string | null>(null);

  // Filtered packages based on relation selection
  const filteredPackages = relationTag 
    ? RESTAURANT_PACKAGES.filter(pkg => pkg.relationTags.includes(relationTag))
    : RESTAURANT_PACKAGES;

  // Handle scan action - go directly to restaurant with relation overlay
  const handleScan = () => {
    setStep(2);
    setShowRelationOverlay(true);
  };

  // Handle relation selection
  const handleSelectRelation = (relation: typeof RELATIONS[0]) => {
    setSelectedRelation(relation.id);
    setRelationTag(relation.tag);
    // Delay to show selection feedback, then dismiss overlay
    setTimeout(() => {
      setShowRelationOverlay(false);
    }, 400);
  };

  // Handle skip relation
  const handleSkipRelation = () => {
    setSelectedRelation(null);
    setRelationTag(null);
    setShowRelationOverlay(false);
  };

  // Simulate payment completion
  useEffect(() => {
    if (isPaying) {
      const timer = setTimeout(() => {
        setStep(5);
        setIsPaying(false);
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

  // --- Portal Content for Full Screen Steps ---
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
          {/* Step 2: Restaurant Detail + Package List (Single Restaurant) */}
          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-24 transition-all duration-500 ${showRelationOverlay ? 'blur-sm scale-[0.98]' : 'blur-0 scale-100'}`}
            >
              {/* Restaurant Header Image */}
              <div className="relative h-56 bg-slate-200 shrink-0">
                <img 
                  src={CURRENT_RESTAURANT.image} 
                  alt={CURRENT_RESTAURANT.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20"></div>
                <button 
                  onClick={() => { setStep(1); setSelectedRelation(null); setRelationTag(null); }}
                  className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <h1 className="text-2xl font-bold mb-1">{CURRENT_RESTAURANT.name}</h1>
                  <div className="flex items-center gap-3 text-sm opacity-90">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{CURRENT_RESTAURANT.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current text-yellow-400" />
                      <span className="text-yellow-400 font-bold">{CURRENT_RESTAURANT.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Restaurant Info Bar */}
              <div className="bg-white px-6 py-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{CURRENT_RESTAURANT.hours}</span>
                    </div>
                    <span className="text-slate-900 font-bold">{CURRENT_RESTAURANT.price}</span>
                  </div>
                  {selectedRelation && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold"
                    >
                      <Heart className="w-3 h-3" />
                      {RELATIONS.find(r => r.id === selectedRelation)?.label}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Environment Gallery */}
              <div className="px-6 pt-5 pb-2">
                <h3 className="font-bold text-slate-900 mb-3">环境展示</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {CURRENT_RESTAURANT.gallery.map((img, idx) => (
                    <img 
                      key={idx}
                      src={img} 
                      alt={`环境 ${idx + 1}`} 
                      className="w-32 h-24 rounded-xl object-cover flex-shrink-0"
                    />
                  ))}
                </div>
              </div>

              {/* Package List Section */}
              <div className="px-6 pt-4 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-slate-900">
                    {relationTag ? '为你推荐的套餐' : '全部套餐'}
                  </h3>
                  <span className="text-xs text-slate-400">{filteredPackages.length}个套餐可选</span>
                </div>

                <div className="space-y-4">
                  {filteredPackages.map((pkg) => {
                    const discount = Math.round((pkg.price / pkg.originalPrice) * 10);
                    return (
                      <motion.div 
                        key={pkg.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setStep(3);
                        }}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer"
                      >
                        <div className="relative h-36">
                          <img 
                            src={pkg.image} 
                            alt={pkg.name} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                            {discount}折
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-slate-900 text-base mb-1">{pkg.name}</h4>
                          <p className="text-slate-400 text-xs line-clamp-1 mb-3">{pkg.desc}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-1">
                              <span className="text-orange-500 font-bold text-sm">¥</span>
                              <span className="text-orange-500 font-bold text-xl">{pkg.price}</span>
                              <span className="text-slate-300 text-xs line-through ml-2">¥{pkg.originalPrice}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-400 text-xs">
                              <span>查看详情</span>
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Relation Selection Overlay (appears on top of blurred restaurant page) */}
          <AnimatePresence>
            {showRelationOverlay && step === 2 && (
              <>
                {/* Semi-transparent backdrop */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[10000] bg-black/40"
                />
                
                {/* Relation Card */}
                <motion.div 
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '100%', opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="fixed inset-x-0 bottom-0 z-[10001] bg-white rounded-t-3xl shadow-2xl pb-safe"
                >
                  <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-2" />
                  
                  <div className="px-6 pt-2 pb-6">
                    {/* Header */}
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-slate-900 mb-1">今天和谁相见？</h2>
                      <p className="text-slate-400 text-sm">选择关系，为你推荐最合适的套餐</p>
                    </div>

                    {/* Relation Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {RELATIONS.map((item) => (
                        <motion.button
                          key={item.id}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleSelectRelation(item)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                            selectedRelation === item.id 
                              ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                              : 'border-slate-100 bg-white'
                          }`}
                        >
                          <div className={`w-12 h-12 ${item.bg} rounded-full flex items-center justify-center`}>
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                          </div>
                          <span className="font-bold text-slate-900 text-xs">{item.label}</span>
                          {selectedRelation === item.id && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    {/* Skip Button */}
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSkipRelation}
                      className="w-full py-4 bg-slate-100 text-slate-500 rounded-full font-bold text-base flex items-center justify-center gap-2"
                    >
                      <SkipForward className="w-4 h-4" />
                      跳过，直接看全部套餐
                    </motion.button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Step 3: Package Detail Page (Full Screen) */}
          {step === 3 && selectedPackage && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col bg-white overflow-y-auto pb-24"
            >
              {/* Hero Image */}
              <div className="relative h-72 bg-slate-200 shrink-0">
                <img 
                  src={selectedPackage.heroImage} 
                  alt={selectedPackage.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
                <button 
                  onClick={() => setStep(2)}
                  className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 px-6 py-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{selectedPackage.name}</h1>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-orange-500 font-bold text-2xl">¥{selectedPackage.price}</span>
                  <span className="text-slate-400 text-sm line-through">¥{selectedPackage.originalPrice}</span>
                  <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded ml-2">
                    {Math.round((selectedPackage.price / selectedPackage.originalPrice) * 10)}折
                  </span>
                </div>
                <p className="text-slate-500 text-sm mb-6">{selectedPackage.desc}</p>

                {/* Gallery */}
                {selectedPackage.gallery && selectedPackage.gallery.length > 0 && (
                  <section className="mb-6">
                    <h3 className="font-bold text-slate-900 mb-3">环境展示</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
                      {selectedPackage.gallery.map((img: string, idx: number) => (
                        <img 
                          key={idx}
                          src={img} 
                          alt={`环境 ${idx + 1}`}
                          className="w-40 h-28 rounded-xl object-cover shrink-0"
                        />
                      ))}
                    </div>
                  </section>
                )}

                <div className="space-y-6">
                  <section>
                    <h3 className="font-bold text-slate-900 mb-3">套餐内容</h3>
                    <div className="space-y-3 text-sm text-slate-600">
                      {selectedPackage.items.map((item: {name: string; qty: number}, idx: number) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.name}</span>
                          <span>x{item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="h-[1px] bg-slate-100"></div>

                  <section>
                    <h3 className="font-bold text-slate-900 mb-3">购买须知</h3>
                    <ul className="space-y-2 text-sm text-slate-500 list-disc pl-4">
                      {selectedPackage.notes.map((note: string, idx: number) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </section>

                  {/* Restaurant Info */}
                  <div className="h-[1px] bg-slate-100"></div>
                  <section>
                    <h3 className="font-bold text-slate-900 mb-3">商家信息</h3>
                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl">
                      <img 
                        src={CURRENT_RESTAURANT.image} 
                        alt={CURRENT_RESTAURANT.name} 
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{CURRENT_RESTAURANT.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{CURRENT_RESTAURANT.location}</span>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Bottom Bar - Select Package */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-20">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(4)}
                  className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-slate-200"
                >
                  选择此套餐 ¥{selectedPackage.price}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Payment Page (Method Selection) */}
          {step === 4 && selectedPackage && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-24"
            >
              <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 pt-12 pb-4 border-b border-slate-100 flex items-center gap-4">
                <button 
                  onClick={() => setStep(3)}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-900">支付订单</h1>
              </div>

              <div className="p-4 space-y-4">
                {/* Order Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="flex gap-4 mb-4">
                    <img 
                      src={selectedPackage.image} 
                      alt={selectedPackage.name} 
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 mb-1">{selectedPackage.name}</h4>
                      <p className="text-slate-500 text-xs mb-2">{CURRENT_RESTAURANT.name}</p>
                      <div className="text-orange-500 font-bold">¥{selectedPackage.price}</div>
                    </div>
                  </div>
                  <div className="border-t border-slate-50 pt-4 flex justify-between items-center">
                    <span className="text-slate-500 font-bold">合计</span>
                    <span className="text-3xl font-bold text-slate-900">¥{selectedPackage.price}.00</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4">选择支付方式</h3>
                  
                  <div className="space-y-3">
                    <div 
                      onClick={() => setPaymentMethod('wechat')}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'wechat' ? 'border-green-500 bg-green-50' : 'border-slate-100'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white">
                          <span className="font-bold text-sm">微</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">微信支付</span>
                          <span className="text-xs text-slate-400">推荐使用</span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'wechat' ? 'border-green-500 bg-green-500' : 'border-slate-300'}`}>
                        {paymentMethod === 'wechat' && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod('alipay')}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'alipay' ? 'border-blue-500 bg-blue-50' : 'border-slate-100'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                          <span className="font-bold text-sm">支</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">支付宝</span>
                          <span className="text-xs text-slate-400">花呗可用</span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'alipay' ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                        {paymentMethod === 'alipay' && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-20">
                <button 
                  onClick={() => setIsPaying(true)}
                  disabled={isPaying}
                  className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  {isPaying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      支付中...
                    </>
                  ) : (
                    `确认支付 ¥${selectedPackage.price}`
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Payment Password Overlay (Simulated) */}
          {isPaying && (
            <div className="fixed inset-0 z-[2002] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center">
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden"
              >
                <div className="relative border-b border-slate-100 p-4 text-center">
                  <button 
                    onClick={() => setIsPaying(false)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-1"
                  >
                    <X className="w-5 h-5 text-slate-900" />
                  </button>
                  <h3 className="font-bold text-slate-900 text-lg">请输入支付密码</h3>
                </div>
                <div className="p-8 flex flex-col items-center">
                  <div className="text-sm text-slate-500 mb-2">FIND ME 发现我</div>
                  <div className="text-3xl font-bold text-slate-900 mb-8">¥{selectedPackage?.price || 198}.00</div>
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

          {/* Step 5: Success Page */}
          {step === 5 && (
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
                  onClick={() => setStep(6)}
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

          {/* Step 6: Order Detail Page */}
          {step === 6 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-24"
            >
              <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 pt-12 pb-4 border-b border-slate-100 flex items-center gap-4">
                <button 
                  onClick={() => { setStep(1); setSelectedRelation(null); setRelationTag(null); }}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-900">订单详情</h1>
              </div>

              <div className="p-4 space-y-4">
                {/* QR Code Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{selectedPackage?.name || '初见·双人轻食套餐'}</h3>
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
                        src={CURRENT_RESTAURANT.image} 
                        alt="Restaurant" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{CURRENT_RESTAURANT.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3 h-3" />
                        {CURRENT_RESTAURANT.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">下单时间</span>
                      <span className="text-slate-900">{new Date().toLocaleString('zh-CN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">支付方式</span>
                      <span className="text-slate-900">{paymentMethod === 'wechat' ? '微信支付' : '支付宝'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">实付金额</span>
                      <span className="font-bold text-slate-900">¥{selectedPackage?.price || 198}.00</span>
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

      {/* Step 1: Scan Entry Page */}
      {step === 1 && (
        <div className="flex-1 flex flex-col bg-white relative h-full">
          {/* Global Back Button */}
          <button 
            onClick={() => onNavigate('encounter')}
            className="fixed top-12 left-6 w-10 h-10 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform z-[10000]"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>

          <div className="px-6 pt-24 pb-4">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">相见</h1>
            <p className="text-slate-400 text-sm">扫码进店，开启你的社交之旅</p>
          </div>

          {/* Restaurant Preview Card */}
          <div className="flex-1 px-6 overflow-y-auto pb-48">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 mb-6"
            >
              <div className="relative h-48">
                <img 
                  src={CURRENT_RESTAURANT.image} 
                  alt={CURRENT_RESTAURANT.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-bold text-lg">{CURRENT_RESTAURANT.name}</h3>
                  <div className="flex items-center gap-2 text-xs opacity-90 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{CURRENT_RESTAURANT.location}</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-orange-500">
                  <Star className="w-3 h-3 fill-current" />
                  {CURRENT_RESTAURANT.rating}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  {CURRENT_RESTAURANT.tags.map((tag, idx) => (
                    <span key={idx} className="bg-slate-50 text-slate-500 text-xs px-2 py-1 rounded-lg">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>{CURRENT_RESTAURANT.hours}</span>
                  </div>
                  <span className="text-slate-900 font-bold">{CURRENT_RESTAURANT.price}</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-indigo-50 rounded-xl p-3 text-center"
              >
                <Utensils className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                <span className="text-xs font-bold text-indigo-700">{RESTAURANT_PACKAGES.length}个套餐</span>
              </motion.div>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-orange-50 rounded-xl p-3 text-center"
              >
                <Star className="w-5 h-5 text-orange-500 mx-auto mb-1 fill-current" />
                <span className="text-xs font-bold text-orange-700">{CURRENT_RESTAURANT.rating}分好评</span>
              </motion.div>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-green-50 rounded-xl p-3 text-center"
              >
                <Users className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <span className="text-xs font-bold text-green-700">28人在附近</span>
              </motion.div>
            </div>
          </div>

          {/* Bottom Scan Card */}
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
                  onClick={handleScan}
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
