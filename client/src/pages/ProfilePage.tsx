import { useState } from "react";
import Layout from "@/components/Layout";
import { Settings, MapPin, Calendar, Heart, Image as ImageIcon, Star, ChevronRight, Grid, List, Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

// Mock Data
const USER_INFO = {
  name: "我的",
  id: "888888",
  avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop",
  bio: "热爱生活，喜欢探索城市的每一个角落 🌟",
  location: "北京·朝阳",
  joinDate: "2025年加入",
  stats: {
    following: 128,
    followers: 356,
    likes: 1024
  }
};

const MY_MOMENTS = [
  { id: 1, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=400&fit=crop", likes: 45, date: "10-24" },
  { id: 2, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop", likes: 128, date: "10-20" },
  { id: 3, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop", likes: 67, date: "10-15" },
  { id: 4, image: "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=400&h=400&fit=crop", likes: 230, date: "10-01" },
  { id: 5, image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop", likes: 89, date: "09-28" },
  { id: 6, image: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=400&h=400&fit=crop", likes: 156, date: "09-25" },
];

const SAVED_SHOPS = [
  { id: 1, name: "TRB Hutong", type: "法餐", rating: 4.9, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&h=200&fit=crop", address: "东城区五道营胡同" },
  { id: 2, name: "Algorithm 算法", type: "咖啡厅", rating: 4.8, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop", address: "朝阳区工体北路" },
];

type TabType = "moments" | "saved";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("moments");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header / Cover */}
        <div className="relative h-48 bg-slate-900 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute top-safe right-4">
            <button className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-4 relative -mt-12 mb-6">
          <div className="flex justify-between items-end mb-4">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
              <img src={USER_INFO.avatar} className="w-full h-full rounded-full object-cover" />
            </div>
            <button className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-full shadow-lg shadow-slate-200 active:scale-95 transition-transform mb-2">
              编辑资料
            </button>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">{USER_INFO.name}</h1>
            <div className="text-sm text-slate-500">ID: {USER_INFO.id}</div>
            <p className="text-slate-700 leading-relaxed">{USER_INFO.bio}</p>
            
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {USER_INFO.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {USER_INFO.joinDate}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-6">
            <div className="text-center">
              <div className="font-bold text-slate-900 text-lg">{USER_INFO.stats.following}</div>
              <div className="text-xs text-slate-400">关注</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-900 text-lg">{USER_INFO.stats.followers}</div>
              <div className="text-xs text-slate-400">粉丝</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-900 text-lg">{USER_INFO.stats.likes}</div>
              <div className="text-xs text-slate-400">获赞</div>
            </div>
          </div>
        </div>

        {/* Friends List Entry */}
        <div className="px-4 mb-6">
          <Link href="/friends">
            <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm active:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">我的好友</h3>
                  <p className="text-xs text-slate-500">查看通讯录列表</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </Link>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200">
          <div className="flex items-center justify-center gap-12 h-12">
            <button 
              onClick={() => setActiveTab("moments")}
              className={cn(
                "relative h-full flex items-center gap-2 text-sm font-medium transition-colors",
                activeTab === "moments" ? "text-slate-900" : "text-slate-400"
              )}
            >
              <ImageIcon className="w-4 h-4" />
              动态
              {activeTab === "moments" && (
                <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab("saved")}
              className={cn(
                "relative h-full flex items-center gap-2 text-sm font-medium transition-colors",
                activeTab === "saved" ? "text-slate-900" : "text-slate-400"
              )}
            >
              <Star className="w-4 h-4" />
              收藏
              {activeTab === "saved" && (
                <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-1 min-h-[300px]">
          {activeTab === "moments" && (
            <div className="grid grid-cols-3 gap-1">
              {MY_MOMENTS.map(moment => (
                <div key={moment.id} className="aspect-square relative bg-slate-200 overflow-hidden group cursor-pointer">
                  <img src={moment.image} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <div className="flex items-center gap-1 text-white text-xs font-medium">
                      <Heart className="w-3 h-3 fill-white" />
                      {moment.likes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "saved" && (
            <div className="space-y-3 p-3">
              {SAVED_SHOPS.map(shop => (
                <div key={shop.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex gap-3">
                  <img src={shop.image} className="w-20 h-20 rounded-lg object-cover bg-slate-100" />
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{shop.name}</h4>
                      <div className="text-xs text-slate-500 mt-1">{shop.address}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">{shop.type}</span>
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-900">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {shop.rating}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
