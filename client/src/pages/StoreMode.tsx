import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, ShoppingBag, Users, CheckCircle, Share2, Camera, ScanFace, Fingerprint, Wallet } from "lucide-react";
import { MOCK_STORE, RELATIONSHIP_OPTIONS, SCENARIO_ADVICE, STORE_PACKAGES } from "@/data/mockStoreData";
import StoreHeader from "@/components/StoreHeader";
import RelationshipModal from "@/components/RelationshipModal";
import { cn } from "@/lib/utils";

// Types for Flow State
type FlowStep = "entry" | "login" | "home" | "scenario" | "package" | "payment" | "success";

interface StoreModeProps {
  onExit: (shouldRedirectToMap?: boolean) => void; // Callback to return to main app, optionally redirecting to map
}

export default function StoreMode({ onExit }: StoreModeProps) {
  const [step, setStep] = useState<FlowStep>("entry");
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- 1. Entry / Scan Simulation ---
  const handleScan = () => {
    // Simulate checking login status
    if (isLoggedIn) {
      setStep("home");
    } else {
      setStep("login");
    }
  };

  // --- 2. Login Logic ---
  const handleLogin = () => {
    setIsLoggedIn(true);
    setStep("home");
  };

  // --- 3. Home Logic ---
  useEffect(() => {
    if (step === "home" && !selectedRelationship) {
      // Show modal after a short delay
      const timer = setTimeout(() => setShowRelationshipModal(true), 500);
      return () => clearTimeout(timer);
    }
  }, [step, selectedRelationship]);

  // --- 4. Payment Logic (Moved to top level) ---
  const [paymentState, setPaymentState] = useState<"idle" | "scanning" | "processing" | "success">("idle");
  
  useEffect(() => {
    if (step === "payment") {
      setPaymentState("scanning");
      
      // Sequence: Scanning (1.5s) -> Processing (1.5s) -> Success
      const scanTimer = setTimeout(() => {
        setPaymentState("processing");
        
        const processTimer = setTimeout(() => {
          setPaymentState("success");
          setTimeout(() => setStep("success"), 500);
        }, 1500);
        
        return () => clearTimeout(processTimer);
      }, 1500);
      
      return () => clearTimeout(scanTimer);
    } else {
      setPaymentState("idle");
    }
  }, [step]);

  const handleRelationshipSelect = (id: string) => {
    setSelectedRelationship(id);
    setShowRelationshipModal(false);
    setStep("scenario");
  };

  // --- Render Functions ---

  // 1. Entry Page (Simulation)
  if (step === "entry") {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6">
          <Camera className="w-10 h-10 text-slate-900" />
        </div>
        <h1 className="text-2xl font-bold mb-2">模拟扫码进店</h1>
        <p className="text-slate-400 text-center mb-8">
          点击下方按钮模拟扫描桌贴/台卡二维码<br/>进入 {MOCK_STORE.name}
        </p>
        <button 
          onClick={handleScan}
          className="w-full max-w-xs bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-full shadow-lg active:scale-95 transition-all"
        >
          模拟扫码 (scene=store)
        </button>
        <button onClick={() => onExit()} className="mt-6 text-slate-500 text-sm underline">
          返回主应用
        </button>
      </div>
    );
  }

  // 2. Login Page
  if (step === "login") {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col">
        <StoreHeader title="登录" onBack={() => setStep("entry")} />
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-2">欢迎来到 {MOCK_STORE.name}</h2>
          <p className="text-slate-500 mb-8">登录后可查看本店推荐套餐 + 相见玩法</p>
          
          <div className="space-y-4">
            <input type="tel" placeholder="请输入手机号" className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="flex gap-4">
              <input type="text" placeholder="验证码" className="flex-1 p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500" />
              <button className="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl">获取验证码</button>
            </div>
            <button 
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg mt-4 active:scale-95 transition-all"
            >
              登录并绑定门店
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Store Home (Transient state mostly, but renders structure)
  if (step === "home") {
    return (
      <div className="min-h-screen bg-slate-50">
        <StoreHeader title={MOCK_STORE.name} onBack={() => setStep("entry")} />
        <div className="p-4">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <p className="text-slate-500 mb-2">你正在</p>
            <h2 className="text-xl font-bold mb-4">{MOCK_STORE.name}</h2>
            <div className="flex justify-center gap-2 text-sm text-slate-400">
              <MapPin className="w-4 h-4" /> {MOCK_STORE.address}
            </div>
          </div>
        </div>
        <RelationshipModal isOpen={showRelationshipModal} onSelect={handleRelationshipSelect} />
      </div>
    );
  }

  // 4. Scenario Page
  if (step === "scenario") {
    const advice = SCENARIO_ADVICE[selectedRelationship as keyof typeof SCENARIO_ADVICE];
    const packages = STORE_PACKAGES.filter(p => p.suitableFor.includes(selectedRelationship!));
    const relLabel = RELATIONSHIP_OPTIONS.find(r => r.id === selectedRelationship)?.label;

    return (
      <div className="min-h-screen bg-slate-50 pb-20 overflow-y-auto h-screen">
        <StoreHeader title={`${relLabel} · 建议`} onBack={() => setStep("home")} />
        
        {/* Scenario Advice */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-800">{advice.title}</h3>
              <span className="text-xs font-bold px-2 py-1 bg-white rounded-full text-blue-600 border border-blue-200">
                {advice.duration}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-1 bg-blue-200 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-blue-500"></div>
              </div>
              <span className="text-sm font-bold text-slate-700">{advice.flow}</span>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">{advice.description}</p>
            <div className="flex flex-wrap gap-2">
              {advice.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 bg-white text-slate-500 rounded-md border border-slate-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Package List */}
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            推荐套餐
          </h3>
          <div className="space-y-4">
            {packages.map(pkg => (
              <div 
                key={pkg.id}
                onClick={() => { setSelectedPackage(pkg); setStep("package"); }}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 active:scale-[0.98] transition-transform"
              >
                <div className="h-32 bg-slate-200 relative">
                  <img src={pkg.image} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    {pkg.suitableFor.length > 1 ? "通用" : relLabel}专属
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900">{pkg.title}</h4>
                    <div className="text-right">
                      <span className="text-lg font-bold text-red-500">¥{pkg.price}</span>
                      <span className="text-xs text-slate-400 line-through ml-1">¥{pkg.originalPrice}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 bg-slate-50 p-2 rounded-lg">
                    💡 {pkg.recommendReason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 5. Package Detail Page
  if (step === "package" && selectedPackage) {
    return (
      <div className="min-h-screen bg-white pb-32 overflow-y-auto h-screen">
        <StoreHeader title="套餐详情" onBack={() => setStep("scenario")} />
        
        <div className="h-64 bg-slate-200 relative">
          <img src={selectedPackage.image} className="w-full h-full object-cover" />
        </div>
        
        <div className="p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{selectedPackage.title}</h1>
          <div className="flex items-end gap-2 mb-6">
            <span className="text-3xl font-bold text-red-600">¥{selectedPackage.price}</span>
            <span className="text-sm text-slate-400 line-through mb-1">原价 ¥{selectedPackage.originalPrice}</span>
            <span className="ml-auto px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
              FIND ME 专享价
            </span>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="font-bold text-slate-900 mb-3">套餐内容</h3>
              <ul className="space-y-2">
                {selectedPackage.items.map((item: string, i: number) => (
                  <li key={i} className="flex items-center justify-between text-sm text-slate-600 border-b border-slate-50 pb-2">
                    <span>{item.split(' x')[0]}</span>
                    <span className="font-medium">x{item.split(' x')[1]}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-slate-900 mb-3">使用规则</h3>
              <ul className="list-disc list-inside text-sm text-slate-500 space-y-1">
                {selectedPackage.rules.map((rule: string, i: number) => (
                  <li key={i}>{rule}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 flex items-center justify-between z-[9999] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">总计</span>
            <span className="text-xl font-bold text-red-600">¥{selectedPackage.price}</span>
          </div>
          <button 
            onClick={() => setStep("payment")}
            className="bg-blue-600 text-white font-bold px-8 py-3 rounded-full shadow-lg active:scale-95 transition-all"
          >
            立即下单
          </button>
        </div>
      </div>
    );
  }



  // 6. Payment (Simulated Cashier)
  if (step === "payment") {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-end pb-0 relative overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
        
        {/* Cashier Panel */}
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          className="w-full bg-white rounded-t-3xl p-6 z-10 relative pb-12"
        >
          <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
          
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
            <span className="text-slate-500 font-medium">订单金额</span>
            <span className="text-3xl font-bold text-slate-900">¥{selectedPackage?.price || "0.00"}</span>
          </div>

          <div className="flex flex-col items-center justify-center py-8 min-h-[200px]">
            <AnimatePresence mode="wait">
              {paymentState === "scanning" && (
                <motion.div 
                  key="scanning"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative w-24 h-24 mb-4">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-2 border-blue-100 rounded-full border-t-blue-500"
                    ></motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ScanFace className="w-10 h-10 text-blue-600" />
                    </div>
                    <motion.div 
                      animate={{ y: [0, 24, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-1/4 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    ></motion.div>
                  </div>
                  <p className="text-slate-600 font-medium">正在验证面容 ID...</p>
                </motion.div>
              )}

              {paymentState === "processing" && (
                <motion.div 
                  key="processing"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 relative">
                    <Wallet className="w-8 h-8 text-blue-600" />
                    <motion.div 
                      className="absolute -right-1 -top-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <CheckCircle className="w-3 h-3 text-white" />
                    </motion.div>
                  </div>
                  <p className="text-slate-600 font-medium">支付处理中...</p>
                </motion.div>
              )}

              {paymentState === "success" && (
                <motion.div 
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-200">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-slate-900 font-bold text-lg">支付成功</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mt-4">
            <Fingerprint className="w-4 h-4" />
            <span>安全支付保障中</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // 7. Success Page (Social Guide)
  if (step === "success") {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center pt-12 overflow-y-auto h-screen">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-200">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">支付成功</h2>
        <p className="text-slate-500 mb-8">核销码: <span className="font-mono font-bold text-slate-800">8392 1029</span></p>

        {/* Social Guide Card */}
        <div className="w-full bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-slate-900 mb-2">要不要看看...</h3>
            <p className="text-slate-600 mb-6">现在也在附近吃饭的人？说不定有惊喜哦！</p>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onExit(true)} // Pass true to redirect to map
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl active:scale-95 transition-all shadow-md shadow-blue-200"
              >
                <Users className="w-4 h-4" />
                看附近的人
              </button>
              <button className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 font-bold py-3 rounded-xl border border-blue-100 active:scale-95 transition-all">
                <Share2 className="w-4 h-4" />
                发相见动态
              </button>
            </div>
          </div>
        </div>

        <button onClick={() => onExit()} className="text-slate-400 text-sm mt-auto mb-8">
          返回首页
        </button>
      </div>
    );
  }

  return null;
}
