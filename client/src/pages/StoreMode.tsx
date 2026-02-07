import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, ShoppingBag, Users, CheckCircle, Share2, Camera, ScanFace, Fingerprint, Wallet, QrCode } from "lucide-react";
import { MOCK_STORE, RELATIONSHIP_OPTIONS, SCENARIO_ADVICE, STORE_PACKAGES } from "@/data/mockStoreData";
import StoreHeader from "@/components/StoreHeader";
import RelationshipModal from "@/components/RelationshipModal";
import { cn } from "@/lib/utils";

// Types for Flow State
type FlowStep = "entry" | "login" | "home" | "scenario" | "package" | "payment" | "success";

interface StoreModeProps {
  onExit: (targetTab?: string) => void; // Callback to return to main app, optionally redirecting to a specific tab
}

export default function StoreMode({ onExit }: StoreModeProps) {
  const [step, setStep] = useState<FlowStep>("home");
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);





  // --- 4. Payment Logic (Moved to top level) ---
  const [paymentState, setPaymentState] = useState<"idle" | "scanning" | "processing" | "success">("idle");
  const [isUnfoldingMap, setIsUnfoldingMap] = useState(false);

  const handleGoEncounter = () => {
    setIsUnfoldingMap(true);
    setTimeout(() => {
      onExit("encounter");
    }, 1500); // Wait for animation to complete
  };
  
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





  // 3. Store Home (Blurred Background + Overlay Card)
  if (step === "home") {
    return (
      <div className="min-h-screen bg-slate-50 font-serif relative overflow-hidden">
        {/* Background Layer (Blurred Store Content) */}
        <div className="absolute inset-0 filter blur-sm scale-105 pointer-events-none z-0">
          <StoreHeader title={MOCK_STORE.name} onBack={() => {}} />
          <div className="p-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-10 text-center border border-slate-100">
              <p className="text-slate-400 text-sm mb-3 tracking-widest">你正在</p>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{MOCK_STORE.name}</h2>
              <div className="flex justify-center items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-3 h-3" /> 
                <span>{MOCK_STORE.address}</span>
              </div>
            </div>
            {/* Mock Content to fill background */}
            <div className="space-y-4 opacity-50">
              <div className="h-40 bg-slate-200 rounded-2xl"></div>
              <div className="h-40 bg-slate-200 rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Overlay Layer (Relationship Selection Card) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-black/10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/50 backdrop-blur-xl"
          >
            {/* Store Context Image Header */}
            <div className="h-32 bg-slate-100 relative">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-90"
                alt="Store Context"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div>
                  <p className="text-white/80 text-xs tracking-widest mb-1">当前位置</p>
                  <h3 className="text-white font-bold text-lg">{MOCK_STORE.name}</h3>
                </div>
              </div>
            </div>

            <div className="p-8 h-full flex flex-col">
              <div className="text-center mb-6 flex-shrink-0">
                <h3 className="text-2xl font-bold text-slate-900">今天和谁相见</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 overflow-y-auto no-scrollbar flex-1 pb-4">
                {RELATIONSHIP_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleRelationshipSelect(option.id)}
                    className={cn(
                      "p-4 rounded-2xl border active:scale-95 transition-all flex flex-col items-center gap-3 group shadow-sm",
                      option.bg,
                      "border-transparent hover:border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-md bg-white",
                      option.color
                    )}>
                      <option.icon className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <span className={cn("text-sm font-bold group-hover:text-slate-900", option.color.replace('text-', 'text-slate-700/80 '))}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <button onClick={() => onExit()} className="text-slate-400 text-xs hover:text-slate-600 transition-colors font-medium">
                  暂不进店
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // 4. Scenario Page
  if (step === "scenario") {
    const advice = SCENARIO_ADVICE[selectedRelationship as keyof typeof SCENARIO_ADVICE];
    const packages = STORE_PACKAGES.filter(p => p.suitableFor.includes(selectedRelationship!)).slice(0, 3);
    const relLabel = RELATIONSHIP_OPTIONS.find(r => r.id === selectedRelationship)?.label;

    return (
      <div className="min-h-screen bg-slate-50 pb-20 overflow-y-auto h-screen font-serif">
        <StoreHeader title={`${relLabel} · 建议`} onBack={() => setStep("home")} />
        
        {/* Scenario Advice */}
        <div className="p-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-10 border border-slate-100">
            <div className="space-y-4 mb-10">
              <h3 className="text-3xl font-bold text-slate-900 whitespace-pre-line leading-tight">{advice.title}</h3>
              <p className="text-slate-400 text-sm whitespace-pre-line leading-relaxed">{advice.duration}</p>
            </div>
            
            <div className="space-y-6 text-slate-600 text-lg leading-loose mb-10">
              <p className="whitespace-pre-line">{advice.description}</p>
              <div className="pt-4 border-t border-slate-50">
                <p className="text-slate-400 text-xs mb-2">建议流程</p>
                <p className="text-slate-800 whitespace-pre-line font-medium">{advice.flow}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {advice.tags.map(tag => (
                <span key={tag} className="text-xs px-3 py-1.5 bg-slate-50 text-slate-500 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Package List */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">精选</h3>
            <div className="space-y-6">
              {packages.map(pkg => (
                <div 
                  key={pkg.id}
                  onClick={() => { setSelectedPackage(pkg); setStep("package"); }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 active:scale-[0.98] transition-transform group"
                >
                  <div className="h-48 bg-slate-200 relative overflow-hidden">
                    <img src={pkg.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-900 text-xs px-3 py-1.5 rounded-full font-medium">
                      {pkg.suitableFor.length > 1 ? "通用" : relLabel}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-bold text-slate-900 whitespace-pre-line">{pkg.title}</h4>
                      <div className="text-right">
                        <span className="text-lg font-bold text-slate-900">{pkg.price}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">
                      {pkg.recommendReason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Package Detail Page
  if (step === "package" && selectedPackage) {
    return (
      <div className="min-h-screen bg-white pb-32 overflow-y-auto h-screen font-serif">
        <StoreHeader title="详情" onBack={() => setStep("scenario")} />
        
        <div className="h-80 bg-slate-200 relative">
          <img src={selectedPackage.image} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">{selectedPackage.title}</h1>
            <p className="text-white/80 text-lg">{selectedPackage.price}</p>
          </div>
        </div>
        
        <div className="p-8 space-y-12">
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6">包含</h3>
            <ul className="space-y-4">
              {selectedPackage.items.map((item: string, i: number) => (
                <li key={i} className="flex items-center justify-between text-slate-600 border-b border-slate-50 pb-4 last:border-0">
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6">须知</h3>
            <div className="space-y-3 text-slate-500">
              {selectedPackage.rules.map((rule: string, i: number) => (
                <p key={i}>{rule}</p>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 flex items-center justify-between z-[9999]">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 mb-1">总计</span>
            <span className="text-2xl font-bold text-slate-900">{selectedPackage.price}</span>
          </div>
          <button 
            onClick={() => setStep("payment")}
            className="bg-slate-900 text-white font-bold px-10 py-4 rounded-xl shadow-lg active:scale-95 transition-all tracking-widest"
          >
            下单
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

  // 7. Success Page (Social Guid  // 7. Success Page (Social Guide)
  if (step === "success") {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-start pt-20 overflow-y-auto h-screen font-serif">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-green-200">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          
          <div className="space-y-2 mb-12">
            <h2 className="text-3xl font-bold text-slate-900">支付</h2>
            <h2 className="text-3xl font-bold text-slate-900">已完成</h2>
          </div>

          <div className="mb-16 space-y-4">
            <p className="text-slate-400 text-sm">请向店员出示核销码</p>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 inline-block">
              <QrCode className="w-32 h-32 text-slate-900" />
            </div>
            <p className="font-mono text-xl text-slate-800 tracking-widest mt-2">8392 1029</p>
          </div>

          {/* Social Guide Card */}
          <div className="w-full relative overflow-hidden mb-12">
            <div className="relative z-10 space-y-6">
              <div className="space-y-3 text-slate-600 text-lg leading-relaxed">
                <p>此刻</p>
                <p>附近</p>
                <p>有趣的灵魂</p>
                <p>正在游荡</p>
              </div>
              
              <div className="flex flex-col gap-4 pt-4">
                <button 
                  onClick={handleGoEncounter}
                  className="w-full flex items-center justify-between bg-slate-900 text-white p-5 rounded-xl active:scale-95 transition-all shadow-lg group relative overflow-hidden"
                >
                  <span className="font-bold tracking-widest text-lg relative z-10">去偶遇</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                  
                  {/* Map Unfold Animation Overlay */}
                  <AnimatePresence>
                    {isUnfoldingMap && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0, borderRadius: "100%" }}
                        animate={{ scale: 30, opacity: 1, borderRadius: "0%" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 bg-blue-500 z-20 flex items-center justify-center origin-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')", backgroundSize: "cover", backgroundBlendMode: "multiply" }}
                      >
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
                <button 
                  onClick={() => onExit("moments")}
                  className="w-full flex items-center justify-between bg-white text-slate-600 p-5 rounded-xl border border-slate-200 active:scale-95 transition-all group"
                >
                  <span className="font-bold tracking-widest text-lg">打发你的等待时间</span>
                  <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          <button onClick={() => onExit()} className="text-slate-400 text-sm mt-auto mb-8 hover:text-slate-600 transition-colors">
            返回相见
          </button>
        </motion.div>
      </div>
    );
  }

  return null;
}
