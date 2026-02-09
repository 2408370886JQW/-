import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, ShoppingBag, Users, CheckCircle, Share2, Camera, ScanFace, Fingerprint, Wallet, QrCode, Heart, Beer, Cake, Briefcase, Coffee, Moon, MessageCircle } from "lucide-react";
import { MOCK_STORE, RELATIONSHIP_OPTIONS, SCENARIO_ADVICE, STORE_PACKAGES } from "@/data/mockStoreData";
import StoreHeader from "@/components/StoreHeader";
import RelationshipModal from "@/components/RelationshipModal";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

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
          setTimeout(() => {
            setStep("success");
            // Trigger confetti when entering success state
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
            });
          }, 500);
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
            <h3 className="text-lg font-bold text-slate-900 mb-4">套餐内容</h3>
            <div className="space-y-4">
              {selectedPackage.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                  <span className="text-slate-600">{item.name}</span>
                  <span className="font-medium text-slate-900">x{item.count}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-4">使用须知</h3>
            <ul className="space-y-3 text-slate-500 text-sm leading-relaxed list-disc pl-4">
              <li>请提前1天预约</li>
              <li>仅限堂食，不可打包</li>
              <li>如需发票请咨询商家</li>
            </ul>
          </section>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 pb-safe">
          <button 
            onClick={() => setStep("payment")}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
            style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
          >
            <Wallet className="w-5 h-5" />
            立即支付 {selectedPackage.price}
          </button>
        </div>
      </div>
    );
  }

  // 6. Payment & Success (Restored to original style)
  if (step === "payment" || step === "success") {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-8 relative overflow-hidden font-serif">
        <AnimatePresence mode="wait">
          {step === "payment" ? (
            <motion.div 
              key="payment"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="relative z-10 w-full max-w-sm text-center"
            >
              <div className="mb-12 relative">
                <div className="w-48 h-48 mx-auto bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 relative overflow-hidden shadow-inner">
                  {paymentState === "scanning" && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent"
                      animate={{ y: ["-100%", "100%"] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                  )}
                  {paymentState === "processing" ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <ScanFace className="w-16 h-16 text-blue-500" strokeWidth={1.5} />
                    </motion.div>
                  ) : (
                    <QrCode className="w-20 h-20 text-slate-300" strokeWidth={1} />
                  )}
                </div>
                <div className="mt-8 space-y-3">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {paymentState === "scanning" ? "正在识别..." : "支付处理中..."}
                  </h2>
                  <p className="text-slate-400 text-sm">请保持手机靠近感应区</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 w-full max-w-sm text-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-24 h-24 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={2} />
              </motion.div>
              
              <h2 className="text-3xl font-bold mb-2 text-slate-900">缘分已在路上</h2>
              
              {/* QR Code Section */}
              <div className="my-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 inline-block shadow-sm">
                <QrCode className="w-32 h-32 text-slate-800 mx-auto" strokeWidth={1} />
                <p className="text-xs text-slate-400 mt-3 font-mono tracking-widest">NO.839201</p>
              </div>

              <p className="text-slate-500 mb-10 text-sm leading-relaxed max-w-[260px] mx-auto">
                凭此码到店消费<br/>
                此刻，也许正有人在附近的动态里等你...
              </p>

              <div className="space-y-3">
                <button 
                  onClick={handleGoEncounter}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  去偶遇吧
                </button>
                <button 
                  onClick={() => onExit("moments")}
                  className="w-full py-4 bg-white text-slate-600 rounded-2xl font-bold text-lg active:scale-95 transition-transform border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  看看大家都在干嘛
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Unfolding Animation Overlay */}
        <AnimatePresence>
          {isUnfoldingMap && (
            <motion.div
              initial={{ clipPath: "circle(0% at 50% 50%)" }}
              animate={{ clipPath: "circle(150% at 50% 50%)" }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 bg-slate-50"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full animate-ping mx-auto mb-4 opacity-20"></div>
                  <p className="text-slate-400 font-medium tracking-widest">正在定位附近的人...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return null;
}
