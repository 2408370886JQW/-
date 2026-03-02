import { useState } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Heart, MessageCircle, MapPin } from "lucide-react";

// Same mock data as Home.tsx - in production this would come from API
const USER_DATA: Record<number, {
  id: number;
  nickname: string;
  avatar: string;
  zodiac: string;
  tags: string[];
  gender: string;
  moments: { id: string; image: string; likes: number; content: string }[];
}> = {
  1: {
    id: 1,
    nickname: "小鹿",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    zodiac: "双子座",
    tags: ["摄影", "咖啡"],
    gender: "female",
    moments: [
      { id: "m1", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop", likes: 24, content: "海边日落" },
      { id: "m2", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=600&fit=crop", likes: 156, content: "下午茶时光" },
      { id: "m3", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=600&fit=crop", likes: 45, content: "周末聚餐" },
      { id: "m4", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop", likes: 89, content: "偶遇小猫" },
      { id: "m5", image: "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=600&h=600&fit=crop", likes: 67, content: "闺蜜出游" },
    ],
  },
  3: {
    id: 3,
    nickname: "大卫",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    zodiac: "狮子座",
    tags: ["美食", "旅行", "音乐"],
    gender: "male",
    moments: [
      { id: "m8", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop", likes: 210, content: "必吃汉堡" },
      { id: "m9", image: "https://images.unsplash.com/photo-1508189860359-777d945909ef?w=600&h=600&fit=crop", likes: 445, content: "北京秋色" },
      { id: "m10", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=600&fit=crop", likes: 128, content: "兄弟聚会" },
      { id: "m11", image: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=600&h=600&fit=crop", likes: 56, content: "生日派对" },
    ],
  },
};

export default function UserMomentsPage() {
  const [, params] = useRoute("/user-moments/:userId");
  const userId = params?.userId ? parseInt(params.userId) : null;
  const user = userId ? USER_DATA[userId] : null;

  const [likedMoments, setLikedMoments] = useState<Set<string>>(new Set());

  const toggleLike = (momentId: string) => {
    setLikedMoments((prev) => {
      const next = new Set(prev);
      if (next.has(momentId)) {
        next.delete(momentId);
      } else {
        next.add(momentId);
      }
      return next;
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500">用户不存在</p>
        <Link to="/" className="text-blue-600 text-sm font-medium">
          返回地图
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/">
            <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center active:scale-90 transition-transform">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`w-10 h-10 rounded-full border-2 overflow-hidden ${
                user.gender === "female" ? "border-pink-400" : "border-blue-400"
              }`}
            >
              <img
                src={user.avatar}
                className="w-full h-full object-cover"
                alt={user.nickname}
              />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">
                {user.nickname}的动态
              </h1>
              <p className="text-xs text-slate-400">
                共 {user.moments.length} 条动态
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Moments List */}
      <div className="px-4 py-4 space-y-4">
        {user.moments.map((moment) => {
          const isLiked = likedMoments.has(moment.id);
          return (
            <div
              key={moment.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100"
            >
              {/* Image */}
              <div className="relative aspect-square">
                <img
                  src={moment.image}
                  className="w-full h-full object-cover"
                  alt={moment.content}
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm text-slate-800 font-medium mb-3">
                  {moment.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <button
                    className="flex items-center gap-1.5 active:scale-90 transition-transform"
                    onClick={() => toggleLike(moment.id)}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isLiked
                          ? "fill-red-500 text-red-500"
                          : "text-slate-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isLiked ? "text-red-500" : "text-slate-500"
                      }`}
                    >
                      {isLiked ? moment.likes + 1 : moment.likes}
                    </span>
                  </button>
                  <button className="flex items-center gap-1.5 active:scale-90 transition-transform">
                    <MessageCircle className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-medium text-slate-500">
                      评论
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom safe area */}
      <div className="h-8" />
    </div>
  );
}
