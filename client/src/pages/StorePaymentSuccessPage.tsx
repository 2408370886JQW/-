import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, MapPin, Users, Camera, ArrowRight, QrCode } from "lucide-react";
import Layout from "@/components/Layout";

export default function StorePaymentSuccessPage() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const sid = params.get("shop_id");
    if (sid) setShopId(sid);
  }, [search]);

  return (
    <Layout showNav={false}>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Success Header */}
        <div className="bg-white p-8 flex flex-col items-center text-center pt-12 pb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">支付成功</h1>
          <p className="text-slate-500">感谢您的购买，祝您用餐愉快</p>
        </div>

        <div className="p-4 space-y-6 flex-1">
          {/* Order Info & QR Code */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 border-b border-slate-100 border-dashed">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-500">订单编号</span>
                  <span className="font-mono text-slate-900">202402048888</span>
                </div>
                <div className="flex justify-center py-4">
                  <div className="bg-slate-100 p-4 rounded-xl">
                    <QrCode className="w-32 h-32 text-slate-900" />
                  </div>
                </div>
                <p className="text-center text-xs text-slate-400 mt-2">请向店员出示此码核销</p>
              </div>
            </CardContent>
          </Card>

          {/* Social Redirection Card (Core Feature) */}
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white overflow-hidden relative">
            <CardContent className="p-6 relative z-10">
              <h2 className="text-xl font-bold mb-2">等待上菜的时候...</h2>
              <p className="text-blue-100 text-sm mb-6">要不要看看现在也在附近吃饭的人？</p>
              
              <div className="space-y-3">
                <Button 
                  className="w-full h-12 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl border-none"
                  onClick={() => setLocation("/")}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  看附近的人
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full h-12 bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold rounded-xl"
                  onClick={() => setLocation("/publish")}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  发一条相见动态
                </Button>
              </div>
            </CardContent>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10" />
          </Card>
        </div>
      </div>
    </Layout>
  );
}
