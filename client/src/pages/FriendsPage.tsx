import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, MessageCircle, MapPin, ChevronLeft, MoreHorizontal, Edit2, Folder, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "wouter";
import Layout from "@/components/Layout";

// Types
type Friend = {
  id: number;
  name: string;
  alias?: string;
  avatar: string;
  status: "online" | "offline";
  location: string;
  group: string;
};

// Mock data for friends
const INITIAL_FRIENDS: Friend[] = [
  { id: 1, name: "Alice", alias: "爱丽丝", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", status: "online", location: "1.2km", group: "特别关注" },
  { id: 2, name: "Bob", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", status: "offline", location: "5.0km", group: "同事" },
  { id: 3, name: "Charlie", alias: "查理", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop", status: "online", location: "800m", group: "默认分组" },
  { id: 4, name: "Diana", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", status: "offline", location: "12km", group: "默认分组" },
  { id: 5, name: "Eve", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop", status: "online", location: "300m", group: "特别关注" },
];

// Mock data for new friend requests
const MOCK_REQUESTS = [
  { id: 101, name: "Frank", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", message: "通过群聊添加" },
  { id: 102, name: "Grace", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", message: "请求添加你为好友" },
];

const GROUPS = ["全部", "特别关注", "同事", "家人", "默认分组"];

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
  const [activeGroup, setActiveGroup] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState(INITIAL_FRIENDS);
  const [, setLocation] = useLocation();

  // Edit Dialog State
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  const [editAlias, setEditAlias] = useState("");
  const [editGroup, setEditGroup] = useState("");

  const filteredFriends = friends.filter(friend => {
    const matchesSearch = (friend.alias || friend.name).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = activeGroup === "全部" || friend.group === activeGroup;
    return matchesSearch && matchesGroup;
  });

  const handleEditClick = (e: React.MouseEvent, friend: Friend) => {
    e.stopPropagation();
    setEditingFriend(friend);
    setEditAlias(friend.alias || "");
    setEditGroup(friend.group);
  };

  const handleSaveEdit = () => {
    if (!editingFriend) return;
    
    setFriends(friends.map(f => 
      f.id === editingFriend.id 
        ? { ...f, alias: editAlias, group: editGroup }
        : f
    ));
    setEditingFriend(null);
  };

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

          {/* Group Filter (Only show in Friends tab) */}
          {activeTab === "friends" && (
            <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide -mx-4 px-4">
              {GROUPS.map(group => (
                <button
                  key={group}
                  onClick={() => setActiveGroup(group)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                    activeGroup === group 
                      ? "bg-slate-900 text-white" 
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  {group}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-4 py-2 pb-24">
          {activeTab === "friends" ? (
            <div className="space-y-3">
              {filteredFriends.map(friend => (
                <div 
                  key={friend.id} 
                  className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm active:scale-[0.98] transition-transform group relative"
                  onClick={() => setLocation(`/chat`)}
                >
                  <div className="relative">
                    <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full object-cover" />
                    {friend.status === "online" && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-slate-900 truncate">
                        {friend.alias || friend.name}
                      </div>
                      {friend.alias && (
                        <span className="text-xs text-slate-400 truncate">({friend.name})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <MapPin className="w-3 h-3" />
                        {friend.location}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
                        {friend.group}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                      onClick={(e) => handleEditClick(e, friend)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  </div>
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
                  <img src={request.avatar} alt={request.name} className="w-12 h-12 rounded-full object-cover" />
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

        {/* Edit Friend Dialog */}
        <Dialog open={!!editingFriend} onOpenChange={(open) => !open && setEditingFriend(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>设置好友信息</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="alias" className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  备注名
                </Label>
                <Input
                  id="alias"
                  value={editAlias}
                  onChange={(e) => setEditAlias(e.target.value)}
                  placeholder="设置备注名"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="group" className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  分组
                </Label>
                <div className="flex flex-wrap gap-2">
                  {GROUPS.filter(g => g !== "全部").map(group => (
                    <button
                      key={group}
                      onClick={() => setEditGroup(group)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
                        editGroup === group
                          ? "bg-blue-50 border-blue-200 text-blue-600"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingFriend(null)}>取消</Button>
              <Button onClick={handleSaveEdit}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
