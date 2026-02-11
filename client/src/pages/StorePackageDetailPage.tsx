import { useState, useEffect } from "react";
import { useLocation, useSearch, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

// Mock data - In real app fetch by ID
const PACKAGES = {
  p1: { name: "双人微醺套餐", price: 168, originalPrice: 298, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop", items: ["特调鸡尾酒 2杯", "炸物拼盘 1份", "水果沙拉 1份"], rules: ["随时退", "过期自动退", "需提前预约"] },
  p2: { name: "兄弟畅饮套餐", price: 288, originalPrice: 468, image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop", items: ["精酿啤酒 6瓶", "德式烤肠拼盘 1份", "麻辣花生 1份"], rules: ["随时退", "过期自动退", "免预约"] },
  p3: { name: "轻食双人下午茶", price: 128, originalPrice: 198, image: "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=800&h=600&fit=crop", items: ["精致切块蛋糕 2份", "手冲咖啡/茶 2杯", "马卡龙 2个"], rules: ["随时退", "过期自动退", "免预约"] },
  p4: { name: "豪华情侣牛排餐", price: 520, originalPrice: 888, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop", items: ["澳洲M5和牛眼肉 200g", "黑松露蘑菇汤 2份", "凯撒沙拉 1份", "红酒 2杯"], rules: ["随时退", "过期自动退", "需提前1天预约"] },
  p5: { name: "肉食者盛宴", price: 398, originalPrice: 568, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop", items: ["战斧牛排 1kg", "烤全鸡 1只", "烤蔬菜拼盘 1份"], rules: ["随时退", "过期自动退", "需提前2小时预约"] },
  p6: { name: "健康轻食沙拉", price: 88, originalPrice: 128, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop", items: ["牛油果大虾沙拉 1份", "鲜榨果汁 1杯", "全麦面包 2片"], rules: ["随时退", "过期自动退", "免预约"] },
};

export default function StorePackageDetailPage() {
  const [location, setLocation] = useLocation();
  const params = useParams();
  const search = useSearch();
  const { toast } = useToast();
  const [pkg, setPkg] = useState<any>(null);
  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const sid = searchParams.get("shop_id");
    if (sid) setShopId(sid);

    // @ts-ignore
    const pkgId = params.id;
    if (pkgId && PACKAGES[pkgId as keyof typeof PACKAGES]) {
      setPkg(PACKAGES[pkgId as keyof typeof PACKAGES]);
    }
  }, [params, search]);

  const handlePurchase = () => {
    toast({
      title: "正在发起支付...",
      description: "模拟支付环境",
    });
    
    setTimeout(() => {
      setLocation(`/store/payment/success?shop_id=${shopId}`);
    }, 1500);
  };

  if (!pkg) return <div className="p-4">加载中...</div>;

  return (
    <Layout showNav={false}>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header Image */}
        <div className="relative h-64 w-full">
          <img src={pkg.image} className="w-full h-full object-cover" />
          <button 
            onClick={() => window.history.back()} 
            className="absolute top-4 left-4 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 -mt-6 relative z-10">
          {/* Title Card */}
          <Card className="border-none shadow-lg mb-4">
            <CardContent className="p-5">
              <h1 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h1>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold text-red-500">¥{pkg.price}</span>
                <span className="text-sm text-slate-400 line-through mb-1">¥{pkg.originalPrice}</span>
                <span className="ml-auto text-xs text-slate-500">已售 1000+</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {pkg.rules.map((rule: string) => (
                  <div key={rule} className="flex items-center gap-1 text-xs text-slate-600">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    {rule}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Package Content */}
          <Card className="border-none shadow-sm mb-4">
            <CardContent className="p-5">
              <h2 className="font-bold text-lg text-slate-900 mb-4">套餐内容</h2>
              <div className="space-y-3">
                {pkg.items.map((item: string, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-slate-700">{item.split(' ')[0]}</span>
                    <span className="text-slate-900 font-medium">{item.split(' ')[1]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Purchase Notice */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-5">
              <h2 className="font-bold text-lg text-slate-900 mb-4">购买须知</h2>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex gap-2">
                  <span className="text-slate-400 shrink-0">有效期</span>
                  <span>购买后90天内有效</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400 shrink-0">使用时间</span>
                  <span>10:00 - 22:00</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400 shrink-0">适用范围</span>
                  <span>全场通用，仅限堂食</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
          <div className="flex gap-4 items-center">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500">总价</span>
              <span className="text-2xl font-bold text-red-500">¥{pkg.price}</span>
            </div>
            <Button 
              className="flex-1 h-12 text-lg font-bold bg-red-500 hover:bg-red-600 rounded-full shadow-lg shadow-red-200"
              onClick={handlePurchase}
            >
              立即抢购
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
