import { useState } from "react";
import Layout from "@/components/Layout";
import { ArrowLeft, Check, X, Clock, Store, Utensils, ChevronRight, Send, Inbox, Filter, CalendarDays, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

// Types
type InviteStatus = "pending" | "accepted" | "declined" | "expired";
type InviteDirection = "sent" | "received";

type InviteRecord = {
  id: number;
  direction: InviteDirection;
  userName: string;
  userAvatar: string;
  merchantName: string;
  merchantImage: string;
  merchantAddress: string;
  packageName: string;
  packagePrice: number;
  packageItems: string[];
  status: InviteStatus;
  createdAt: string;
  expiresAt: string;
};

// Mock Data
const INVITE_RECORDS: InviteRecord[] = [
  {
    id: 1,
    direction: "received",
    userName: "Alice",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    merchantName: "花田错·西餐厅",
    merchantImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop",
    merchantAddress: "朝阳区三里屯路19号3层",
    packageName: "初见·双人轻食套餐",
    packagePrice: 198,
    packageItems: ["意式烟熏三文鱼沙拉", "奶油蘑菇浓汤 ×2", "香煎鸡胸配时蔬", "提拉米苏", "现磨咖啡/饮品 ×2"],
    status: "pending",
    createdAt: "今天 10:30",
    expiresAt: "24小时内有效",
  },
  {
    id: 2,
    direction: "sent",
    userName: "Bob",
    userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    merchantName: "老北京铜锅涮肉",
    merchantImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop",
    merchantAddress: "东城区簋街68号",
    packageName: "兄弟·豪华涮肉套餐",
    packagePrice: 268,
    packageItems: ["精品肥牛卷", "鲜切羊肉", "手工虾滑", "蔬菜拼盘", "老北京酸梅汤 ×2"],
    status: "accepted",
    createdAt: "昨天 15:20",
    expiresAt: "已过期",
  },
  {
    id: 3,
    direction: "sent",
    userName: "Charlie",
    userAvatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop",
    merchantName: "星巴克臻选烘焙工坊",
    merchantImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=200&fit=crop",
    merchantAddress: "静安区南京西路789号",
    packageName: "闺蜜·精致下午茶",
    packagePrice: 158,
    packageItems: ["手冲咖啡 ×2", "提拉米苏", "马卡龙拼盘"],
    status: "declined",
    createdAt: "3天前",
    expiresAt: "已过期",
  },
  {
    id: 4,
    direction: "received",
    userName: "Diana",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    merchantName: "蓝色港湾·日料",
    merchantImage: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=200&fit=crop",
    merchantAddress: "朝阳区蓝色港湾B1层",
    packageName: "纪念日·豪华刺身套餐",
    packagePrice: 388,
    packageItems: ["三文鱼刺身", "金枪鱼大腹", "甜虾", "海胆军舰", "味噌汤 ×2"],
    status: "accepted",
    createdAt: "上周三",
    expiresAt: "已过期",
  },
  {
    id: 5,
    direction: "sent",
    userName: "Eve",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    merchantName: "胡同里的小酒馆",
    merchantImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=200&fit=crop",
    merchantAddress: "东城区五道营胡同23号",
    packageName: "深夜·微醺套餐",
    packagePrice: 228,
    packageItems: ["精酿啤酒 ×4", "烤串拼盘", "毛豆", "花生米"],
    status: "expired",
    createdAt: "2周前",
    expiresAt: "已过期",
  },
  {
    id: 6,
    direction: "received",
    userName: "Frank",
    userAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
    merchantName: "望京小腰·烧烤",
    merchantImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=200&fit=crop",
    merchantAddress: "朝阳区望京SOHO T2",
    packageName: "兄弟·畅吃烧烤套餐",
    packagePrice: 188,
    packageItems: ["烤羊腿", "烤鸡翅 ×6", "烤玉米", "啤酒 ×4"],
    status: "expired",
    createdAt: "3周前",
    expiresAt: "已过期",
  },
];

const statusConfig: Record<InviteStatus, { label: string; color: string; bg: string; textColor: string; icon: typeof Check }> = {
  pending: { label: "待回复", color: "text-orange-500", bg: "bg-orange-50", textColor: "text-orange-600", icon: Clock },
  accepted: { label: "已接受", color: "text-green-600", bg: "bg-green-50", textColor: "text-green-700", icon: Check },
  declined: { label: "已拒绝", color: "text-red-500", bg: "bg-red-50", textColor: "text-red-600", icon: X },
  expired: { label: "已过期", color: "text-slate-400", bg: "bg-slate-100", textColor: "text-slate-500", icon: Clock },
};

type TabType = "all" | "sent" | "received";

export default function InviteHistoryPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<InviteStatus | "all">("all");
  const [records, setRecords] = useState<InviteRecord[]>(INVITE_RECORDS);

  const filteredRecords = records.filter(r => {
    const directionMatch = activeTab === "all" || r.direction === activeTab;
    const statusMatch = statusFilter === "all" || r.status === statusFilter;
    return directionMatch && statusMatch;
  });

  const handleAccept = (id: number) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: "accepted" as InviteStatus } : r));
  };

  const handleDecline = (id: number) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: "declined" as InviteStatus } : r));
  };

  const tabs: { id: TabType; label: string; icon: typeof Send }[] = [
    { id: "all", label: "全部", icon: CalendarDays },
    { id: "sent", label: "我发出的", icon: Send },
    { id: "received", label: "我收到的", icon: Inbox },
  ];

  const statusFilters: { id: InviteStatus | "all"; label: string }[] = [
    { id: "all", label: "全部状态" },
    { id: "pending", label: "待回复" },
    { id: "accepted", label: "已接受" },
    { id: "declined", label: "已拒绝" },
    { id: "expired", label: "已过期" },
  ];

  // Stats
  const sentCount = records.filter(r => r.direction === "sent").length;
  const receivedCount = records.filter(r => r.direction === "received").length;
  const pendingCount = records.filter(r => r.status === "pending").length;
  const acceptedCount = records.filter(r => r.status === "accepted").length;

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center justify-between px-4 h-14">
            <button 
              onClick={() => navigate("/profile")}
              className="p-2 -ml-2 rounded-full active:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h1 className="font-bold text-lg text-slate-900">邀约历史</h1>
            <div className="w-9" />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 text-center border border-slate-100 shadow-sm">
              <div className="text-xl font-bold text-slate-900">{records.length}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">总邀约</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-slate-100 shadow-sm">
              <div className="text-xl font-bold text-blue-600">{sentCount}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">已发出</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-slate-100 shadow-sm">
              <div className="text-xl font-bold text-orange-500">{pendingCount}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">待回复</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-slate-100 shadow-sm">
              <div className="text-xl font-bold text-green-600">{acceptedCount}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">已接受</div>
            </div>
          </div>
        </div>

        {/* Direction Tabs */}
        <div className="px-4 mb-3">
          <div className="flex gap-2 bg-white rounded-xl p-1 border border-slate-100 shadow-sm">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 active:bg-slate-50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Filter */}
        <div className="px-4 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {statusFilters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                  statusFilter === filter.id
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-500 border border-slate-200 active:bg-slate-50"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Records List */}
        <div className="px-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredRecords.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <CalendarDays className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 text-sm">暂无邀约记录</p>
              </motion.div>
            ) : (
              filteredRecords.map((record, index) => {
                const status = statusConfig[record.status];
                const StatusIcon = status.icon;
                const isExpanded = expandedId === record.id;

                return (
                  <motion.div
                    key={record.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                  >
                    {/* Card Main - Clickable */}
                    <div 
                      className="p-4 active:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : record.id)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <img 
                            src={record.userAvatar} 
                            alt={record.userName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div className={cn(
                            "absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white",
                            record.direction === "sent" ? "bg-blue-500" : "bg-purple-500"
                          )}>
                            {record.direction === "sent" 
                              ? <Send className="w-2.5 h-2.5 text-white" />
                              : <Inbox className="w-2.5 h-2.5 text-white" />
                            }
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{record.userName}</span>
                              <span className="text-[10px] text-slate-400 px-1.5 py-0.5 bg-slate-50 rounded">
                                {record.direction === "sent" ? "我邀请的" : "邀请我的"}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">{record.createdAt}</span>
                          </div>

                          {/* Merchant Info */}
                          <div className="flex items-center gap-2 mb-2">
                            <Store className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="text-sm text-slate-700 truncate">{record.merchantName}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Utensils className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="text-xs text-slate-500 truncate">{record.packageName}</span>
                              <span className="text-xs font-bold text-orange-500">¥{record.packagePrice}</span>
                            </div>
                            {/* Status Badge */}
                            <div className={cn(
                              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                              status.bg, status.textColor
                            )}>
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-slate-100">
                            {/* Merchant Image */}
                            <div className="relative h-32 overflow-hidden">
                              <img 
                                src={record.merchantImage} 
                                alt={record.merchantName} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                              <div className="absolute bottom-3 left-4 right-4">
                                <div className="flex items-center gap-1.5 text-white/80 text-xs">
                                  <MapPin className="w-3 h-3" />
                                  {record.merchantAddress}
                                </div>
                              </div>
                            </div>

                            {/* Package Items */}
                            <div className="p-4">
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">套餐内容</h4>
                              <div className="space-y-1.5">
                                {record.packageItems.map((item, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                                    {item}
                                  </div>
                                ))}
                              </div>

                              {/* Action Buttons for pending received invites */}
                              {record.status === "pending" && record.direction === "received" && (
                                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDecline(record.id);
                                    }}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium active:bg-slate-50 transition-colors"
                                  >
                                    婉拒
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAccept(record.id);
                                    }}
                                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform"
                                  >
                                    接受邀约
                                  </button>
                                </div>
                              )}

                              {/* Status message for non-pending */}
                              {record.status !== "pending" && (
                                <div className={cn(
                                  "mt-4 pt-4 border-t border-slate-100 text-center text-sm font-medium",
                                  status.textColor
                                )}>
                                  <div className="flex items-center justify-center gap-2">
                                    <StatusIcon className="w-4 h-4" />
                                    {record.status === "accepted" && record.direction === "sent" && "对方已接受你的邀约"}
                                    {record.status === "accepted" && record.direction === "received" && "你已接受该邀约"}
                                    {record.status === "declined" && record.direction === "sent" && "对方已婉拒你的邀约"}
                                    {record.status === "declined" && record.direction === "received" && "你已婉拒该邀约"}
                                    {record.status === "expired" && "该邀约已过期"}
                                  </div>
                                </div>
                              )}

                              {/* Pending sent status */}
                              {record.status === "pending" && record.direction === "sent" && (
                                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                                  <div className="flex items-center justify-center gap-2 text-sm text-orange-500 font-medium">
                                    <Clock className="w-4 h-4 animate-pulse" />
                                    等待对方回复中...
                                  </div>
                                  <p className="text-[10px] text-slate-400 mt-1">{record.expiresAt}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
