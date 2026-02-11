import { Button } from "@/components/ui/button";
import { QrCode, Scan } from "lucide-react";
import { useLocation } from "wouter";

export default function ScanSimulationPage() {
  const [, setLocation] = useLocation();

  const handleScan = () => {
    // Simulate scanning a QR code with shop_id=123 and scene=store
    // Redirect to login page with these parameters
    setLocation("/store/login?shop_id=123&scene=store");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-md space-y-12 text-center">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-xl border border-white/20">
            <QrCode className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">模拟扫码入口</h1>
          <p className="text-slate-400">
            点击下方按钮模拟扫描桌贴二维码<br />
            进入到店转化流程
          </p>
        </div>

        <div className="relative w-64 h-64 mx-auto border-2 border-[#FF4D00] rounded-3xl flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="absolute inset-0 border-2 border-[#FF4D00] rounded-3xl animate-pulse opacity-50"></div>
          <Scan className="w-32 h-32 text-[#FF4D00] opacity-80" />
          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#FF4D00] -mt-1 -ml-1"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#FF4D00] -mt-1 -mr-1"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#FF4D00] -mb-1 -ml-1"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#FF4D00] -mb-1 -mr-1"></div>
        </div>

        <Button 
          size="lg" 
          className="w-full bg-[#FF4D00] hover:bg-[#FF4D00]/90 text-white font-bold text-lg h-14 rounded-2xl shadow-lg shadow-orange-500/20"
          onClick={handleScan}
        >
          模拟扫码进店
        </Button>
        
        <p className="text-xs text-slate-500">
          参数: shop_id=123, scene=store
        </p>
      </div>
    </div>
  );
}
