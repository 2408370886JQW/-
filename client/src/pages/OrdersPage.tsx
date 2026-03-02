import { useState } from "react";
import Layout from "@/components/Layout";
import { ArrowLeft, ShoppingBag, Store, Utensils, ChevronDown, ChevronUp, Clock, CheckCircle2, XCircle, AlertCircle, QrCode, Copy, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

// Types
type OrderStatus = "unused" | "used" | "refunded" | "expired";

type OrderRecord = {
  id: number;
  orderNo: string;
  merchantName: string;
  merchantImage: string;
  merchantAddress: string;
  packageName: string;
  packagePrice: number;
  packageItems: string[];
  status: OrderStatus;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  usedAt?: string;
  expireAt: string;
  verifyCode?: string;
  inviteUser?: string;
  inviteAvatar?: string;
};

// Mock Data
const ORDER_RECORDS: OrderRecord[] = [
  {
    id: 1,
    orderNo: "ORD20251024001",
    merchantName: "花田错·西餐厅",
    merchantImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop",
    merchantAddress: "朝阳区三里屯路19号3层",
    packageName: "初见·双人轻食套餐",
    packagePrice: 198,
    packageItems: ["意式烟熏三文鱼沙拉", "奶油蘑菇浓汤 ×2", "香煎鸡胸配时蔬", "提拉米苏", "现磨咖啡/饮品 ×2"],
    status: "unused",
    quantity: 1,
    totalPrice: 198,
    createdAt: "2025-10-24 14:30",
    expireAt: "2025-11-24",
    verifyCode: "FM2025102400198",
    inviteUser: "Alice",
    inviteAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    orderNo: "ORD20251022002",
    merchantName: "老北京铜锅涮肉",
    merchantImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=200&fit=crop",
    merchantAddress: "东城区簋街68号",
    packageName: "兄弟·豪华涮肉套餐",
    packagePrice: 268,
    packageItems: ["精品肥牛 ×2", "鲜切羊肉 ×2", "手工虾滑", "蔬菜拼盘", "老北京芝麻烧饼 ×4", "酸梅汤 ×2"],
    status: "unused",
    quantity: 1,
    totalPrice: 268,
    createdAt: "2025-10-22 18:15",
    expireAt: "2025-11-22",
    verifyCode: "FM2025102200268",
    inviteUser: "Bob",
    inviteAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    orderNo: "ORD20251015003",
    merchantName: "TRB Hutong",
    merchantImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=200&fit=crop",
    merchantAddress: "东城区五道营胡同23号",
    packageName: "纪念日·浪漫法式晚餐",
    packagePrice: 688,
    packageItems: ["鹅肝慕斯配无花果", "龙虾浓汤", "慢煮和牛配松露酱", "法式焦糖布丁", "香槟 ×2"],
    status: "used",
    quantity: 1,
    totalPrice: 688,
    createdAt: "2025-10-15 12:00",
    usedAt: "2025-10-18 19:30",
    expireAt: "2025-11-15",
  },
  {
    id: 4,
    orderNo: "ORD20251010004",
    merchantName: "Algorithm 算法咖啡",
    merchantImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=200&fit=crop",
    merchantAddress: "朝阳区工体北路8号",
    packageName: "闺蜜·下午茶甜蜜套餐",
    packagePrice: 128,
    packageItems: ["手冲咖啡 ×2", "提拉米苏", "草莓千层", "马卡龙 ×4"],
    status: "used",
    quantity: 1,
    totalPrice: 128,
    createdAt: "2025-10-10 10:00",
    usedAt: "2025-10-12 15:00",
    expireAt: "2025-11-10",
    inviteUser: "小美",
    inviteAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: 5,
    orderNo: "ORD20250920005",
    merchantName: "隐泉日料",
    merchantImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=200&fit=crop",
    merchantAddress: "海淀区中关村大街1号",
    packageName: "双人·精选寿司套餐",
    packagePrice: 358,
    packageItems: ["三文鱼刺身", "金枪鱼寿司 ×4", "鳗鱼卷 ×2", "味噌汤 ×2", "抹茶冰淇淋 ×2"],
    status: "expired",
    quantity: 1,
    totalPrice: 358,
    createdAt: "2025-09-20 16:00",
    expireAt: "2025-10-20",
  },
  {
    id: 6,
    orderNo: "ORD20250905006",
    merchantName: "蜀道难·川菜馆",
    merchantImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=200&fit=crop",
    merchantAddress: "朝阳区望京SOHO T1",
    packageName: "聚会·麻辣盛宴套餐",
    packagePrice: 188,
    packageItems: ["水煮鱼", "麻婆豆腐", "宫保鸡丁", "蒜泥白肉", "米饭 ×4", "酸梅汤 ×4"],
    status: "refunded",
    quantity: 1,
    totalPrice: 188,
    createdAt: "2025-09-05 11:30",
    expireAt: "2025-10-05",
  },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  unused: { label: "待使用", color: "text-green-600", bg: "bg-green-50", icon: Clock },
  used: { label: "已使用", color: "text-slate-500", bg: "bg-slate-100", icon: CheckCircle2 },
  refunded: { label: "已退款", color: "text-orange-600", bg: "bg-orange-50", icon: XCircle },
  expired: { label: "已过期", color: "text-red-500", bg: "bg-red-50", icon: AlertCircle },
};

type FilterTab = "all" | "unused" | "used" | "refunded" | "expired";

export default function OrdersPage() {
  const [, setLocation] = useLocation();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "全部" },
    { key: "unused", label: "待使用" },
    { key: "used", label: "已使用" },
    { key: "refunded", label: "已退款" },
    { key: "expired", label: "已过期" },
  ];

  const filteredOrders = ORDER_RECORDS.filter(order => {
    if (activeFilter === "all") return true;
    return order.status === activeFilter;
  });

  // Stats
  const totalOrders = ORDER_RECORDS.length;
  const unusedCount = ORDER_RECORDS.filter(o => o.status === "unused").length;
  const totalSpent = ORDER_RECORDS.filter(o => o.status !== "refunded").reduce((sum, o) => sum + o.totalPrice, 0);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              onClick={() => setLocation("/profile")}
              className="p-2 -ml-2 rounded-full active:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-900" />
            </button>
            <h1 className="font-bold text-lg text-slate-900">我的订单</h1>
            <div className="w-9" />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 text-center border border-slate-100 shadow-sm">
              <div className="text-2xl font-bold text-slate-900">{totalOrders}</div>
              <div className="text-xs text-slate-400 mt-1">总订单</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-slate-100 shadow-sm">
              <div className="text-2xl font-bold text-green-600">{unusedCount}</div>
              <div className="text-xs text-slate-400 mt-1">待使用</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-slate-100 shadow-sm">
              <div className="text-2xl font-bold text-orange-500">¥{totalSpent}</div>
              <div className="text-xs text-slate-400 mt-1">累计消费</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 mb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeFilter === tab.key
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 border border-slate-200"
                )}
              >
                {tab.label}
                {tab.key !== "all" && (
                  <span className="ml-1 text-xs opacity-70">
                    {ORDER_RECORDS.filter(o => o.status === tab.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Order List */}
        <div className="px-4 space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <ShoppingBag className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">暂无相关订单</p>
            </div>
          ) : (
            filteredOrders.map(order => {
              const statusConfig = STATUS_CONFIG[order.status];
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedId === order.id;

              return (
                <motion.div
                  key={order.id}
                  layout
                  className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
                >
                  {/* Order Card Header */}
                  <div
                    className="p-4 cursor-pointer active:bg-slate-50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Merchant Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={order.merchantImage} className="w-full h-full object-cover" />
                      </div>

                      {/* Order Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-slate-900 text-sm truncate">{order.merchantName}</h3>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 flex items-center gap-1",
                            statusConfig.bg, statusConfig.color
                          )}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 truncate">{order.packageName}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-orange-500">¥{order.totalPrice}</span>
                          <span className="text-xs text-slate-400">{order.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Invite User Badge */}
                    {order.inviteUser && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50">
                        <img src={order.inviteAvatar} className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-xs text-slate-500">与 <span className="font-medium text-slate-700">{order.inviteUser}</span> 的邀约订单</span>
                      </div>
                    )}

                    {/* Expand Indicator */}
                    <div className="flex justify-center mt-2">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-300" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-300" />
                      )}
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
                        <div className="px-4 pb-4 border-t border-slate-100">
                          {/* Merchant Image Full */}
                          <div className="mt-3 rounded-lg overflow-hidden h-32">
                            <img src={order.merchantImage} className="w-full h-full object-cover" />
                          </div>

                          {/* Merchant Address */}
                          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {order.merchantAddress}
                          </div>

                          {/* Package Items */}
                          <div className="mt-3">
                            <div className="flex items-center gap-1.5 mb-2">
                              <Utensils className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs font-medium text-slate-700">套餐内容</span>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3">
                              {order.packageItems.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 py-1">
                                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                                  <span className="text-xs text-slate-600">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">订单编号</span>
                              <span className="text-slate-600 font-mono">{order.orderNo}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">下单时间</span>
                              <span className="text-slate-600">{order.createdAt}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">有效期至</span>
                              <span className="text-slate-600">{order.expireAt}</span>
                            </div>
                            {order.usedAt && (
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400">使用时间</span>
                                <span className="text-slate-600">{order.usedAt}</span>
                              </div>
                            )}
                          </div>

                          {/* Verify Code (for unused orders) */}
                          {order.status === "unused" && order.verifyCode && (
                            <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <QrCode className="w-4 h-4 text-green-600" />
                                  <span className="text-sm font-bold text-green-700">核销码</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyCode(order.verifyCode!);
                                  }}
                                  className={cn(
                                    "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                                    copiedCode === order.verifyCode
                                      ? "bg-green-200 text-green-800"
                                      : "bg-green-100 text-green-600 active:bg-green-200"
                                  )}
                                >
                                  <Copy className="w-3 h-3" />
                                  {copiedCode === order.verifyCode ? "已复制" : "复制"}
                                </button>
                              </div>
                              <div className="text-center py-3 bg-white rounded-lg border border-green-100">
                                <span className="text-2xl font-bold font-mono tracking-widest text-green-700">
                                  {order.verifyCode}
                                </span>
                              </div>
                              <p className="text-xs text-green-600 mt-2 text-center">到店出示核销码即可使用</p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="mt-4 flex gap-2">
                            {order.status === "unused" && (
                              <>
                                <button className="flex-1 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl active:scale-[0.98] transition-transform">
                                  到店核销
                                </button>
                                <button className="px-4 py-2.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl active:scale-[0.98] transition-transform">
                                  申请退款
                                </button>
                              </>
                            )}
                            {order.status === "used" && (
                              <button className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl active:scale-[0.98] transition-transform">
                                再来一单
                              </button>
                            )}
                            {order.status === "expired" && (
                              <button className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl active:scale-[0.98] transition-transform">
                                重新购买
                              </button>
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
        </div>
      </div>
    </Layout>
  );
}
