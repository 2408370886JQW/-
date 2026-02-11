import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, Sparkles, ThumbsUp, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for scenarios based on relationship
const SCENARIO_DATA: Record<string, any> = {
  first_meet: {
    title: "第一次见面",
    subtitle: "稳妥不尴尬的破冰之旅",
    color: "bg-orange-50 text-orange-600",
    icon: Sparkles,
    tips: [
      { icon: Clock, text: "建议时长：60-90分钟" },
      { icon: ThumbsUp, text: "推荐流程：先饮品后正餐" },
    ],
    tags: ["#不尴尬", "#稳妥", "#不翻车"],
    description: "第一次见面最重要的是轻松自然的氛围。我们为您准备了便于交谈的座位和不易出错的餐点，助您留下完美第一印象。",
  },
  date: {
    title: "情侣/暧昧",
    subtitle: "浪漫升温的心动时刻",
    color: "bg-pink-50 text-pink-600",
    icon: Sparkles,
    tips: [
      { icon: Clock, text: "建议时长：90-120分钟" },
      { icon: ThumbsUp, text: "推荐流程：共享主食+甜品" },
    ],
    tags: ["#浪漫", "#氛围感", "#助攻"],
    description: "灯光微暗，音乐轻柔。精选的浪漫套餐和私密角落，让每一次对视都充满火花。",
  },
  bros: {
    title: "兄弟聚会",
    subtitle: "大口吃肉的畅爽时刻",
    color: "bg-blue-50 text-blue-600",
    icon: Sparkles,
    tips: [
      { icon: Clock, text: "建议时长：不限时" },
      { icon: ThumbsUp, text: "推荐流程：拼盘+啤酒" },
    ],
    tags: ["#量大", "#过瘾", "#畅聊"],
    description: "无需拘束，尽情放松。超大份量的分享拼盘和冰镇饮品，是兄弟间最好的催化剂。",
  },
  bestie: {
    title: "闺蜜下午茶",
    subtitle: "精致出片的打卡时光",
    color: "bg-purple-50 text-purple-600",
    icon: Sparkles,
    tips: [
      { icon: Clock, text: "建议时长：120分钟+" },
      { icon: ThumbsUp, text: "推荐流程：拍照+甜品" },
    ],
    tags: ["#高颜值", "#出片", "#精致"],
    description: "每一个角落都是摄影棚。高颜值的餐点和完美的自然光，让你们的合照刷爆朋友圈。",
  },
};

// Mock packages
const PACKAGES = [
  {
    id: "p1",
    title: "初见·双人轻食套餐",
    price: 198,
    originalPrice: 268,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=400&fit=crop",
    recommendReason: "份量适中吃相优雅，避免尴尬",
    tags: ["第一次见面", "情侣"],
  },
  {
    id: "p2",
    title: "微醺·浪漫晚餐双人餐",
    price: 398,
    originalPrice: 588,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop",
    recommendReason: "含特调鸡尾酒，微醺助攻",
    tags: ["情侣", "暧昧"],
  },
  {
    id: "p3",
    title: "欢聚·四人分享拼盘",
    price: 468,
    originalPrice: 688,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop",
    recommendReason: "超大肉食拼盘，满足感爆棚",
    tags: ["兄弟", "聚会"],
  },
];

export default function StoreScenarioPage() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const relationType = params.get("relation") || "first_meet";
  const shopId = params.get("shop_id");

  const scenario = SCENARIO_DATA[relationType] || SCENARIO_DATA["first_meet"];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 flex items-center gap-4 shadow-sm">
        <button onClick={() => window.history.back()}>
          <ArrowLeft className="w-5 h-5 text-slate-900" />
        </button>
        <h1 className="font-bold text-lg text-slate-900">专属推荐</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* 1. Scenario Suggestion Module */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold mb-2", scenario.color)}>
                <scenario.icon className="w-3 h-3" />
                {scenario.title}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{scenario.subtitle}</h2>
            </div>
          </div>

          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            {scenario.description}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {scenario.tips.map((tip: any, idx: number) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-3 flex items-center gap-2">
                <tip.icon className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs font-medium text-slate-700">{tip.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {scenario.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 2. Recommended Packages List */}
        <div>
          <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-[#FF4D00] fill-[#FF4D00]" />
            为您推荐的套餐
          </h3>
          
          <div className="space-y-4">
            {PACKAGES.map((pkg) => (
              <Card 
                key={pkg.id} 
                className="overflow-hidden border-none shadow-sm active:scale-[0.99] transition-transform"
                onClick={() => setLocation(`/store/package/${pkg.id}?shop_id=${shopId}`)}
              >
                <div className="flex flex-col">
                  <div className="relative h-40 bg-slate-200">
                    <img src={pkg.image} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-[#FF4D00] text-white text-xs font-bold rounded-lg shadow-sm">
                        {pkg.recommendReason}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-slate-900">{pkg.title}</h4>
                    </div>
                    <div className="flex gap-2 mb-4">
                      {pkg.tags.map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 border border-slate-200 text-slate-500 text-[10px] rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[#FF4D00] text-sm font-bold">¥</span>
                        <span className="text-[#FF4D00] text-2xl font-bold">{pkg.price}</span>
                        <span className="text-slate-400 text-sm line-through ml-2">¥{pkg.originalPrice}</span>
                      </div>
                      <Button className="bg-[#FF4D00] hover:bg-[#FF4D00]/90 text-white font-bold rounded-full px-6">
                        立即抢购
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
