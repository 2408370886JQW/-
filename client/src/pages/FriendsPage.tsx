import { useState } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus, MessageCircle, MapPin, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "wouter";
import Layout from "@/components/Layout";

// Mock data for friends
const MOCK_FRIENDS = [
  { id: 1, name: "Alice", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", status: "online", location: "1.2km" },
  { id: 2, name: "Bob", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", status: "offline", location: "5.0km" },
  { id: 3, name: "Charlie", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop", status: "online", location: "800m" },
  { id: 4, name: "Diana", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", status: "offline", location: "12km" },
  { id: 5, name: "Eve", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop", status: "online", location: "300m" },
];

// Mock data for new friend requests
const MOCK_REQUESTS = [
  { id: 101, name: "Frank", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", message: "通过群聊添加" },
  { id: 102, name: "Grace", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", message: "请求添加你为好友" },
];

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const filteredFriends = MOCK_FRIENDS.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout showNav={false}>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header */}
        <div className="bg-white sticky top-0 z-10 px-4 pt-safe pb-2 shadow-sm">
          <div className="flex items-center justify-between mb-4 mt-2">
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <button className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors">
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
              </Link>
              <h1 className="text-2xl font-bold text-slate-900">好友</h1>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserPlus className="w-6 h-6 text-slate-900" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="搜索好友备注、昵称" 
              className="pl-9 bg-slate-100 border-none rounded-full h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-slate-100">
            <button
              onClick={() => setActiveTab("friends")}
              className={cn(
                "pb-3 text-sm font-bold transition-colors relative",
                activeTab === "friends" ? "text-slate-900" : "text-slate-400"
              )}
            >
              我的好友
              {activeTab === "friends" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={cn(
                "pb-3 text-sm font-bold transition-colors relative flex items-center gap-1.5",
                activeTab === "requests" ? "text-slate-900" : "text-slate-400"
              )}
            >
              新朋友
              {MOCK_REQUESTS.length > 0 && (
                <span className="w-2 h-2 bg-red-500 rounded-full" />
              )}
              {activeTab === "requests" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4">
          {activeTab === "friends" ? (
            <div className="space-y-4">
              {filteredFriends.map(friend => (
                <div 
                  key={friend.id} 
                  className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm active:scale-[0.98] transition-transform"
                  onClick={() => setLocation(`/chat`)} // Navigate to chat (mock)
                >
                  <div className="relative">
                    <img src={friend.avatar} className="w-12 h-12 rounded-full object-cover" />
                    {friend.status === "online" && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900">{friend.name}</div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {friend.location}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </div>
              ))}
              {filteredFriends.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">
                  未找到相关好友
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {MOCK_REQUESTS.map(request => (
                <div key={request.id} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                  <img src={request.avatar} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="font-bold text-slate-900">{request.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{request.message}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-8 px-3 rounded-full text-xs">忽略</Button>
                    <Button size="sm" className="h-8 px-3 rounded-full text-xs bg-blue-600 hover:bg-blue-700">接受</Button>
                  </div>
                </div>
              ))}
              {MOCK_REQUESTS.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">
                  暂无好友请求
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
