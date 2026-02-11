import { useRoute, Link } from "wouter";
import Layout from "@/components/Layout";
import { ArrowLeft, Star, MapPin, ChevronRight, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Mock data for plan details (In a real app, this would come from an API based on ID)
const PLAN_DETAILS = {
  "date-first": {
    title: "第一次约会标准流程",
    desc: "专为初次见面设计，流程紧凑不尴尬，氛围轻松。",
    tags: ["#不尴尬", "#氛围感", "#高成功率"],
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop",
    steps: [
      {
        id: 1,
        title: "第一步：吃饭",
        desc: "选择环境安静、灯光柔和的餐厅，方便聊天了解彼此。",
        icon: "🍽",
        merchants: [
          {
            id: 101,
            name: "花田错·下午茶餐厅",
            rating: 4.8,
            price: "¥128/人",
            tag: "环境优美",
            distance: "500m",
            image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&h=200&fit=crop"
          },
          {
            id: 102,
            name: "丝路有约·西餐",
            rating: 4.6,
            price: "¥158/人",
            tag: "浪漫氛围",
            distance: "800m",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&h=200&fit=crop"
          }
        ]
      },
      {
        id: 2,
        title: "第二步：看电影",
        desc: "饭后看场电影，缓解初次见面的紧张感，增加共同话题。",
        icon: "🎬",
        merchants: [
          {
            id: 201,
            name: "万达影城 (CBD店)",
            rating: 4.9,
            price: "¥60/人",
            tag: "IMAX",
            distance: "200m",
            image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&h=200&fit=crop"
          }
        ]
      },
      {
        id: 3,
        title: "第三步：咖啡/小酌",
        desc: "如果聊得投机，可以找个清吧或咖啡馆继续深入交流。",
        icon: "☕️",
        merchants: [
          {
            id: 301,
            name: "Starbucks Reserve",
            rating: 4.7,
            price: "¥45/人",
            tag: "安静",
            distance: "100m",
            image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop"
          }
        ]
      }
    ]
  }
};

export default function PlanDetailPage() {
  const [match, params] = useRoute("/plan/:id");
  const planId = params?.id || "date-first";
  // Fallback to default if ID not found in mock data
  const plan = PLAN_DETAILS[planId as keyof typeof PLAN_DETAILS] || PLAN_DETAILS["date-first"];

  return (
    <Layout showNav={false}>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header Image */}
        <div className="relative h-64 w-full">
          <img src={plan.image} alt={plan.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          
          {/* Navbar */}
          <div className="absolute top-0 left-0 right-0 p-4 pt-safe flex justify-between items-center text-white z-10">
            <Link href="/">
              <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform">
                <Heart className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Title Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">{plan.title}</h1>
            <p className="text-white/80 text-sm mb-3 line-clamp-2">{plan.desc}</p>
            <div className="flex gap-2">
              {plan.tags.map(tag => (
                <span key={tag} className="px-2 py-1 rounded-md bg-white/20 backdrop-blur-md text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="px-4 py-6 space-y-8">
          {plan.steps.map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 border-l-2 border-slate-200 last:border-l-0 pb-8 last:pb-0"
            >
              {/* Step Indicator */}
              <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm shadow-md z-10">
                {step.icon}
              </div>

              {/* Step Header */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{step.desc}</p>
              </div>

              {/* Recommended Merchants */}
              <div className="space-y-3">
                {step.merchants.map(merchant => (
                  <Link key={merchant.id} href={`/merchant/${merchant.id}`}>
                    <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex gap-3 active:scale-[0.98] transition-transform">
                      <img src={merchant.image} alt={merchant.name} className="w-20 h-20 rounded-lg object-cover bg-slate-100" />
                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900 truncate">{merchant.name}</h4>
                          <span className="text-xs text-slate-400">{merchant.distance}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                          <span className="text-xs font-medium text-orange-400">{merchant.rating}</span>
                          <span className="text-xs text-slate-300 mx-1">|</span>
                          <span className="text-xs text-slate-500">{merchant.price}</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                            {merchant.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-safe z-20 flex gap-3">
          <Button variant="outline" className="flex-1 h-12 rounded-full text-base">
            分享给Ta
          </Button>
          <Button className="flex-[2] h-12 rounded-full text-base bg-slate-900 hover:bg-slate-800">
            一键预订行程
          </Button>
        </div>
      </div>
    </Layout>
  );
}
