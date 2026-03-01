import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import { ArrowLeft, Clock, Check, X, MapPin, ChevronRight, ScanLine, AlertCircle, ShoppingBag, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

// Order status types
type OrderStatus = "unused" | "used" | "expired";
type FilterType = "all" | "unused" | "used" | "expired";

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
}

// Mock order data
const MOCK_ORDERS: OrderItem[] = [
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
    scenarioTag: "兄弟小聚"
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

export default function OrderHistoryPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [, setTick] = useState(0);

  // Update countdown every minute
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredOrders = useMemo(() => {
    if (filter === "all") return MOCK_ORDERS;
    return MOCK_ORDERS.filter(o => o.status === filter);
  }, [filter]);

  const stats = useMemo(() => ({
    total: MOCK_ORDERS.length,
    unused: MOCK_ORDERS.filter(o => o.status === "unused").length,
    used: MOCK_ORDERS.filter(o => o.status === "used").length,
    expired: MOCK_ORDERS.filter(o => o.status === "expired").length,
    totalSpent: MOCK_ORDERS.filter(o => o.status !== "expired").reduce((sum, o) => sum + o.price, 0),
    totalSaved: MOCK_ORDERS.filter(o => o.status !== "expired").reduce((sum, o) => sum + (o.originalPrice - o.price), 0),
  }), []);

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
                  <span className="text-xl font-mono font-bold text-slate-900 tracking-widest">{selectedOrder.verifyCode}</span>
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

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm active:scale-95 transition-transform">联系商家</button>
              {selectedOrder.status === "unused" && (
                <button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm active:scale-95 transition-transform">申请退款</button>
              )}
            </div>
          </div>
        </div>
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

                    {/* Bottom info */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                      <span className="text-xs text-slate-400">{formatDate(order.orderTime)}</span>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        查看详情
                        <ChevronRight className="w-3 h-3" />
                      </div>
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
    </Layout>
  );
}
