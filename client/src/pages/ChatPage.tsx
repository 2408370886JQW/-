import { useState } from "react";
import Layout from "@/components/Layout";
import { Search, MapPin, Image as ImageIcon, Smile, Mic, Plus, ArrowLeft, MoreHorizontal, Send, Check, X, Clock, Store, Utensils, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Types
type InviteStatus = "pending" | "accepted" | "declined" | "expired";

type InviteCardData = {
  inviterName: string;
  inviterAvatar: string;
  inviteeName: string;
  inviteeAvatar: string;
  merchantName: string;
  merchantImage: string;
  merchantAddress: string;
  packageName: string;
  packagePrice: number;
  packageItems: string[];
  expiresAt: string;
  status: InviteStatus;
};

type Message = {
  id: number;
  type: "text" | "location" | "invite";
  content: string;
  isMe: boolean;
  timestamp: number;
  address?: string;
  inviteData?: InviteCardData;
};

type Conversation = {
  id: number;
  user: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: "online" | "offline" | "away";
};

// Mock Data
const CONVERSATIONS: Conversation[] = [
  { 
    id: 1, 
    user: "Alice", 
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", 
    lastMessage: "[邀约卡片] 约你一起去花田错·西餐厅", 
    time: "10:30", 
    unread: 1,
    status: "online"
  },
  { 
    id: 2, 
    user: "Bob", 
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", 
    lastMessage: "[邀约卡片] 已接受邀约", 
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

// Helper to generate timestamps for mock data
const now = new Date();
const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

// Mock messages per conversation
const MOCK_MESSAGES_BY_CONVERSATION: Record<number, Message[]> = {
  1: [
    { id: 1, type: "text", content: "Hi Alice! 👋", isMe: true, timestamp: lastWeek.getTime() },
    { id: 2, type: "text", content: "周末有空吗？想去探店", isMe: false, timestamp: yesterday.getTime() },
    { id: 3, type: "text", content: "有啊，想去哪？", isMe: true, timestamp: fiveMinutesAgo.getTime() },
    { 
      id: 4, 
      type: "invite", 
      content: "邀约卡片", 
      isMe: false, 
      timestamp: now.getTime(),
      inviteData: {
        inviterName: "Alice",
        inviterAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        inviteeName: "我",
        inviteeAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
        merchantName: "花田错·西餐厅",
        merchantImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop",
        merchantAddress: "朝阳区三里屯路19号3层",
        packageName: "初见·双人轻食套餐",
        packagePrice: 198,
        packageItems: ["意式烟熏三文鱼沙拉", "奶油蘑菇浓汤 ×2", "香煎鸡胸配时蔬", "提拉米苏", "现磨咖啡/饮品 ×2"],
        expiresAt: "24小时内有效",
        status: "pending"
      }
    },
  ],
  2: [
    { id: 10, type: "text", content: "Bob，周末一起聚聚？", isMe: true, timestamp: lastWeek.getTime() },
    { id: 11, type: "text", content: "好啊！去哪？", isMe: false, timestamp: lastWeek.getTime() + 60000 },
    { 
      id: 12, 
      type: "invite", 
      content: "邀约卡片", 
      isMe: true, 
      timestamp: yesterday.getTime(),
      inviteData: {
        inviterName: "我",
        inviterAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
        inviteeName: "Bob",
        inviteeAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
        merchantName: "老北京铜锅涮肉",
        merchantImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop",
        merchantAddress: "东城区簋街68号",
        packageName: "兄弟·豪华涮肉套餐",
        packagePrice: 268,
        packageItems: ["精品肥牛卷", "鲜切羊肉", "手工虾滑", "蔬菜拼盘", "老北京酸梅汤 ×2"],
        expiresAt: "已过期",
        status: "accepted"
      }
    },
    { id: 13, type: "text", content: "太棒了！到时候见 🎉", isMe: false, timestamp: yesterday.getTime() + 120000 },
  ],
  3: [
    { id: 20, type: "text", content: "哈哈哈哈笑死我了", isMe: false, timestamp: lastWeek.getTime() },
    { id: 21, type: "text", content: "什么事这么好笑？", isMe: true, timestamp: lastWeek.getTime() + 60000 },
  ],
};

// Time formatting utility
const formatMessageTime = (timestamp: number, prevTimestamp?: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - timestamp;
  const isSameDay = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  const isYesterday = new Date(now.getTime() - 86400000).getDate() === date.getDate();
  const isWithinWeek = diff < 7 * 86400000;

  // Check if we should show time based on interval (5 minutes)
  if (prevTimestamp && timestamp - prevTimestamp < 5 * 60 * 1000) {
    return null;
  }

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isSameDay) {
    return timeStr;
  } else if (isYesterday) {
    return `昨天 ${timeStr}`;
  } else if (isWithinWeek) {
    const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    return `${weekDays[date.getDay()]} ${timeStr}`;
  } else {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${timeStr}`;
  }
};

// Invite Card Component
function InviteCard({ data, isMe, onAccept, onDecline }: { 
  data: InviteCardData; 
  isMe: boolean; 
  onAccept?: () => void; 
  onDecline?: () => void;
}) {
  const statusConfig = {
    pending: { label: "待回复", color: "text-orange-500", bg: "bg-orange-50", icon: Clock },
    accepted: { label: "已接受", color: "text-green-600", bg: "bg-green-50", icon: Check },
    declined: { label: "已拒绝", color: "text-red-500", bg: "bg-red-50", icon: X },
    expired: { label: "已过期", color: "text-slate-400", bg: "bg-slate-50", icon: Clock },
  };

  const statusInfo = statusConfig[data.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="w-[280px] rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-white">
      {/* Card Header - Gradient */}
      <div className="relative h-28 overflow-hidden">
        <img src={data.merchantImage} alt={data.merchantName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
        
        {/* Avatars overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="flex -space-x-2">
            <img src={data.inviterAvatar} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover relative z-10" />
            <img src={data.inviteeAvatar} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
          </div>
          <div className="text-white">
            <p className="text-[11px] font-bold leading-tight">
              {isMe ? `邀请 ${data.inviteeName}` : `${data.inviterName} 邀请你`}
            </p>
            <p className="text-[10px] text-white/70">一起去吃好的</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={cn("absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1", statusInfo.bg, statusInfo.color)}>
          <StatusIcon className="w-3 h-3" />
          {statusInfo.label}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3">
        {/* Merchant Info */}
        <div className="flex items-start gap-2 mb-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Store className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 text-[13px] leading-tight truncate">{data.merchantName}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{data.merchantAddress}</p>
          </div>
        </div>

        {/* Package Info */}
        <div className="flex items-start gap-2 mb-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Utensils className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 text-[13px] leading-tight truncate">{data.packageName}</p>
            <p className="text-[13px] text-orange-500 font-bold mt-0.5">¥{data.packagePrice}</p>
          </div>
        </div>

        {/* Package Items */}
        <div className="bg-slate-50 rounded-lg p-2 mb-2.5">
          <div className="flex flex-wrap gap-1">
            {data.packageItems.slice(0, 3).map((item, i) => (
              <span key={i} className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded">{item}</span>
            ))}
            {data.packageItems.length > 3 && (
              <span className="text-[10px] text-slate-400">+{data.packageItems.length - 3}项</span>
            )}
          </div>
        </div>

        {/* Expiry */}
        <div className="flex items-center gap-1 mb-3">
          <CalendarDays className="w-3 h-3 text-slate-400" />
          <span className="text-[10px] text-slate-400">{data.expiresAt}</span>
        </div>

        {/* Action Buttons - Only show for received pending invites */}
        {!isMe && data.status === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={onDecline}
              className="flex-1 py-2 rounded-full border border-slate-200 text-slate-600 text-xs font-bold active:scale-95 transition-all hover:bg-slate-50"
            >
              婉拒
            </button>
            <button
              onClick={onAccept}
              className="flex-1 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold active:scale-95 transition-all shadow-sm"
            >
              接受邀约
            </button>
          </div>
        )}

        {/* Status display for non-pending */}
        {data.status === "accepted" && (
          <div className="flex items-center justify-center gap-1.5 py-2 rounded-full bg-green-50 text-green-600">
            <Check className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">{isMe ? "对方已接受邀约" : "你已接受邀约"}</span>
          </div>
        )}
        {data.status === "declined" && (
          <div className="flex items-center justify-center gap-1.5 py-2 rounded-full bg-red-50 text-red-400">
            <X className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">{isMe ? "对方已婉拒" : "你已婉拒此邀约"}</span>
          </div>
        )}
        {data.status === "expired" && (
          <div className="flex items-center justify-center gap-1.5 py-2 rounded-full bg-slate-50 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">邀约已过期</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [allMessages, setAllMessages] = useState<Record<number, Message[]>>(MOCK_MESSAGES_BY_CONVERSATION);

  const currentMessages = activeConversation ? (allMessages[activeConversation] || []) : [];

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversation) return;
    
    const newMessage: Message = {
      id: Date.now(),
      type: "text",
      content: messageText,
      isMe: true,
      timestamp: Date.now()
    };
    
    setAllMessages(prev => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation] || []), newMessage]
    }));
    setMessageText("");
  };

  const handleSendLocation = () => {
    if (!activeConversation) return;
    const newMessage: Message = {
      id: Date.now(),
      type: "location",
      content: "我的位置",
      address: "北京市朝阳区建国路88号",
      isMe: true,
      timestamp: Date.now()
    };
    setAllMessages(prev => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation] || []), newMessage]
    }));
  };

  const handleAcceptInvite = (messageId: number) => {
    if (!activeConversation) return;
    setAllMessages(prev => {
      const msgs = prev[activeConversation] || [];
      return {
        ...prev,
        [activeConversation]: msgs.map(msg => {
          if (msg.id === messageId && msg.inviteData) {
            return {
              ...msg,
              inviteData: { ...msg.inviteData, status: "accepted" as InviteStatus }
            };
          }
          return msg;
        })
      };
    });

    // Add a system-like response message
    const responseMsg: Message = {
      id: Date.now(),
      type: "text",
      content: "我已接受你的邀约，到时候见！🎉",
      isMe: true,
      timestamp: Date.now()
    };
    setTimeout(() => {
      setAllMessages(prev => ({
        ...prev,
        [activeConversation]: [...(prev[activeConversation] || []), responseMsg]
      }));
    }, 300);
  };

  const handleDeclineInvite = (messageId: number) => {
    if (!activeConversation) return;
    setAllMessages(prev => {
      const msgs = prev[activeConversation] || [];
      return {
        ...prev,
        [activeConversation]: msgs.map(msg => {
          if (msg.id === messageId && msg.inviteData) {
            return {
              ...msg,
              inviteData: { ...msg.inviteData, status: "declined" as InviteStatus }
            };
          }
          return msg;
        })
      };
    });

    const responseMsg: Message = {
      id: Date.now(),
      type: "text",
      content: "抱歉这次去不了，下次再约吧 😊",
      isMe: true,
      timestamp: Date.now()
    };
    setTimeout(() => {
      setAllMessages(prev => ({
        ...prev,
        [activeConversation]: [...(prev[activeConversation] || []), responseMsg]
      }));
    }, 300);
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
                    <img src={chat.avatar} alt={chat.user} className="w-12 h-12 rounded-full object-cover" />
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
                    <p className={cn(
                      "text-sm truncate",
                      chat.lastMessage.startsWith("[邀约卡片]") ? "text-orange-500 font-medium" : "text-slate-500"
                    )}>{chat.lastMessage}</p>
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
                        alt={CONVERSATIONS.find(c => c.id === activeConversation)?.user || "User"}
                        className="w-8 h-8 rounded-full object-cover" 
                      />
                      <div className={cn(
                        "absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white",
                        CONVERSATIONS.find(c => c.id === activeConversation)?.status === "online" ? "bg-green-500" : 
                        CONVERSATIONS.find(c => c.id === activeConversation)?.status === "away" ? "bg-yellow-500" : "bg-slate-300"
                      )} />
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
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {currentMessages.map((msg, index) => {
                  const prevMsg = currentMessages[index - 1];
                  const timeDisplay = formatMessageTime(msg.timestamp, prevMsg?.timestamp);

                  return (
                    <div key={msg.id} className="space-y-4">
                      {/* Time Separator */}
                      {timeDisplay && (
                        <div className="flex justify-center">
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                            {timeDisplay}
                          </span>
                        </div>
                      )}

                      {/* Invite Card Message */}
                      {msg.type === "invite" && msg.inviteData && (
                        <div className={cn(
                          "flex gap-2",
                          msg.isMe ? "ml-auto flex-row-reverse justify-start" : "justify-start"
                        )}>
                          {!msg.isMe && (
                            <img 
                              src={CONVERSATIONS.find(c => c.id === activeConversation)?.avatar} 
                              alt="User Avatar"
                              className="w-8 h-8 rounded-full object-cover self-start mt-1" 
                            />
                          )}
                          <InviteCard 
                            data={msg.inviteData} 
                            isMe={msg.isMe}
                            onAccept={() => handleAcceptInvite(msg.id)}
                            onDecline={() => handleDeclineInvite(msg.id)}
                          />
                        </div>
                      )}

                      {/* Text / Location Message Bubble */}
                      {msg.type !== "invite" && (
                        <div 
                          className={cn(
                            "flex gap-2 max-w-[80%]",
                            msg.isMe ? "ml-auto flex-row-reverse" : ""
                          )}
                        >
                          {!msg.isMe && (
                            <img 
                              src={CONVERSATIONS.find(c => c.id === activeConversation)?.avatar} 
                              alt="User Avatar"
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
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
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
