import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle2, ShoppingBag, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";

// Mock data - In real app this would come from API based on relation type
const SCENARIO_DATA = {
  first_meet: {
    title: "第一次见面",
    desc: "稳妥不尴尬的破冰流程",
    tags: ["#不尴尬", "#稳妥", "#不翻车"],
    steps: [
      { icon: "☕️", label: "先喝东西", desc: "如果聊不来，30分钟撤退也不尴尬" },
      { icon: "🍽", label: "转场吃饭", desc: "聊得好再吃饭，选择安静的餐厅" },
      { icon: "⏰", label: "控制时长", desc: "首次见面建议控制在60-90分钟" }
    ],
    packages: [
      { id: "p3", name: "轻食双人下午茶", price: 128, originalPrice: 198, desc: "精致甜点+饮品，适合边吃边聊", image: "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=200&h=200&fit=crop" },
      { id: "p1", name: "双人微醺套餐", price: 168, originalPrice: 298, desc: "特调鸡尾酒，微醺氛围更放松", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&h=200&fit=crop" }
    ]
  },
  couple: {
    title: "情侣/暧昧",
    desc: "浪漫升温的约会指南",
    tags: ["#浪漫", "#氛围感", "#心动"],
    steps: [
      { icon: "🕯️", label: "氛围晚餐", desc: "灯光要暗，音乐要柔" },
      { icon: "🥂", label: "喝点小酒", desc: "微醺是最好的催化剂" },
      { icon: "📸", label: "合影留念", desc: "记录甜蜜时刻" }
    ],
    packages: [
      { id: "p1", name: "双人微醺套餐", price: 168, originalPrice: 298, desc: "特调鸡尾酒，微醺氛围更放松", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&h=200&fit=crop" },
      { id: "p4", name: "豪华情侣牛排餐", price: 520, originalPrice: 888, desc: "澳洲M5和牛，仪式感拉满", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop" }
    ]
  },
  bros: {
    title: "兄弟聚会",
    desc: "放松解压的畅聊局",
    tags: ["#放松", "#畅聊", "#解压"],
    steps: [
      { icon: "🍺", label: "大口喝酒", desc: "不整虚的，直接上酒" },
      { icon: "🥩", label: "大口吃肉", desc: "能量满满，横扫疲惫" },
      { icon: "🗣️", label: "互诉衷肠", desc: "聊聊工作，聊聊生活" }
    ],
    packages: [
      { id: "p2", name: "兄弟畅饮套餐", price: 288, originalPrice: 468, desc: "啤酒畅饮+炸物拼盘", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop" },
      { id: "p5", name: "肉食者盛宴", price: 398, originalPrice: 568, desc: "战斧牛排+烤鸡，满足感爆棚", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop" }
    ]
  },
  bestie: {
    title: "闺蜜聚会",
    desc: "精致出片的下午茶时光",
    tags: ["#超好拍", "#精致", "#八卦"],
    steps: [
      { icon: "🍰", label: "高颜甜品", desc: "先拍照，再品尝" },
      { icon: "🤳", label: "互拍美照", desc: "找好角度，原图直出" },
      { icon: "💬", label: "畅聊八卦", desc: "吐槽大会，快乐加倍" }
    ],
    packages: [
      { id: "p3", name: "轻食双人下午茶", price: 128, originalPrice: 198, desc: "精致甜点+饮品，适合边吃边聊", image: "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=200&h=200&fit=crop" },
      { id: "p6", name: "健康轻食沙拉", price: 88, originalPrice: 128, desc: "低卡美味，好吃不胖", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop" }
    ]
  }
};

export default function StoreScenarioPage() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const [relation, setRelation] = useState<string>("first_meet");
  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const r = params.get("relation");
    const sid = params.get("shop_id");
    if (r) setRelation(r);
    if (sid) setShopId(sid);
  }, [search]);

  const data = SCENARIO_DATA[relation as keyof typeof SCENARIO_DATA] || SCENARIO_DATA.first_meet;

  return (
    <Layout showNav={false}>
      <div className="min-h-screen bg-slate-50 pb-20">
        {/* Header */}
        <div className="bg-white px-4 py-3 flex items-center gap-2 shadow-sm sticky top-0 z-10">
          <button onClick={() => window.history.back()} className="p-1 -ml-2">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <span className="font-bold text-slate-900">专属推荐方案</span>
        </div>

        {/* Scenario Advice Section */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">{data.title}</h1>
                <p className="text-blue-100 text-sm opacity-90">{data.desc}</p>
              </div>
              <div className="flex flex-col gap-1">
                {data.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-sm font-medium text-blue-100 mb-2">推荐流程</div>
              <div className="grid grid-cols-3 gap-2">
                {data.steps.map((step, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center text-center">
                    <div className="text-2xl mb-2">{step.icon}</div>
                    <div className="font-bold text-sm mb-1">{step.label}</div>
                    <div className="text-[10px] text-blue-100 leading-tight">{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Package Recommendations */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-red-500" />
              <h2 className="font-bold text-lg text-slate-900">适合该关系的套餐</h2>
            </div>
            
            <div className="space-y-4">
              {data.packages.map(pkg => (
                <Card key={pkg.id} className="overflow-hidden border-none shadow-md" onClick={() => setLocation(`/store/package/${pkg.id}?shop_id=${shopId}`)}>
                  <div className="flex">
                    <div className="w-32 h-32 shrink-0">
                      <img src={pkg.image} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 mb-1">{pkg.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{pkg.desc}</p>
                      </div>
                      <div className="flex items-end justify-between mt-2">
                        <div>
                          <span className="text-red-500 font-bold text-xl">¥{pkg.price}</span>
                          <span className="text-slate-400 text-xs line-through ml-1">¥{pkg.originalPrice}</span>
                        </div>
                        <Button size="sm" className="h-8 px-4 bg-red-500 hover:bg-red-600 rounded-full shadow-md shadow-red-100">
                          抢购
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
