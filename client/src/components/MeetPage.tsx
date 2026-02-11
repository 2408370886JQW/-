import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronRight
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
  // 1: Scenario Selection
  // 2: Relation Selection
  // 3: Suggestion Page (New)
  // 4: Detail Page (New)
  // 5: Payment Verification
  // 6: Success Page
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isScanning, setIsScanning] = useState(false);

  // Simulate Face ID scan
  useEffect(() => {
    if (step === 5) {
      const timer = setTimeout(() => {
        setStep(6);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5 | 6);
    } else {
      onNavigate('encounter');
    }
  };

  // Step 6: Success Page
  if (step === 6) {
    return (
      <div className="fixed inset-0 bg-white z-[2000] flex flex-col">
        {/* Header */}
        <div className="px-6 pt-12 pb-4 flex justify-between items-center">
          <button onClick={() => onNavigate('encounter')} className="p-2 -ml-2">
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
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-200">
              <Check className="w-8 h-8 text-white stroke-[3]" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">支付</h1>
            <h1 className="text-3xl font-bold text-slate-900">已完成</h1>
          </div>

          <p className="text-slate-400 text-sm mb-6">请向店员出示核销码</p>

          {/* QR Code Card */}
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] mb-8 flex flex-col items-center">
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
          </div>

          {/* Status List */}
          <div className="space-y-4 mb-8">
            {['此刻', '附近', '有趣的灵魂', '正在游荡'].map((item) => (
              <div key={item} className="text-slate-600 font-medium">
                {item}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-auto pb-8 space-y-4">
            <button 
              onClick={() => onNavigate('encounter')}
              className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-slate-200 flex items-center justify-between px-8"
            >
              <span>去偶遇</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>
            
            <button className="w-full bg-white text-slate-900 border border-slate-100 py-4 rounded-full font-bold text-lg shadow-sm flex items-center justify-between px-8">
              <span>打发你的等待时间</span>
              <Share2 className="w-5 h-5 text-slate-400" />
            </button>

            <div className="text-center pt-2">
              <button onClick={() => setStep(1)} className="text-slate-400 text-sm">
                返回相见
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-white flex flex-col overflow-hidden">
      {/* Step 5: Payment Overlay */}
      <AnimatePresence>
        {step === 5 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2002] bg-black/60 backdrop-blur-sm flex items-end justify-center"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-y-auto bg-slate-50 no-scrollbar">
        
        {/* Step 1: Scenario Selection */}
        {step === 1 && (
          <>
            <div className="px-6 pt-12 pb-4 bg-white">
              <button 
                onClick={handleBack}
                className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm mb-6 active:scale-95 transition-transform"
              >
                  <ArrowLeft className="w-5 h-5 text-slate-700" />
              </button>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">选择相见场景</h1>
              <p className="text-slate-400 text-sm">选择一个场景，开启你的社交之旅</p>
            </div>

            {/* Scrollable Content with HUGE padding bottom to clear Scan Card + Tab Bar */}
            <div className="flex-1 px-6 pb-96 bg-white">
              <div className="grid grid-cols-2 gap-4">
                {SCENARIOS_STEP1.map((scenario) => (
                  <motion.button
                    key={scenario.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    className={`
                      ${scenario.bg} p-5 rounded-[2rem] flex flex-col items-start justify-between aspect-[1.1] relative
                      ${scenario.selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                    `}
                  >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                      <scenario.icon className={`w-5 h-5 ${scenario.color}`} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-slate-900 mb-0.5">{scenario.label}</h3>
                      <p className="text-xs text-slate-400">点击进入</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Bottom Scan Card - Fixed Position ABOVE Tab Bar */}
            {/* Tab Bar is approx 80px high. We position this card at bottom-24 (96px) to sit above it. */}
            <div className="fixed bottom-24 left-0 right-0 px-4 pointer-events-none">
              <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-200 pointer-events-auto">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">扫码进店</h3>
                    <p className="text-slate-400 text-sm">已在店内？直接扫码</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                  <Camera className="w-5 h-5" />
                  开启扫码
                </button>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Relation Selection */}
        {step === 2 && (
          <div className="fixed inset-0 z-[2000] bg-white flex flex-col">
            {/* Header Image */}
            <div className="h-64 relative">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" 
                alt="Restaurant" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute top-0 left-0 right-0 p-6 pt-12 flex justify-between items-start">
                <button 
                  onClick={handleBack}
                  className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xs opacity-80 mb-1">当前位置</p>
                <h2 className="text-2xl font-bold">花田错·创意餐厅</h2>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white rounded-t-[2rem] -mt-6 relative z-10 px-6 pt-8 pb-12 overflow-y-auto">
              <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">今天和谁相见</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {RELATIONS_STEP2.map((relation) => (
                  <motion.button
                    key={relation.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(3)}
                    className={`${relation.bg} p-6 rounded-[2rem] flex flex-col items-center justify-center aspect-[1.3]`}
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                      <relation.icon className={`w-6 h-6 ${relation.color}`} />
                    </div>
                    <span className="text-slate-900 font-medium text-sm">{relation.label}</span>
                  </motion.button>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <button className="text-slate-400 text-sm">暂不进店</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Suggestion Page */}
        {step === 3 && (
          <div className="fixed inset-0 z-[2000] bg-slate-50 flex flex-col overflow-y-auto no-scrollbar">
            <div className="px-6 pt-12 pb-4 flex items-center gap-4">
              <button onClick={handleBack} className="p-2 -ml-2">
                <ArrowLeft className="w-6 h-6 text-slate-900" />
              </button>
              <h1 className="text-lg font-bold text-slate-900">第一次见面·建议</h1>
            </div>

            <div className="flex-1 px-6 overflow-y-auto pb-32">
              {/* Suggestion Card */}
              <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">初次<br/>相见建议</h2>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-8">
                  <span>六十至九十分钟</span>
                  <span>刚刚好</span>
                </div>

                <div className="space-y-4 text-slate-600 font-medium text-lg mb-10">
                  <p>初次见面不宜过长</p>
                  <p>先喝点东西缓解紧张</p>
                  <p>聊得来再吃饭</p>
                  <p>进退自如</p>
                </div>

                <div className="mb-8">
                  <p className="text-xs text-slate-400 mb-4">建议流程</p>
                  <div className="space-y-2 text-xl font-bold text-slate-900">
                    <div>饮品</div>
                    <div>正餐</div>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {['#不尴尬', '#稳妥', '#不翻车'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selection Section */}
              <h3 className="text-lg font-bold text-slate-900 mb-4">精选</h3>
              <div 
                onClick={() => setStep(4)}
                className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 active:scale-98 transition-transform"
              >
                <div className="h-48 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80" 
                    alt="Dining" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">
                    通用
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">初见</h4>
                      <h4 className="text-xl font-bold text-slate-900">双人轻食</h4>
                    </div>
                    <span className="text-xl font-bold text-slate-900">198</span>
                  </div>
                  <div className="text-slate-500 text-sm space-y-1">
                    <p>分量适中吃相优雅</p>
                    <p>包含两杯特调饮品</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Detail Page */}
        {step === 4 && (
          <div className="fixed inset-0 z-[2000] bg-white flex flex-col overflow-hidden">   {/* Header Image */}
            <div className="h-72 relative">
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80" 
                alt="Dining" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute top-0 left-0 right-0 p-6 pt-12 flex justify-between items-center">
                <button 
                  onClick={handleBack}
                  className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <span className="text-white font-bold">详情</span>
                <div className="w-10"></div>
              </div>
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-3xl font-bold mb-1">初见 双人轻食</h2>
                <p className="text-2xl font-bold">198</p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-8 overflow-y-auto">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">包含</h3>
                <div className="space-y-6">
                  {['牛油果大虾沙拉', '黑松露奶油意面', '特调无酒精鸡尾酒', '提拉米苏'].map((item) => (
                    <div key={item} className="text-slate-600 border-b border-slate-50 pb-4 last:border-0">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">须知</h3>
                <div className="space-y-4 text-slate-500">
                  <p>随时退</p>
                  <p>免预约</p>
                  <p>仅限堂食</p>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-white border-t border-slate-100 p-4 pb-8 flex items-center justify-between px-8 z-[2001] shrink-0">
              <div>
                <span className="text-xs text-slate-400 block">总计</span>
                <span className="text-2xl font-bold text-slate-900">198</span>
              </div>
              <button 
                onClick={() => setStep(5)}
                className="bg-slate-900 text-white px-12 py-3 rounded-full font-bold shadow-lg shadow-slate-200 active:scale-95 transition-transform"
              >
                下单
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
