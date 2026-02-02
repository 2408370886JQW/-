import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

// Mock friends data grouped by initial
const FRIENDS_DATA = [
  { letter: "A", list: [
    { id: 1, name: "Alice", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
    { id: 2, name: "Amy", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" }
  ]},
  { letter: "B", list: [
    { id: 3, name: "Bob", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" },
    { id: 4, name: "Bill", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" }
  ]},
  { letter: "C", list: [
    { id: 5, name: "Charlie", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
    { id: 6, name: "Cindy", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" }
  ]},
  { letter: "D", list: [
    { id: 7, name: "David", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" }
  ]}
];

export default function FriendsPage() {
  return (
    <Layout showNav={false}>
      <div className="flex flex-col h-screen bg-white">
        {/* Header */}
        <div className="px-4 pt-safe pb-2 bg-white border-b border-slate-100 sticky top-0 z-10">
          <div className="flex items-center gap-2 mb-4 mt-2">
            <Link href="/profile">
              <button className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors">
                <ChevronLeft className="w-6 h-6 text-slate-900" />
              </button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">我的好友</h1>
          </div>
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="搜索好友" 
              className="pl-9 bg-slate-100 border-none rounded-xl h-10 text-sm"
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {FRIENDS_DATA.map((group) => (
            <div key={group.letter}>
              <div className="px-4 py-1 bg-slate-50 text-xs font-bold text-slate-500 sticky top-0">
                {group.letter}
              </div>
              {group.list.map((friend) => (
                <div 
                  key={friend.id}
                  className="flex items-center gap-3 px-4 py-3 active:bg-slate-50 transition-colors border-b border-slate-50 last:border-none"
                >
                  <Avatar className="w-10 h-10 border border-slate-100">
                    <AvatarImage src={friend.avatar} />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-slate-900">{friend.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Alphabet Index Sidebar */}
        <div className="fixed right-1 top-1/2 -translate-y-1/2 flex flex-col gap-1 items-center py-2 px-1 bg-slate-100/50 rounded-full backdrop-blur-sm">
          {FRIENDS_DATA.map(group => (
            <button 
              key={group.letter}
              className="text-[10px] font-bold text-slate-500 w-4 h-4 flex items-center justify-center rounded-full hover:bg-blue-500 hover:text-white transition-colors"
            >
              {group.letter}
            </button>
          ))}
          <span className="text-[10px] text-slate-400">#</span>
        </div>
      </div>
    </Layout>
  );
}
