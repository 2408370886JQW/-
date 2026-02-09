import { useState } from "react";
import Layout from "@/components/Layout";
import { ArrowLeft, Heart, UserPlus, MessageCircle, Bell } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

// Mock Data
const NOTIFICATIONS = [
  { id: 1, type: "like", user: "Alice", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", content: "赞了你的动态", time: "10分钟前", read: false, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=100&h=100&fit=crop" },
  { id: 2, type: "friend_request", user: "Bob", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", content: "请求添加你为好友", time: "1小时前", read: false },
  { id: 3, type: "comment", user: "Charlie", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop", content: "评论：这家店真的很好吃！", time: "2小时前", read: true, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop" },
  { id: 4, type: "system", user: "系统通知", avatar: "", content: "欢迎加入社交生活圈！", time: "1天前", read: true },
];

export default function NotificationPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <Layout showNav={false}>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="px-4 pt-safe pb-2 bg-white sticky top-0 z-10 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <button className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </Link>
              <h1 className="text-xl font-bold text-slate-900">通知中心</h1>
            </div>
            <button 
              onClick={markAllAsRead}
              className="text-sm text-slate-500 hover:text-slate-900 font-medium"
            >
              全部已读
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={cn(
                "flex gap-3 px-4 py-4 border-b border-slate-50 transition-colors",
                !notification.read ? "bg-blue-50/30" : "hover:bg-slate-50"
              )}
            >
              {/* Avatar / Icon */}
              <div className="relative shrink-0">
                {notification.type === "system" ? (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Bell className="w-6 h-6" />
                  </div>
                ) : (
                  <img src={notification.avatar} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                )}
                
                {/* Type Badge */}
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px]",
                  notification.type === "like" ? "bg-red-500" :
                  notification.type === "friend_request" ? "bg-blue-500" :
                  notification.type === "comment" ? "bg-green-500" : "hidden"
                )}>
                  {notification.type === "like" && <Heart className="w-3 h-3 fill-white" />}
                  {notification.type === "friend_request" && <UserPlus className="w-3 h-3" />}
                  {notification.type === "comment" && <MessageCircle className="w-3 h-3" />}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-900 text-sm">{notification.user}</span>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{notification.time}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {notification.content}
                </p>
              </div>

              {/* Thumbnail (for likes/comments) */}
              {notification.image && (
                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 ml-2">
                  <img src={notification.image} className="w-full h-full object-cover" />
                </div>
              )}
              
              {/* Friend Request Actions */}
              {notification.type === "friend_request" && (
                <div className="self-center ml-2 flex gap-2">
                  <button className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-full shadow-sm active:scale-95 transition-transform">
                    同意
                  </button>
                  <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full active:scale-95 transition-transform">
                    拒绝
                  </button>
                </div>
              )}
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Bell className="w-12 h-12 mb-2 opacity-20" />
              <p className="text-sm">暂无新通知</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
