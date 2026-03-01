import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import { ArrowLeft, Clock, Check, X, MapPin, ChevronRight, ScanLine, AlertCircle, ShoppingBag, Filter, Star, MessageSquare, Send, ThumbsUp, Store, Reply, BadgeCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

// Order status types
type OrderStatus = "unused" | "used" | "expired";
type FilterType = "all" | "unused" | "used" | "expired";

interface MerchantReply {
  content: string;
  time: string; // ISO string
  merchantName: string;
}

interface ReviewData {
  rating: number; // 1-5
  text: string;
  tags: string[];
  time: string; // ISO string
  merchantReply?: MerchantReply;
}

interface OrderItem {
  id: string;
  packageName: string;
  restaurantName: string;
  restaurantImage: string;
  restaurantLocation: string;
  price: number;
  originalPrice: number;
  orderTime: string; // ISO string
  expireTime: string; // ISO string
  status: OrderStatus;
  verifyCode: string;
  paymentMethod: "wechat" | "alipay";
  packageContent: string[];
  scenarioTag?: string;
  review?: ReviewData;
}

// Review quick tags
const REVIEW_TAGS = [
  "味道很好", "环境优雅", "服务周到", "性价比高",
  "分量十足", "上菜很快", "适合约会", "值得再来",
  "拍照好看", "交通方便", "氛围感强", "推荐朋友"
];

// Mock order data
const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "ORD20260301001",
    packageName: "浪漫双人晚餐",
    restaurantName: "花田错·创意融合餐厅",
    restaurantImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop",
    restaurantLocation: "朝阳区三里屯太古里北区B1层",
    price: 258,
    originalPrice: 588,
    orderTime: "2026-03-01T14:30:00",
    expireTime: "2026-03-15T23:59:59",
    status: "unused",
    verifyCode: "8829 1034",
    paymentMethod: "wechat",
    packageContent: ["招牌前菜拼盘×1", "主厨特选牛排×2", "甜品×2", "饮品×2"],
    scenarioTag: "初次见面"
  },
  {
    id: "ORD20260228002",
    packageName: "闺蜜下午茶套餐",
    restaurantName: "云端Sky Lounge",
    restaurantImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&h=200&fit=crop",
    restaurantLocation: "朝阳区国贸三期80层",
    price: 328,
    originalPrice: 698,
    orderTime: "2026-02-28T10:15:00",
    expireTime: "2026-03-10T23:59:59",
    status: "unused",
    verifyCode: "7756 2091",
    paymentMethod: "alipay",
    packageContent: ["精选三层下午茶架×1", "手冲咖啡×2", "特调鸡尾酒×2"],
    scenarioTag: "闺蜜聚会"
  },
  {
    id: "ORD20260225003",
    packageName: "兄弟烧烤畅饮套餐",
    restaurantName: "炭火青春·烤肉酒馆",
    restaurantImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop",
    restaurantLocation: "海淀区五道口华联商厦3层",
    price: 168,
    originalPrice: 356,
    orderTime: "2026-02-25T18:00:00",
    expireTime: "2026-03-05T23:59:59",
    status: "used",
    verifyCode: "3341 8872",
    paymentMethod: "wechat",
    packageContent: ["烤肉拼盘×1", "啤酒6瓶", "小食拼盘×1", "主食×2"],
    scenarioTag: "兄弟小聚",
    review: {
      rating: 5,
      text: "烤肉很好吃，啤酒也很畅快！和兄弟们聚在一起很开心，下次还来！",
      tags: ["味道很好", "性价比高", "氛围感强"],
      time: "2026-02-26T20:30:00",
      merchantReply: {
        content: "感谢您的好评！很高兴您和朋友们度过了愉快的时光。下次来店里记得找前台领取一份小食拼盘，算是我们的一点心意～期待再次见到您！",
        time: "2026-02-27T10:15:00",
        merchantName: "炭火青春·烤肉酒馆"
      }
    }
  },
  {
    id: "ORD20260210004",
    packageName: "情人节特别套餐",
    restaurantName: "丝路有约·新疆风味",
    restaurantImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&h=200&fit=crop",
    restaurantLocation: "东城区簋街118号",
    price: 198,
    originalPrice: 456,
    orderTime: "2026-02-10T12:00:00",
    expireTime: "2026-02-20T23:59:59",
    status: "expired",
    verifyCode: "1123 5567",
    paymentMethod: "alipay",
    packageContent: ["手抓羊排×1", "大盘鸡×1", "烤包子×4", "酸奶×2"],
    scenarioTag: "情侣约会"
  },
  {
    id: "ORD20260205005",
    packageName: "独享精致套餐",
    restaurantName: "花田错·创意融合餐厅",
    restaurantImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop",
    restaurantLocation: "朝阳区三里屯太古里北区B1层",
    price: 128,
    originalPrice: 268,
    orderTime: "2026-02-05T19:30:00",
    expireTime: "2026-02-15T23:59:59",
    status: "expired",
    verifyCode: "9902 4456",
    paymentMethod: "wechat",
    packageContent: ["主厨沙拉×1", "意面×1", "甜品×1", "饮品×1"],
    scenarioTag: "独处时光"
  },
];

