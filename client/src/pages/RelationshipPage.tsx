import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { ArrowLeft, Search, UserPlus, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRoute, Link } from "wouter";
import { cn } from "@/lib/utils";

// Mock Data
const MOCK_USERS = [
  { id: 1, name: "Alice", handle: "@alice_wonder", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", isFollowing: true, bio: "生活艺术家 🎨" },
  { id: 2, name: "Bob", handle: "@bob_builder", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", isFollowing: false, bio: "摄影师 | 旅行者 📷" },
  { id: 3, name: "Charlie", handle: "@charlie_chaplin", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop", isFollowing: true, bio: "快乐每一天 😄" },
  { id: 4, name: "David", handle: "@david_beckham", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", isFollowing: false, bio: "足球爱好者 ⚽" },
  { id: 5, name: "Eva", handle: "@eva_green", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", isFollowing: true, bio: "电影迷 🎬" },
];

export default function RelationshipPage() {
  const [match, params] = useRoute("/relations/:type");
  const type = params?.type || "following"; // 'following' or 'followers'
  
  const [activeTab, setActiveTab] = useState<"following" | "followers">(type as "following" | "followers");
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync tab with route param if needed, or just handle internal state
  useEffect(() => {
    if (params?.type) {
      setActiveTab(params.type as "following" | "followers");
    }
  }, [params?.type]);

  const handleToggleFollow = (id: number) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isFollowing: !user.isFollowing } : user
    ));
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout showNav={false}>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="px-4 pt-safe pb-2 bg-white sticky top-0 z-10 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/profile">
              <button className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </Link>
            <div className="flex-1 flex justify-center gap-8 mr-8">
              <button 
                onClick={() => setActiveTab("following")}
                className={cn(
                  "relative py-2 text-base font-bold transition-colors",
                  activeTab === "following" ? "text-slate-900" : "text-slate-400"
                )}
              >
                关注
                {activeTab === "following" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-slate-900 rounded-full" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab("followers")}
                className={cn(
                  "relative py-2 text-base font-bold transition-colors",
                  activeTab === "followers" ? "text-slate-900" : "text-slate-400"
                )}
              >
                粉丝
                {activeTab === "followers" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-slate-900 rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索用户" 
              className="w-full pl-9 bg-slate-100 border-none rounded-xl h-10 text-sm"
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map(user => (
            <div key={user.id} className="flex items-center gap-3 px-4 py-4 hover:bg-slate-50 transition-colors">
              <img src={user.avatar} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                <div className="text-xs text-slate-500 truncate">{user.bio}</div>
              </div>
              <button 
                onClick={() => handleToggleFollow(user.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center gap-1",
                  user.isFollowing 
                    ? "bg-slate-100 text-slate-600 border border-slate-200" 
                    : "bg-slate-900 text-white shadow-md shadow-slate-200"
                )}
              >
                {user.isFollowing ? (
                  <>
                    <UserCheck className="w-3 h-3" />
                    已关注
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3" />
                    关注
                  </>
                )}
              </button>
            </div>
          ))}
          
          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Search className="w-12 h-12 mb-2 opacity-20" />
              <p className="text-sm">没有找到相关用户</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
