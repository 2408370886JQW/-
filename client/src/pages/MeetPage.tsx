import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Heart, MessageCircle, Filter, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";

// Mock data for nearby people
const NEARBY_PEOPLE = [
  { id: 1, name: "Jessica", age: 24, distance: "200m", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop", tags: ["咖啡", "摄影", "旅行"], bio: "周末想去探店，有人一起吗？" },
  { id: 2, name: "Michael", age: 27, distance: "500m", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop", tags: ["健身", "篮球", "电影"], bio: "寻找健身搭子，坐标朝阳公园。" },
  { id: 3, name: "Sarah", age: 22, distance: "800m", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop", tags: ["美食", "猫咪", "音乐"], bio: "刚搬来附近，求推荐好吃的！" },
  { id: 4, name: "David", age: 29, distance: "1.2km", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop", tags: ["创业", "科技", "滑雪"], bio: "聊聊互联网创业那些事儿。" },
];

export default function MeetPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "male" | "female">("all");

  return (
    <Layout showNav={true}>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header */}
        <div className="bg-white sticky top-0 z-10 px-4 pt-safe pb-2 shadow-sm">
          <div className="flex items-center justify-between mb-4 mt-2">
            <h1 className="text-2xl font-bold text-slate-900">相见</h1>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Filter className="w-6 h-6 text-slate-900" />
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveFilter("all")}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                activeFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
              )}
            >
              全部
            </button>
            <button
              onClick={() => setActiveFilter("female")}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                activeFilter === "female" ? "bg-pink-500 text-white" : "bg-slate-100 text-slate-600"
              )}
            >
              只看女生
            </button>
            <button
              onClick={() => setActiveFilter("male")}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                activeFilter === "male" ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600"
              )}
            >
              只看男生
            </button>
          </div>
        </div>

        {/* Content - Card Stack Style */}
        <div className="px-4 py-4 space-y-4">
          {NEARBY_PEOPLE.map((person) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="relative h-64">
                <img src={person.avatar} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
                  <div className="flex items-end justify-between text-white">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">{person.name}</h3>
                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs backdrop-blur-sm">
                          {person.age}岁
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-white/80 mt-1">
                        <MapPin className="w-3 h-3" />
                        {person.distance}
                      </div>
                    </div>
                    <Button size="icon" className="rounded-full bg-white text-red-500 hover:bg-white/90 h-10 w-10">
                      <Heart className="w-5 h-5 fill-current" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">{person.bio}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {person.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
                <Button className="w-full rounded-xl bg-slate-900 text-white font-bold h-11">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  打招呼
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Floating Action Button for Creating a Meetup */}
        <div className="fixed bottom-24 right-4">
          <Button className="h-14 w-14 rounded-full bg-blue-600 shadow-lg hover:bg-blue-700 p-0 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </Button>
        </div>
      </div>
    </Layout>
  );
}
