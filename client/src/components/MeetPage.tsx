import { useState } from "react";
import { ArrowLeft, Camera, Heart, Beer, Cake, Briefcase, Coffee, User, Users, Star, Scan, Check, Share2, ArrowRight, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MeetPageProps {
  onNavigate: (tab: string) => void;
}

// Step 1: Scenario Selection Data
const SCENARIOS_STEP1 = [
  { id: "date", icon: Heart, label: "约会", color: "text-pink-500", bg: "bg-pink-50" },
  { id: "bestie", icon: Camera, label: "闺蜜", color: "text-purple-500", bg: "bg-purple-50" },
  { id: "bro", icon: Beer, label: "兄弟", color: "text-blue-500", bg: "bg-blue-50", selected: true }, // Selected state
  { id: "birthday", icon: Cake, label: "生日", color: "text-red-500", bg: "bg-red-50" },
  { id: "business", icon: Briefcase, label: "商务", color: "text-slate-500", bg: "bg-slate-50" },
  { id: "hangout", icon: Coffee, label: "坐坐", color: "text-yellow-500", bg: "bg-yellow-50" },
  { id: "latenight", icon: Moon, label: "深夜", color: "text-indigo-500", bg: "bg-indigo-50" },
];

// Step 2: Relation Selection Data
const RELATIONS_STEP2 = [
  { id: "first_meet", icon: Star, label: "第一次见面", color: "text-pink-500", bg: "bg-pink-50" },
  { id: "couple", icon: Heart, label: "情侣/暧昧", color: "text-red-500", bg: "bg-red-50" },
  { id: "bestie", icon: Camera, label: "闺蜜", color: "text-purple-500", bg: "bg-purple-50" },
  { id: "bro", icon: Beer, label: "兄弟", color: "text-blue-500", bg: "bg-blue-50" },
  { id: "alone", icon: User, label: "独处时光", color: "text-slate-500", bg: "bg-slate-50" },
  { id: "family", icon: Users, label: "阖家团圆", color: "text-orange-500", bg: "bg-orange-50" },
];

export default function MeetPage({ onNavigate }: MeetPageProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const handleScenarioClick = () => {
    setStep(2);
  };

  const handleRelationClick = () => {
    setStep(3);
    // Simulate payment process
    setTimeout(() => {
      setStep(4);
    }, 2500);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    } else {
      // If at step 1, maybe go back to home or do nothing (since it's a tab)
    }
  };

  // Step 4: Success Page
  if (step === 4) {
    return (
      <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
        <div className="flex-1 p-6 flex flex-col items-center pt-20">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          
          <h2 className="text-3xl font-light text-slate-800 mb-2">支付</h2>
          <h2 className="text-3xl font-light text-slate-800 mb-12">已完成</h2>
          
          <p className="text-slate-400 text-sm mb-6">请向店员出示核销码</p>
          
          <div className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-xs aspect-square flex items-center justify-center mb-8 relative overflow-hidden">
            {/* QR Code Simulation */}
            <div className="w-full h-full bg-slate-900 rounded-3xl flex items-center justify-center relative p-6">
                <div className="absolute top-6 left-6 w-16 h-16 border-[6px] border-white rounded-2xl"></div>
                <div className="absolute top-6 right-6 w-16 h-16 border-[6px] border-white rounded-2xl"></div>
                <div className="absolute bottom-6 left-6 w-16 h-16 border-[6px] border-white rounded-2xl"></div>
                
                {/* Random dots for QR code content */}
                <div className="grid grid-cols-6 gap-1.5 w-full h-full p-2">
                    {[...Array(36)].map((_, i) => (
                        <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'}`}></div>
                    ))}
                </div>
                
                {/* Center logo/icon placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg"></div>
                    </div>
                </div>
            </div>
          </div>
          
          <p className="text-2xl font-mono tracking-widest text-slate-800 mb-12">8392 1029</p>
          
          <div className="w-full space-y-4">
            <button 
              onClick={() => onNavigate('encounter')}
              className="w-full bg-slate-900 text-white py-4 rounded-full text-lg font-medium flex items-center justify-between px-8 shadow-lg shadow-slate-200"
            >
              <span>去偶遇</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button className="w-full bg-white text-slate-600 py-4 rounded-full text-lg font-medium flex items-center justify-between px-8 border border-slate-100 shadow-sm">
              <span>打发你的等待时间</span>
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          
          <button 
            onClick={() => setStep(1)}
            className="mt-8 text-slate-300 text-sm"
          >
            返回相见
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-40 flex flex-col overflow-hidden">
      
      {/* Step 1: Scenario Selection */}
      {step === 1 && (
        <>
          <div className="px-6 pt-12 pb-4">
            <button className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm mb-6">
                <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">选择相见场景</h1>
            <p className="text-slate-400 text-sm">选择一个场景，开启你的社交之旅</p>
          </div>

          <div className="flex-1 px-6 overflow-y-auto pb-40">
            <div className="grid grid-cols-2 gap-4">
              {SCENARIOS_STEP1.map((scenario) => (
                <motion.button
                  key={scenario.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleScenarioClick}
                  className={`
                    ${scenario.bg} p-6 rounded-[2rem] flex flex-col items-start justify-between aspect-[4/3] relative
                    ${scenario.selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                  `}
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <scenario.icon className={`w-5 h-5 ${scenario.color}`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{scenario.label}</h3>
                    <p className="text-xs text-slate-400">点击进入</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Bottom Scan Card */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent pt-12">
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-200">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold mb-1">扫码进店</h3>
                        <p className="text-slate-400 text-sm">已在店内？直接扫码</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                        <Camera className="w-5 h-5 text-slate-300" />
                    </div>
                </div>
                <button 
                    onClick={handleScenarioClick}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                >
                    <Scan className="w-5 h-5" />
                    开启扫码
                </button>
            </div>
          </div>
        </>
      )}

      {/* Step 2: Venue & Relation Selection */}
      {step >= 2 && step < 4 && (
        <>
            {/* Header Image */}
            <div className="relative h-64 w-full shrink-0">
                <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" 
                alt="Restaurant" 
                className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
                
                {/* Back Button */}
                <button 
                    onClick={handleBack}
                    className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="absolute top-12 left-20 text-white">
                    <p className="text-sm font-light mb-1 opacity-80">当前位置</p>
                    <h2 className="text-2xl font-medium tracking-wide">花田错·创意餐厅</h2>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white -mt-8 rounded-t-[2rem] relative z-10 px-6 pt-10 pb-12 overflow-y-auto">
                <h3 className="text-2xl text-slate-800 font-serif mb-10 text-center">今天和谁相见</h3>
                
                <div className="grid grid-cols-2 gap-4">
                {RELATIONS_STEP2.map((relation) => (
                    <motion.button
                    key={relation.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRelationClick}
                    className={`${relation.bg} p-6 rounded-[2rem] flex flex-col items-center justify-center gap-4 aspect-[4/3]`}
                    >
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <relation.icon className={`w-7 h-7 ${relation.color}`} />
                    </div>
                    <span className="text-slate-700 font-medium">{relation.label}</span>
                    </motion.button>
                ))}
                </div>
                
                <div className="mt-12 text-center">
                    <button className="text-slate-300 text-sm">暂不进店</button>
                </div>
            </div>
        </>
      )}

      {/* Step 3: Payment Modal */}
      <AnimatePresence>
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-end justify-center"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full rounded-t-[2rem] p-8 pb-12"
            >
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-8"></div>
                
                <div className="flex justify-between items-center mb-12">
                    <span className="text-slate-500 text-lg">订单金额</span>
                    <span className="text-4xl font-bold text-slate-900">¥198</span>
                </div>

                <div className="flex flex-col items-center justify-center py-8">
                    <div className="relative w-24 h-24 mb-6">
                        <div className="absolute inset-0 border-2 border-blue-100 rounded-full"></div>
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-t-2 border-blue-500 rounded-full"
                        ></motion.div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 border-2 border-blue-500 rounded-lg flex items-center justify-center relative overflow-hidden">
                                {/* Face ID Icon Simulation */}
                                <div className="w-8 h-8 border-2 border-blue-500 rounded-md relative">
                                    <div className="absolute top-2 left-2 w-1 h-1 bg-blue-500 rounded-full"></div>
                                    <div className="absolute top-2 right-2 w-1 h-1 bg-blue-500 rounded-full"></div>
                                    <div className="absolute bottom-2 left-2 w-4 h-2 border-b-2 border-blue-500 rounded-full"></div>
                                </div>
                                {/* Scanning Line */}
                                <motion.div 
                                    animate={{ top: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                                ></motion.div>
                            </div>
                        </div>
                    </div>
                    <p className="text-slate-600 text-lg">正在验证面容 ID...</p>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mt-4">
                    <div className="w-4 h-4 border border-slate-300 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    </div>
                    安全支付保障中
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
