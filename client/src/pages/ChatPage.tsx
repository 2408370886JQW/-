import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const MOCK_CHATS = [
  {
    id: 1,
    name: "周末约饭小分队",
    avatar: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=100&h=100&fit=crop",
    lastMessage: "周五晚上老地方见？",
    time: "10:30",
    unread: 2,
    isGroup: true
  },
  {
    id: 2,
    name: "Alice",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    lastMessage: "刚才那个餐厅看起来不错！",
    time: "昨天",
    unread: 0,
    isGroup: false
  },
  {
    id: 3,
    name: "Bob",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
    lastMessage: "图片",
    time: "昨天",
    unread: 0,
    isGroup: false
  },
  {
    id: 4,
    name: "摄影交流群",
    avatar: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop",
    lastMessage: "有人这周末去奥森拍照吗？",
    time: "星期一",
    unread: 5,
    isGroup: true
  }
];

export default function ChatPage() {
  return (
    <Layout showNav={true}>
      <div className="flex flex-col h-screen bg-white">
        {/* Header */}
        <div className="px-4 pt-safe pb-2 bg-white border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-900 mb-4 mt-2">消息</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="搜索聊天记录" 
              className="pl-9 bg-slate-100 border-none rounded-xl h-10 text-sm"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {MOCK_CHATS.map((chat) => (
            <div 
              key={chat.id}
              className="flex items-center gap-3 px-4 py-4 active:bg-slate-50 transition-colors border-b border-slate-50 last:border-none"
            >
              <div className="relative">
                <Avatar className="w-12 h-12 border border-slate-100">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                {chat.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-[10px] font-bold text-white">{chat.unread}</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-slate-900 truncate pr-2">{chat.name}</h3>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{chat.time}</span>
                </div>
                <p className="text-sm text-slate-500 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
