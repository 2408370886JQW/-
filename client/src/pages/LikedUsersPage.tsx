import { useState } from "react";
import Layout from "@/components/Layout";
import { ArrowLeft, Heart, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

// Mock liked users data - in real app this would come from global state/backend
const MOCK_LIKED_USERS = [
  {
    id: 1,
    nickname: "小鹿",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    gender: "female",
    zodiac: "双子座",
    tags: ["摄影", "咖啡"],
    status: "online",
    lastSeen: "在线",
    distance: "0.3km",
    bio: "热爱生活，用镜头记录美好瞬间",
  },
  {
    id: 3,
    nickname: "大卫",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    gender: "male",
    zodiac: "狮子座",
    tags: ["美食", "旅行", "音乐"],
    status: "online",
    lastSeen: "在线",
    distance: "0.8km",
    bio: "吃遍全城，走遍世界",
  },
  {
    id: 2,
    nickname: "阿杰",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    gender: "male",
    zodiac: "天蝎座",
    tags: ["健身", "电影"],
    status: "recent",
    lastSeen: "15分钟前",
    distance: "1.2km",
    bio: "自律给我自由",
  },
];

export default function LikedUsersPage() {
  const [, navigate] = useLocation();
  const [likedUsers, setLikedUsers] = useState(MOCK_LIKED_USERS);
  const [confirmUnlike, setConfirmUnlike] = useState<number | null>(null);

  const handleUnlike = (userId: number) => {
    setConfirmUnlike(userId);
  };

  const confirmUnlikeUser = () => {
    if (confirmUnlike !== null) {
      setLikedUsers(prev => prev.filter(u => u.id !== confirmUnlike));
      setConfirmUnlike(null);
    }
  };

  return (
    <Layout showNav={false}>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              onClick={() => navigate("/profile")}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h1 className="text-base font-bold text-slate-900">我喜欢的人</h1>
            <div className="w-9" />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-4 py-3 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="text-sm text-rose-700 font-medium">
              共喜欢了 <span className="font-bold text-rose-600">{likedUsers.length}</span> 个人
            </span>
          </div>
        </div>

        {/* User List */}
        <div className="px-4 py-3 space-y-3">
          <AnimatePresence>
            {likedUsers.map((user) => (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <Link href={`/?locate=${user.id}`}>
                      <div className="relative shrink-0">
                        <div className={cn(
                          "w-16 h-16 rounded-full border-[3px] p-0.5 overflow-hidden",
                          "border-rose-400"
                        )}>
                          <img
                            src={user.avatar}
                            className="w-full h-full rounded-full object-cover"
                            alt={user.nickname}
                          />
                        </div>
                        {/* Status Dot */}
                        <div className={cn(
                          "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white",
                          user.status === "online" ? "bg-green-500" :
                          user.status === "recent" ? "bg-yellow-500" : "bg-gray-400"
                        )} />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">{user.nickname}</h3>
                          <span className={cn(
                            "text-xs px-1.5 py-0.5 rounded-full font-medium",
                            user.gender === "female" ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"
                          )}>
                            {user.gender === "female" ? "♀" : "♂"}
                          </span>
                          <span className="text-xs text-slate-400">{user.zodiac}</span>
                        </div>
                        {/* Unlike Button */}
                        <button
                          onClick={() => handleUnlike(user.id)}
                          className="p-2 -mr-1 rounded-full hover:bg-rose-50 transition-colors group"
                        >
                          <Heart className="w-5 h-5 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-500 mb-2 line-clamp-1">{user.bio}</p>

                      {/* Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        {user.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Bottom Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className={cn(
                            user.status === "online" ? "text-green-500" : ""
                          )}>
                            {user.lastSeen}
                          </span>
                          <div className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3" />
                            {user.distance}
                          </div>
                        </div>
                        <Link href={`/?locate=${user.id}`}>
                          <button className="text-xs text-blue-500 font-medium px-3 py-1.5 bg-blue-50 rounded-full active:bg-blue-100 transition-colors">
                            地图定位
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {likedUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-rose-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">还没有喜欢的人</h3>
              <p className="text-sm text-slate-400 text-center max-w-[240px]">
                在偶遇地图上点击用户头像，打开卡片后点击爱心按钮即可喜欢
              </p>
              <Link href="/">
                <button className="mt-6 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full shadow-lg active:scale-95 transition-transform">
                  去偶遇
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Confirm Unlike Modal */}
        <AnimatePresence>
          {confirmUnlike !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-8"
              onClick={() => setConfirmUnlike(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
              >
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-7 h-7 text-rose-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">取消喜欢</h3>
                  <p className="text-sm text-slate-500">
                    确定要取消喜欢 <span className="font-medium text-slate-700">{likedUsers.find(u => u.id === confirmUnlike)?.nickname}</span> 吗？
                  </p>
                  <p className="text-xs text-slate-400 mt-1">取消后地图上将不再显示特殊标记</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmUnlike(null)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl active:bg-slate-200 transition-colors"
                  >
                    再想想
                  </button>
                  <button
                    onClick={confirmUnlikeUser}
                    className="flex-1 py-3 bg-rose-500 text-white text-sm font-bold rounded-xl active:bg-rose-600 transition-colors"
                  >
                    确认取消
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