// Countdown calculator
function getCountdown(expireTime: string): { days: number; hours: number; minutes: number; isUrgent: boolean; expired: boolean } {
  const now = new Date().getTime();
  const expire = new Date(expireTime).getTime();
  const diff = expire - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isUrgent: false, expired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, isUrgent: days <= 2, expired: false };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// Status config
const STATUS_CONFIG = {
  unused: { label: "待使用", color: "bg-green-100 text-green-700", icon: Clock, dotColor: "bg-green-500" },
  used: { label: "已使用", color: "bg-slate-100 text-slate-500", icon: Check, dotColor: "bg-slate-400" },
  expired: { label: "已过期", color: "bg-red-50 text-red-500", icon: X, dotColor: "bg-red-400" },
};

const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "unused", label: "待使用" },
  { key: "used", label: "已使用" },
  { key: "expired", label: "已过期" },
];

// Star Rating Component
function StarRating({ rating, size = "md", interactive = false, onChange }: { rating: number; size?: "sm" | "md" | "lg"; interactive?: boolean; onChange?: (r: number) => void }) {
  const sizeMap = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };
  const gapMap = { sm: "gap-0.5", md: "gap-1", lg: "gap-1.5" };

  return (
    <div className={cn("flex items-center", gapMap[size])}>
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          disabled={!interactive}
          onClick={() => onChange?.(i)}
          className={cn(
            "transition-all",
            interactive && "active:scale-110 cursor-pointer",
            !interactive && "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizeMap[size],
              "transition-colors",
              i <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export default function OrderHistoryPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [, setTick] = useState(0);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewTags, setReviewTags] = useState<string[]>([]);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Update countdown every minute
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter(o => o.status === filter);
  }, [filter, orders]);

  const stats = useMemo(() => ({
    total: orders.length,
    unused: orders.filter(o => o.status === "unused").length,
    used: orders.filter(o => o.status === "used").length,
    expired: orders.filter(o => o.status === "expired").length,
    totalSpent: orders.filter(o => o.status !== "expired").reduce((sum, o) => sum + o.price, 0),
    totalSaved: orders.filter(o => o.status !== "expired").reduce((sum, o) => sum + (o.originalPrice - o.price), 0),
  }), [orders]);

  // Open review modal
  const openReviewModal = (orderId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setReviewOrderId(orderId);
    setReviewRating(5);
    setReviewText("");
    setReviewTags([]);
    setReviewSuccess(false);
    setShowReviewModal(true);
  };

  // Toggle review tag
  const toggleReviewTag = (tag: string) => {
    setReviewTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : prev.length < 5 ? [...prev, tag] : prev
    );
  };

  // Submit review
  const submitReview = () => {
    if (!reviewOrderId || reviewRating === 0) return;
    setReviewSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newReview: ReviewData = {
        rating: reviewRating,
        text: reviewText,
        tags: reviewTags,
        time: new Date().toISOString(),
      };

      setOrders(prev => prev.map(o =>
        o.id === reviewOrderId ? { ...o, review: newReview } : o
      ));

      // Also update selectedOrder if viewing detail
      if (selectedOrder?.id === reviewOrderId) {
        setSelectedOrder(prev => prev ? { ...prev, review: newReview } : null);
      }

      setReviewSubmitting(false);
      setReviewSuccess(true);

      // Close modal after showing success
      setTimeout(() => {
        setShowReviewModal(false);
        setReviewSuccess(false);
      }, 1500);

      // Simulate merchant auto-reply after 3 seconds
      const targetOrder = orders.find(o => o.id === reviewOrderId);
      if (targetOrder) {
        const merchantReplies = [
          `感谢您的评价！您的支持是我们最大的动力，欢迎下次再来${targetOrder.restaurantName}，我们会继续努力做得更好！`,
          `非常感谢您的认可！每一位顾客的反馈我们都很重视，希望下次能给您带来更好的体验～`,
          `谢谢您抽时间写下评价！您的满意就是我们的追求，下次来店记得找前台领取小礼物哦！`,
        ];
        const randomReply = merchantReplies[Math.floor(Math.random() * merchantReplies.length)];
        
        setTimeout(() => {
          const merchantReply: MerchantReply = {
            content: randomReply,
            time: new Date().toISOString(),
            merchantName: targetOrder.restaurantName,
          };

          setOrders(prev => prev.map(o =>
            o.id === reviewOrderId && o.review
              ? { ...o, review: { ...o.review, merchantReply } }
              : o
          ));

          // Also update selectedOrder if viewing detail
          if (selectedOrder?.id === reviewOrderId) {
            setSelectedOrder(prev => {
              if (!prev || !prev.review) return prev;
              return { ...prev, review: { ...prev.review, merchantReply } };
            });
          }
        }, 3000);
      }
    }, 800);
  };

  // Review Modal Component
  const renderReviewModal = () => {
    if (!showReviewModal) return null;
    const order = orders.find(o => o.id === reviewOrderId);
    if (!order) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] bg-black/50 flex items-end justify-center"
          onClick={() => !reviewSubmitting && setShowReviewModal(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-lg bg-white rounded-t-3xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Success state */}
            {reviewSuccess ? (
              <div className="p-8 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4"
                >
                  <Check className="w-10 h-10 text-green-600" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">评价提交成功</h3>
                <p className="text-sm text-slate-500">感谢你的评价，帮助更多人做出选择</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">评价体验</h3>
                    <button
                      onClick={() => setShowReviewModal(false)}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                  {/* Order brief */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      <img src={order.restaurantImage} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 text-sm truncate">{order.packageName}</div>
                      <div className="text-xs text-slate-500 truncate">{order.restaurantName}</div>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="px-6 pt-5 pb-4">
                  <div className="text-center mb-4">
                    <div className="text-sm text-slate-600 mb-3">整体体验如何？</div>
                    <StarRating rating={reviewRating} size="lg" interactive onChange={setReviewRating} />
                    <div className="text-xs text-slate-400 mt-2">
                      {reviewRating === 5 ? "非常满意" : reviewRating === 4 ? "比较满意" : reviewRating === 3 ? "一般般" : reviewRating === 2 ? "不太满意" : "很不满意"}
                    </div>
                  </div>

                  {/* Quick tags */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-slate-700 mb-2">选择标签 <span className="text-xs text-slate-400 font-normal">（最多5个）</span></div>
                    <div className="flex flex-wrap gap-2">
                      {REVIEW_TAGS.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleReviewTag(tag)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95",
                            reviewTags.includes(tag)
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-50 text-slate-500 border border-slate-100"
                          )}
                        >
                          {reviewTags.includes(tag) && <span className="mr-1">✓</span>}
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text review */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-slate-700 mb-2">写点什么 <span className="text-xs text-slate-400 font-normal">（选填）</span></div>
                    <textarea
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      placeholder="分享你的用餐体验，帮助其他人做出更好的选择..."
                      className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all"
                      maxLength={200}
                    />
                    <div className="text-right text-xs text-slate-400 mt-1">{reviewText.length}/200</div>
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={submitReview}
                    disabled={reviewSubmitting || reviewRating === 0}
                    className={cn(
                      "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
                      reviewRating > 0
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200"
                        : "bg-slate-100 text-slate-400"
                    )}
                  >
                    {reviewSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        提交评价
                      </>
                    )}
                  </button>
                </div>

                {/* Safe area padding */}
                <div className="h-6" />
              </>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Order detail view
  if (selectedOrder) {
    const countdown = getCountdown(selectedOrder.expireTime);
    const statusCfg = STATUS_CONFIG[selectedOrder.status];
    const StatusIcon = statusCfg.icon;

    return (
      <Layout>
        <div className="min-h-screen bg-slate-50">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 pt-12 pb-4 border-b border-slate-100 flex items-center gap-4">
            <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">订单详情</h1>
          </div>

          <div className="p-4 space-y-4 pb-32">
            {/* Status Card */}
            <div className={cn(
              "rounded-2xl p-6 text-center",
              selectedOrder.status === "unused" ? "bg-gradient-to-br from-green-50 to-emerald-50" :
              selectedOrder.status === "used" ? "bg-gradient-to-br from-slate-50 to-slate-100" :
              "bg-gradient-to-br from-red-50 to-orange-50"
            )}>
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3",
                selectedOrder.status === "unused" ? "bg-green-100" :
                selectedOrder.status === "used" ? "bg-slate-200" : "bg-red-100"
              )}>
                <StatusIcon className={cn(
                  "w-8 h-8",
                  selectedOrder.status === "unused" ? "text-green-600" :
                  selectedOrder.status === "used" ? "text-slate-500" : "text-red-500"
                )} />
              </div>
              <div className={cn("text-lg font-bold mb-1", statusCfg.color.split(" ")[1])}>{statusCfg.label}</div>

              {/* Countdown for unused orders */}
              {selectedOrder.status === "unused" && !countdown.expired && (
                <div className="mt-3">
                  <div className="text-xs text-slate-500 mb-2">距离过期还有</div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-slate-100">
                      <span className={cn("text-2xl font-bold font-mono", countdown.isUrgent ? "text-red-500" : "text-slate-900")}>{countdown.days}</span>
                      <span className="text-xs text-slate-400 ml-1">天</span>
                    </div>
                    <span className="text-slate-300 font-bold">:</span>
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-slate-100">
                      <span className={cn("text-2xl font-bold font-mono", countdown.isUrgent ? "text-red-500" : "text-slate-900")}>{String(countdown.hours).padStart(2, '0')}</span>
                      <span className="text-xs text-slate-400 ml-1">时</span>
                    </div>
                    <span className="text-slate-300 font-bold">:</span>
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-slate-100">
                      <span className={cn("text-2xl font-bold font-mono", countdown.isUrgent ? "text-red-500" : "text-slate-900")}>{String(countdown.minutes).padStart(2, '0')}</span>
                      <span className="text-xs text-slate-400 ml-1">分</span>
                    </div>
                  </div>
                  {countdown.isUrgent && (
                    <div className="flex items-center justify-center gap-1 mt-2 text-red-500 text-xs font-medium">
                      <AlertCircle className="w-3 h-3" />
                      即将过期，记得尽快使用
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Verify Code (for unused orders) */}
            {selectedOrder.status === "unused" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                <div className="w-40 h-40 bg-slate-900 rounded-xl flex items-center justify-center mb-4">
                  <ScanLine className="w-20 h-20 text-white opacity-50" />
                </div>
                <div className="bg-slate-50 px-4 py-2 rounded-lg mb-2">
                  <span className="text-slate-400 text-xs block mb-1">核销码</span>
                  <span className="text-2xl font-bold font-mono text-slate-900 tracking-widest">{selectedOrder.verifyCode}</span>
                </div>
                <p className="text-xs text-slate-400">到店给店员看这个码就行</p>
              </div>
            )}

            {/* Restaurant Info */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden">
                  <img src={selectedOrder.restaurantImage} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{selectedOrder.restaurantName}</h4>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3 h-3" />
                    {selectedOrder.restaurantLocation}
                  </div>
                </div>
              </div>

              {/* Package Content */}
              <div className="pt-4 space-y-3">
                <h5 className="font-bold text-slate-900 text-sm">套餐内容</h5>
                <div className="space-y-2">
                  {selectedOrder.packageContent.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
              <h5 className="font-bold text-slate-900 text-sm">订单信息</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">订单编号</span><span className="text-slate-900 font-mono text-xs">{selectedOrder.id}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">下单时间</span><span className="text-slate-900">{formatDate(selectedOrder.orderTime)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">有效期至</span><span className={cn("font-medium", selectedOrder.status === "expired" ? "text-red-500" : "text-slate-900")}>{formatDate(selectedOrder.expireTime)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">支付方式</span><span className="text-slate-900">{selectedOrder.paymentMethod === 'wechat' ? '微信支付' : '支付宝'}</span></div>
                <div className="flex justify-between border-t border-slate-50 pt-2">
                  <span className="text-slate-500">原价</span>
                  <span className="text-slate-400 line-through">¥{selectedOrder.originalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">实付金额</span>
                  <span className="font-bold text-lg text-slate-900">¥{selectedOrder.price}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">已省</span>
                  <span className="font-bold text-green-600">¥{selectedOrder.originalPrice - selectedOrder.price}</span>
                </div>
              </div>
            </div>

            {/* Review Section - Show existing review or review button */}
            {selectedOrder.status === "used" && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                {selectedOrder.review ? (
                  // Show existing review
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-900 text-sm">我的评价</h5>
                      <span className="text-xs text-slate-400">{formatDate(selectedOrder.review.time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={selectedOrder.review.rating} size="sm" />
                      <span className="text-xs text-amber-600 font-medium">
                        {selectedOrder.review.rating === 5 ? "非常满意" : selectedOrder.review.rating === 4 ? "比较满意" : selectedOrder.review.rating === 3 ? "一般般" : selectedOrder.review.rating === 2 ? "不太满意" : "很不满意"}
                      </span>
                    </div>
                    {selectedOrder.review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedOrder.review.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                    {selectedOrder.review.text && (
                      <p className="text-sm text-slate-600 leading-relaxed">{selectedOrder.review.text}</p>
                    )}

                    {/* Merchant Reply */}
                    {selectedOrder.review.merchantReply && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="bg-blue-50/80 rounded-xl p-3.5 relative">
                          {/* Reply arrow indicator */}
                          <div className="absolute -top-2 left-6 w-4 h-4 bg-blue-50/80 rotate-45" />
                          
                          <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <Store className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-xs font-bold text-blue-700">{selectedOrder.review.merchantReply.merchantName}</span>
                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-medium rounded-full flex items-center gap-0.5">
                                  <BadgeCheck className="w-2.5 h-2.5" />
                                  商家
                                </span>
                              </div>
                              <span className="text-[10px] text-blue-400">{formatDate(selectedOrder.review.merchantReply.time)}</span>
                            </div>
                            <p className="text-sm text-blue-800 leading-relaxed">{selectedOrder.review.merchantReply.content}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Show review button
                  <div className="flex flex-col items-center py-4">
                    <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mb-3">
                      <MessageSquare className="w-7 h-7 text-amber-500" />
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm mb-1">分享你的体验</h5>
                    <p className="text-xs text-slate-500 mb-4">你的评价将帮助更多人做出选择</p>
                    <button
                      onClick={() => openReviewModal(selectedOrder.id)}
                      className="px-8 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg shadow-amber-200 active:scale-95 transition-transform flex items-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      去评价
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm active:scale-95 transition-transform">联系商家</button>
              {selectedOrder.status === "unused" && (
                <button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm active:scale-95 transition-transform">申请退款</button>
              )}
              {selectedOrder.status === "used" && !selectedOrder.review && (
                <button
                  onClick={() => openReviewModal(selectedOrder.id)}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm active:scale-95 transition-transform flex items-center justify-center gap-1.5"
                >
                  <Star className="w-4 h-4" />
                  去评价
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Review Modal */}
        {renderReviewModal()}
      </Layout>
    );
  }

  // Order list view
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 pt-12 pb-4 border-b border-slate-100 flex items-center gap-4">
          <Link href="/profile">
            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">购买记录</h1>
        </div>

        {/* Stats Summary */}
        <div className="px-4 pt-4 pb-2">
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">消费概览</h3>
              <ShoppingBag className="w-5 h-5 text-white/60" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-white/60 mt-1">总订单</div>
              </div>
              <div>
                <div className="text-2xl font-bold">¥{stats.totalSpent}</div>
                <div className="text-xs text-white/60 mt-1">累计消费</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">¥{stats.totalSaved}</div>
                <div className="text-xs text-white/60 mt-1">累计省下</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-3 flex gap-2">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95",
                filter === opt.key
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-500 border border-slate-200"
              )}
            >
              {opt.label}
              {opt.key !== "all" && (
                <span className={cn(
                  "ml-1.5 text-xs",
                  filter === opt.key ? "text-white/70" : "text-slate-400"
                )}>
                  {opt.key === "unused" ? stats.unused : opt.key === "used" ? stats.used : stats.expired}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Order List */}
        <div className="px-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order, index) => {
              const countdown = getCountdown(order.expireTime);
              const statusCfg = STATUS_CONFIG[order.status];
              const StatusIcon = statusCfg.icon;

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
                >
                  {/* Urgent countdown banner */}
                  {order.status === "unused" && countdown.isUrgent && !countdown.expired && (
                    <div className="bg-red-50 px-4 py-2 flex items-center gap-2 border-b border-red-100">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-xs font-medium text-red-600">
                        还剩 {countdown.days}天{countdown.hours}小时 过期，抓紧用
                      </span>
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex gap-3">
                      {/* Restaurant Image */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                        <img src={order.restaurantImage} alt="" className="w-full h-full object-cover" />
                        {order.status === "used" && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="bg-white/90 rounded-full p-1"><Check className="w-5 h-5 text-green-600" /></div>
                          </div>
                        )}
                        {order.status === "expired" && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="text-white text-xs font-bold bg-red-500/80 px-2 py-1 rounded">已过期</div>
                          </div>
                        )}
                      </div>

                      {/* Order Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-sm truncate">{order.packageName}</h4>
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium shrink-0 flex items-center gap-1", statusCfg.color)}>
                            <StatusIcon className="w-3 h-3" />
                            {statusCfg.label}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 truncate">{order.restaurantName}</div>

                        {/* Scenario tag */}
                        {order.scenarioTag && (
                          <span className="inline-block mt-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">{order.scenarioTag}</span>
                        )}

                        {/* Price and countdown */}
                        <div className="flex items-end justify-between mt-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-slate-900">¥{order.price}</span>
                            <span className="text-xs text-slate-400 line-through">¥{order.originalPrice}</span>
                          </div>

                          {/* Countdown for unused */}
                          {order.status === "unused" && !countdown.expired && !countdown.isUrgent && (
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              剩{countdown.days}天{countdown.hours}时
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom info - different for used orders with/without review */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                      <span className="text-xs text-slate-400">{formatDate(order.orderTime)}</span>

                      {order.status === "used" && !order.review ? (
                        <button
                          onClick={(e) => openReviewModal(order.id, e)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-sm active:scale-95 transition-transform"
                        >
                          <Star className="w-3 h-3" />
                          去评价
                        </button>
                      ) : order.status === "used" && order.review ? (
                        <div className="flex items-center gap-1.5">
                          <StarRating rating={order.review.rating} size="sm" />
                          <span className="text-xs text-amber-600 font-medium">已评价</span>
                          {order.review.merchantReply && (
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-medium rounded-full">
                              <Reply className="w-2.5 h-2.5" />
                              商家已回复
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          查看详情
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Empty state */}
          {filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <ShoppingBag className="w-16 h-16 text-slate-200 mb-4" />
              <div className="text-slate-400 text-sm">暂无{filter === "all" ? "" : FILTER_OPTIONS.find(o => o.key === filter)?.label}订单</div>
              <Link href="/">
                <button className="mt-4 px-6 py-2 bg-slate-900 text-white text-sm rounded-full font-medium active:scale-95 transition-transform">
                  去逛逛
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {renderReviewModal()}
    </Layout>
  );
}
