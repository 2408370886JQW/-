import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, QrCode, Users, MapPin, Camera, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function StorePaymentSuccessPage() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const shopId = params.get("shop_id");

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      {/* Success Header */}
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">支付成功</h1>
        <p className="text-slate-500">感谢您的购买，祝您用餐愉快</p>
      </div>

      {/* Order Info & QR Code */}
      <Card className="border-none shadow-sm mb-6 overflow-hidden">
        <div className="bg-slate-900 p-6 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-sm text-slate-400 mb-1">核销码</div>
            <div className="text-3xl font-mono font-bold tracking-widest mb-4">8920 4491</div>
            <div className="w-40 h-40 bg-white p-2 mx-auto rounded-xl">
              <QrCode className="w-full h-full text-slate-900" />
            </div>
            <p className="text-xs text-slate-400 mt-4">请向店员出示此码核销</p>
          </div>
          {/* Decorative circles */}
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        </div>
        <div className="p-4 bg-white border-t border-slate-100 border-dashed">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-500">商品名称</span>
            <span className="text-slate-900 font-medium">初见·双人轻食套餐</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">实付金额</span>
            <span className="text-slate-900 font-bold">¥198.00</span>
          </div>
        </div>
      </Card>

      {/* Social Guide Card (Core Feature) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-none shadow-lg bg-gradient-to-br from-[#FF4D00] to-[#FF8534] text-white overflow-hidden relative">
          <div className="p-6 relative z-10">
            <h2 className="text-xl font-bold mb-2">等待上菜的时候...</h2>
            <p className="text-white/90 text-sm mb-6">要不要看看现在也在附近吃饭的人？说不定有惊喜哦！</p>
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-white text-[#FF4D00] hover:bg-white/90 font-bold h-12 rounded-xl justify-between px-4 group"
                onClick={() => setLocation("/meet")}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>看看附近的人</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 rounded-xl border-0"
                  onClick={() => setLocation("/publish")}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  发条动态
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 rounded-xl border-0"
                  onClick={() => setLocation("/")}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  进入地图
                </Button>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl -ml-10 -mb-10" />
        </Card>
      </motion.div>
    </div>
  );
}
