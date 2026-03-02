import { useState } from "react";
import Layout from "@/components/Layout";
import { ArrowLeft, ShoppingBag, Store, Utensils, ChevronDown, ChevronUp, Clock, CheckCircle2, XCircle, AlertCircle, QrCode, Copy, MapPin, Star, X, MessageSquare, ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

// Types
type OrderStatus = "unused" | "used" | "refunded" | "expired";

type ReviewData = {
  rating: number;
  comment: string;
  tags: string[];
  createdAt: string;
};

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
  review?: ReviewData;
};

// Review Tags
const REVIEW_TAGS = [
  "味道很棒", "环境优雅", "服务周到", "性价比高",
  "分量充足", "上菜很快", "适合约会", "值得再来",
  "拍照好看", "交通方便"
];

// Mock Data
const INITIAL_ORDERS: OrderRecord[] = [
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
    review: {
      rating: 5,
      comment: "和闺蜜度过了一个美好的下午，咖啡很香，甜点也很精致！环境特别适合拍照，下次还来～",
      tags: ["味道很棒", "环境优雅", "拍照好看", "适合约会"],
      createdAt: "2025-10-13 10:30",
    },
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
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);

  // Review modal state
  const [reviewingOrder, setReviewingOrder] = useState<OrderRecord | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewTags, setReviewTags] = useState<string[]>([]);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "全部" },
    { key: "unused", label: "待使用" },
    { key: "used", label: "已使用" },
    { key: "refunded", label: "已退款" },
    { key: "expired", label: "已过期" },
  ];

  const filteredOrders = orders.filter(order => {
    if (activeFilter === "all") return true;
    return order.status === activeFilter;
  });

  // Stats
  const totalOrders = orders.length;
  const unusedCount = orders.filter(o => o.status === "unused").length;
  const totalSpent = orders.filter(o => o.status !== "refunded").reduce((sum, o) => sum + o.totalPrice, 0);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openReviewModal = (order: OrderRecord) => {
    setReviewingOrder(order);
    setReviewRating(5);
    setReviewComment("");
    setReviewTags([]);
    setReviewSubmitting(false);
    setReviewSuccess(false);
  };

  const closeReviewModal = () => {
    setReviewingOrder(null);
    setReviewSuccess(false);
  };

  const toggleReviewTag = (tag: string) => {
    setReviewTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const submitReview = () => {
    if (!reviewingOrder) return;
    setReviewSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newReview: ReviewData = {
        rating: reviewRating,
        comment: reviewComment,
        tags: reviewTags,
        createdAt: new Date().toLocaleString("zh-CN", {
          year: "numeric", month: "2-digit", day: "2-digit",
          hour: "2-digit", minute: "2-digit"
        }).replace(/\//g, "-"),
      };

      setOrders(prev => prev.map(o =>
        o.id === reviewingOrder.id ? { ...o, review: newReview } : o
      ));

      setReviewSubmitting(false);
      setReviewSuccess(true);
    }, 800);
  };

  // Star rating component
  const StarRating = ({ rating, onRate, size = "lg" }: { rating: number; onRate?: (r: number) => void; size?: "sm" | "lg" }) => {
    const starSize = size === "lg" ? "w-8 h-8" : "w-4 h-4";
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <motion.button
            key={star}
            whileTap={onRate ? { scale: 1.3 } : undefined}
            onClick={() => onRate?.(star)}
            className={cn(
              "transition-colors",
              onRate ? "cursor-pointer" : "cursor-default"
            )}
          >
            <Star
              className={cn(
                starSize,
                star <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-200 text-slate-200"
              )}
            />
          </motion.button>
        ))}
      </div>
    );
  };

  const ratingText = (r: number) => {
    if (r === 5) return "非常满意";
    if (r === 4) return "比较满意";
    if (r === 3) return "一般般";
    if (r === 2) return "不太满意";
    return "很不满意";
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
                    {orders.filter(o => o.status === tab.key).length}
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

                    {/* Review Preview (collapsed) - show star rating inline */}
                    {order.review && !isExpanded && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-50">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={cn("w-3 h-3", s <= order.review!.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200")} />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400 truncate flex-1">"{order.review.comment}"</span>
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

                          {/* Review Display (for reviewed orders) */}
                          {order.review && (
                            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <MessageSquare className="w-4 h-4 text-amber-600" />
                                <span className="text-sm font-bold text-amber-700">我的评价</span>
                                <span className="text-xs text-amber-500 ml-auto">{order.review.createdAt}</span>
                              </div>

                              {/* Stars */}
                              <div className="flex items-center gap-2 mb-3">
                                <StarRating rating={order.review.rating} size="sm" />
                                <span className="text-xs font-medium text-amber-600">{ratingText(order.review.rating)}</span>
                              </div>

                              {/* Tags */}
                              {order.review.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {order.review.tags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Comment */}
                              {order.review.comment && (
                                <p className="text-sm text-slate-700 leading-relaxed bg-white rounded-lg p-3 border border-amber-100">
                                  "{order.review.comment}"
                                </p>
                              )}
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
                            {order.status === "used" && !order.review && (
                              <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openReviewModal(order);
                                }}
                                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-amber-200/50"
                              >
                                <Star className="w-4 h-4" />
                                去评价
                              </motion.button>
                            )}
                            {order.status === "used" && (
                              <button className={cn(
                                "py-2.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl active:scale-[0.98] transition-transform",
                                order.review ? "flex-1" : "px-4"
                              )}>
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

      {/* Review Modal */}
      <AnimatePresence>
        {reviewingOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
            onClick={closeReviewModal}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-white rounded-t-3xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {!reviewSuccess ? (
                <>
                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">评价订单</h2>
                      <p className="text-xs text-slate-400 mt-0.5">{reviewingOrder.merchantName} · {reviewingOrder.packageName}</p>
                    </div>
                    <button
                      onClick={closeReviewModal}
                      className="p-2 rounded-full bg-slate-100 active:bg-slate-200 transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>

                  <div className="px-5 pb-8 max-h-[70vh] overflow-y-auto">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center py-5 bg-gradient-to-b from-amber-50 to-white rounded-2xl mb-4">
                      <p className="text-sm text-slate-500 mb-3">整体体验如何？</p>
                      <StarRating rating={reviewRating} onRate={setReviewRating} />
                      <motion.p
                        key={reviewRating}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm font-bold text-amber-600 mt-3"
                      >
                        {ratingText(reviewRating)}
                      </motion.p>
                    </div>

                    {/* Quick Tags */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-slate-700 mb-2.5">选择标签</p>
                      <div className="flex flex-wrap gap-2">
                        {REVIEW_TAGS.map(tag => (
                          <motion.button
                            key={tag}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleReviewTag(tag)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                              reviewTags.includes(tag)
                                ? "bg-amber-500 text-white border-amber-500"
                                : "bg-white text-slate-600 border-slate-200 active:bg-slate-50"
                            )}
                          >
                            {reviewTags.includes(tag) && <span className="mr-1">✓</span>}
                            {tag}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Comment Input */}
                    <div className="mb-5">
                      <p className="text-sm font-medium text-slate-700 mb-2.5">写下你的感受</p>
                      <textarea
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        placeholder="分享你的用餐体验，帮助更多人做出选择..."
                        className="w-full h-28 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all"
                        maxLength={500}
                      />
                      <div className="flex justify-end mt-1">
                        <span className="text-xs text-slate-300">{reviewComment.length}/500</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={submitReview}
                      disabled={reviewSubmitting}
                      className={cn(
                        "w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                        reviewSubmitting
                          ? "bg-slate-200 text-slate-400"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200/50 active:shadow-md"
                      )}
                    >
                      {reviewSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full"
                          />
                          提交中...
                        </>
                      ) : (
                        <>
                          <ThumbsUp className="w-4 h-4" />
                          提交评价
                        </>
                      )}
                    </motion.button>
                  </div>
                </>
              ) : (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-12 px-5"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">评价成功！</h3>
                  <p className="text-sm text-slate-500 mb-8">感谢你的评价，帮助更多人发现好去处</p>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={closeReviewModal}
                    className="w-full py-3.5 bg-slate-900 text-white text-sm font-bold rounded-xl"
                  >
                    完成
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
