import { useState } from "react";
import Layout from "@/components/Layout";
import { Search, MapPin, Image as ImageIcon, Smile, Mic, Plus, ArrowLeft, MoreHorizontal, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock Data
const CONVERSATIONS = [
  { 
    id: 1, 
    user: "Alice", 
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", 
    lastMessage: "今晚去哪吃？", 
    time: "10:30", 
    unread: 2,
    status: "online"
  },
  { 
    id: 2, 
    user: "Bob", 
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", 
    lastMessage: "[位置] 三里屯太古里", 
    time: "昨天", 
    unread: 0,
    status: "offline"
  },
  { 
    id: 3, 
    user: "Charlie", 
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop", 
    lastMessage: "哈哈哈哈笑死我了", 
    time: "星期一", 
    unread: 0,
    status: "away"
  },
];

const MOCK_MESSAGES = [
  { id: 1, type: "text", content: "Hi Alice! 👋", isMe: true, time: "10:00" },
  { id: 2, type: "text", content: "周末有空吗？想去探店", isMe: false, time: "10:01" },
  { id: 3, type: "text", content: "有啊，想去哪？", isMe: true, time: "10:02" },
  { id: 4, type: "location", content: "三里屯太古里", address: "朝阳区三里屯路19号", isMe: false, time: "10:05" },
  { id: 5, type: "text", content: "这家新开的咖啡店不错", isMe: false, time: "10:05" },
];

export default function ChatPage() {
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      type: "text",
      content: messageText,
      isMe: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  const handleSendLocation = () => {
    const newMessage = {
      id: Date.now(),
      type: "location",
      content: "我的位置",
      address: "北京市朝阳区建国路88号",
      isMe: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <Layout showNav={!activeConversation}>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Main Chat List View */}
        {!activeConversation && (
          <>
            {/* Header */}
            <div className="px-4 pt-safe pb-2 bg-white sticky top-0 z-10">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-slate-900">消息</h1>
                <button className="p-2 bg-slate-100 rounded-full text-slate-600">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="搜索好友或群聊" 
                  className="w-full pl-9 bg-slate-100 border-none rounded-xl h-10 text-sm"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {CONVERSATIONS.map(chat => (
                <div 
                  key={chat.id}
                  onClick={() => setActiveConversation(chat.id)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <img src={chat.avatar} className="w-12 h-12 rounded-full object-cover" />
                    <div className={cn(
                      "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                      chat.status === "online" ? "bg-green-500" : 
                      chat.status === "away" ? "bg-yellow-500" : "bg-slate-300"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-slate-900 text-sm">{chat.user}</h3>
                      <span className="text-xs text-slate-400">{chat.time}</span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                      {chat.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Active Conversation View */}
        <AnimatePresence>
          {activeConversation && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 bg-slate-50 flex flex-col"
            >
              {/* Chat Header */}
              <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 pt-safe pb-3 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveConversation(null)}
                    className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <img 
                        src={CONVERSATIONS.find(c => c.id === activeConversation)?.avatar} 
                        className="w-8 h-8 rounded-full object-cover" 
                      />
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
                    </div>
                    <span className="font-bold text-slate-900">
                      {CONVERSATIONS.find(c => c.id === activeConversation)?.user}
                    </span>
                  </div>
                </div>
                <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <MoreHorizontal className="w-6 h-6" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex gap-2 max-w-[80%]",
                      msg.isMe ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    {!msg.isMe && (
                      <img 
                        src={CONVERSATIONS.find(c => c.id === activeConversation)?.avatar} 
                        className="w-8 h-8 rounded-full object-cover self-end mb-1" 
                      />
                    )}
                    
                    <div className={cn(
                      "rounded-2xl p-3 shadow-sm",
                      msg.isMe ? "bg-blue-500 text-white rounded-br-none" : "bg-white text-slate-900 rounded-bl-none"
                    )}>
                      {msg.type === "text" && (
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      )}
                      
                      {msg.type === "location" && (
                        <div className="flex items-start gap-3 min-w-[200px]">
                          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-sm mb-0.5">{msg.content}</div>
                            <div className="text-xs opacity-80">{msg.address}</div>
                          </div>
                        </div>
                      )}
                      
                      <div className={cn(
                        "text-[10px] mt-1 text-right",
                        msg.isMe ? "text-blue-100" : "text-slate-400"
                      )}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="bg-white border-t border-slate-100 p-3 pb-safe">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                    <Mic className="w-6 h-6" />
                  </button>
                  <div className="flex-1 bg-slate-100 rounded-full flex items-center px-4 py-2 gap-2">
                    <Input 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="发消息..." 
                      className="bg-transparent border-none h-6 p-0 text-sm focus-visible:ring-0 placeholder:text-slate-400"
                    />
                    <button className="text-slate-400 hover:text-slate-600">
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  {messageText.trim() ? (
                    <button 
                      onClick={handleSendMessage}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-sm"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  ) : (
                    <button 
                      onClick={handleSendLocation}
                      className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
