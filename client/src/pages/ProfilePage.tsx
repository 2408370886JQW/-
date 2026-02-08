import { useState } from "react";
import Layout from "@/components/Layout";
import { Settings, MapPin, Calendar, Heart, Image as ImageIcon, Star, ChevronRight, Grid, List, Users, Bell, Clock } from "lucide-react";
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
    friends: 42,
    likes: 1024
  }
};

const MY_APPOINTMENTS = [
  { id: 1, title: "周末探店小分队", time: "明天 14:00", location: "三里屯太古里", status: "upcoming" },
  { id: 2, title: "周五晚上桌游局", time: "周五 19:30", location: "朝阳大悦城", status: "pending" },
];

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

const SAVED_MOMENTS = [
  { id: 1, user: "Alice", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", content: "今天天气真好！", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop", likes: 24 },
  { id: 2, user: "Bob", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", content: "打卡网红咖啡店", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop", likes: 156 },
];

type TabType = "moments" | "saved_shops" | "saved_moments";

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
            <div className="flex gap-3">
              <Link href="/notifications">
                <button className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors relative">
                  <Bell className="w-6 h-6" />
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900" />
                </button>
              </Link>
              <button className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div>
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
            <Link href="/friends">
              <div className="text-center cursor-pointer active:opacity-70 transition-opacity">
                <div className="font-bold text-slate-900 text-lg">{USER_INFO.stats.friends}</div>
                <div className="text-xs text-slate-400">好友</div>
              </div>
            </Link>
            <div className="text-center">
              <div className="font-bold text-slate-900 text-lg">{USER_INFO.stats.likes}</div>
              <div className="text-xs text-slate-400">获赞</div>
            </div>
          </div>
        </div>

        {/* Appointment Reminders */}
        <div className="px-4 mb-6">
          <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                我的预约
              </h3>
              <Link href="/appointment/create">
                <button className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-medium active:bg-blue-100 transition-colors">
                  发起预约
                </button>
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {MY_APPOINTMENTS.map(apt => (
                <Link key={apt.id} href={`/appointment/${apt.id}`}>
                <div className="p-4 flex items-center justify-between active:bg-slate-50 transition-colors cursor-pointer">
                  <div>
                    <div className="font-medium text-slate-900 mb-1">{apt.title}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{apt.time}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>{apt.location}</span>
                    </div>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    apt.status === "upcoming" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                  )}>
                    {apt.status === "upcoming" ? "即将开始" : "待确认"}
                  </div>
                </div>
              </Link>
              ))}
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
              onClick={() => setActiveTab("saved_shops")}
              className={cn(
                "relative h-full flex items-center gap-2 text-sm font-medium transition-colors",
                activeTab === "saved_shops" ? "text-slate-900" : "text-slate-400"
              )}
            >
              <Star className="w-4 h-4" />
              收藏店铺
              {activeTab === "saved_shops" && (
                <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab("saved_moments")}
              className={cn(
                "relative h-full flex items-center gap-2 text-sm font-medium transition-colors",
                activeTab === "saved_moments" ? "text-slate-900" : "text-slate-400"
              )}
            >
              <Heart className="w-4 h-4" />
              收藏动态
              {activeTab === "saved_moments" && (
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

          {activeTab === "saved_shops" && (
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

          {activeTab === "saved_moments" && (
            <div className="grid grid-cols-2 gap-3 p-3">
              {SAVED_MOMENTS.map(moment => (
                <div key={moment.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
                  <div className="aspect-square relative">
                    <img src={moment.image} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm rounded-full p-1.5">
                      <Heart className="w-3 h-3 text-white fill-white" />
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={moment.avatar} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-xs font-medium text-slate-700">{moment.user}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{moment.content}</p>
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
