import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Plus, Search, Clock, ChevronRight, Star } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";

// Mock data for activities/group buying
const ACTIVITIES = [
  {
    id: 1,
    title: "周末飞盘局 | 新手友好",
    type: "outdoor",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=400&fit=crop",
    location: "朝阳公园大草坪",
    distance: "1.2km",
    time: "周六 14:00",
    price: "¥49/人",
    participants: 12,
    maxParticipants: 20,
    organizer: {
      name: "飞盘俱乐部",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
    },
    tags: ["户外", "运动", "交友"]
  },
  {
    id: 2,
    title: "日式烧鸟双人餐 | 氛围感拉满",
    type: "dining",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=400&fit=crop",
    location: "鸟屋·居酒屋",
    distance: "500m",
    time: "随时可用",
    price: "¥268",
    originalPrice: "¥488",
    rating: 4.8,
    sold: 1200,
    tags: ["日料", "约会", "深夜食堂"]
  },
  {
    id: 3,
    title: "剧本杀《古堡之谜》 | 缺2人",
    type: "entertainment",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=400&fit=crop",
    location: "迷雾侦探社",
    distance: "2.5km",
    time: "周日 19:00",
    price: "¥128/人",
    participants: 4,
    maxParticipants: 6,
    organizer: {
      name: "DM小王",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
    },
    tags: ["烧脑", "沉浸式", "社交"]
  },
  {
    id: 4,
    title: "精酿啤酒畅饮夜",
    type: "dining",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=400&fit=crop",
    location: "HopZone Taproom",
    distance: "800m",
    time: "周五 20:00",
    price: "¥158/人",
    participants: 8,
    maxParticipants: 15,
    organizer: {
      name: "酒鬼阿强",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
    },
    tags: ["微醺", "音乐", "派对"]
  }
];

const CATEGORIES = [
  { id: "all", label: "全部" },
  { id: "dining", label: "约饭" },
  { id: "outdoor", label: "户外" },
  { id: "entertainment", label: "娱乐" },
  { id: "art", label: "看展" },
];

export default function MeetPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredActivities = activeCategory === "all" 
    ? ACTIVITIES 
    : ACTIVITIES.filter(item => item.type === activeCategory);

  return (
    <Layout showNav={true}>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header */}
        <div className="bg-white sticky top-0 z-10 px-4 pt-safe pb-2 shadow-sm">
          <div className="flex items-center justify-between mb-4 mt-2">
            <h1 className="text-2xl font-bold text-slate-900">发现美好生活</h1>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="w-6 h-6 text-slate-900" />
              </Button>
              <Link href="/appointment/create">
                <Button variant="ghost" size="icon" className="rounded-full text-blue-600">
                  <Plus className="w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-bold transition-colors whitespace-nowrap",
                  activeCategory === cat.id 
                    ? "bg-slate-900 text-white" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="px-4 py-4 space-y-4">
          {filteredActivities.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100"
            >
              {/* Image Section */}
              <div className="relative h-48">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-900">
                  {item.distance}
                </div>
                {item.type === "dining" && (
                  <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                    团购特惠
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-900 flex-1 mr-2 line-clamp-1">{item.title}</h3>
                  <div className="text-lg font-bold text-red-500">{item.price}</div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[100px]">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.time}</span>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  {item.organizer ? (
                    <div className="flex items-center gap-2">
                      <img src={item.organizer.avatar} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs text-slate-600">发起人: {item.organizer.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-xs font-bold">{item.rating}</span>
                      <span className="text-xs text-slate-400 ml-1">已售 {item.sold}</span>
                    </div>
                  )}

                  {item.participants && (
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Users className="w-3.5 h-3.5" />
                      <span>{item.participants}/{item.maxParticipants}人</span>
                    </div>
                  )}
                  
                  {!item.participants && (
                    <Button size="sm" variant="outline" className="h-7 text-xs rounded-full px-3">
                      去看看 <ChevronRight className="w-3 h-3 ml-0.5" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
