import { Heart, Camera, Beer, Star } from "lucide-react";

export const MOCK_STORE = {
  id: "store_001",
  name: "花田错·创意餐厅",
  address: "朝阳区三里屯太古里北区 N4-30",
  rating: 4.8,
  tags: ["创意菜", "氛围感", "适合约会"],
};

export const RELATIONSHIP_OPTIONS = [
  { id: "first_date", label: "第一次见面", icon: Star, color: "text-pink-500", bg: "bg-pink-50" },
  { id: "couple", label: "情侣/暧昧", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
  { id: "bestie", label: "闺蜜", icon: Camera, color: "text-purple-500", bg: "bg-purple-50" },
  { id: "bros", label: "兄弟", icon: Beer, color: "text-blue-500", bg: "bg-blue-50" },
];

export const SCENARIO_ADVICE = {
  first_date: {
    title: "初次\n相见建议",
    flow: "饮品\n正餐",
    duration: "六十至九十分钟\n刚刚好",
    tags: ["#不尴尬", "#稳妥", "#不翻车"],
    description: "初次见面\n不宜过长\n先喝点东西\n缓解紧张\n聊得来\n再吃饭\n进退自如"
  },
  couple: {
    title: "浪漫\n约会建议",
    flow: "正餐\n散步\n电影",
    duration: "两三小时\n慢时光",
    tags: ["#仪式感", "#升温", "#甜蜜"],
    description: "享受\n二人世界\n选择\n环境私密的座位\n餐后\n安排散步\n或电影\n延续氛围"
  },
  bestie: {
    title: "闺蜜\n聚会建议",
    flow: "拍照\n下午茶\n正餐",
    duration: "时光\n不限",
    tags: ["#出片", "#八卦", "#美食"],
    description: "先找\n光线好的地方\n拍照\n然后\n边吃边聊\n尽情享受\n放松时光"
  },
  bros: {
    title: "兄弟\n聚会建议",
    flow: "正餐\n酒吧\n游戏",
    duration: "时光\n不限",
    tags: ["#放松", "#畅聊", "#痛快"],
    description: "大口吃肉\n大口喝酒\n不用拘束\n怎么开心\n怎么来"
  }
};

export const STORE_PACKAGES = [
  {
    id: "pkg_001",
    title: "初见\n双人轻食",
    price: 198,
    originalPrice: 298,
    suitableFor: ["first_date", "couple"],
    recommendReason: "分量适中\n吃相优雅\n包含\n两杯特调饮品",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop",
    items: [
      "牛油果大虾沙拉",
      "黑松露奶油意面",
      "特调无酒精鸡尾酒",
      "提拉米苏"
    ],
    rules: ["随时退", "免预约", "仅限堂食"]
  },
  {
    id: "pkg_002",
    title: "热恋\n海陆双人",
    price: 520,
    originalPrice: 888,
    suitableFor: ["couple"],
    recommendReason: "仪式感拉满\n包含\nM5和牛\n波士顿龙虾",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    items: [
      "M5澳洲和牛牛排",
      "芝士焗波士顿龙虾",
      "法式鹅肝",
      "红酒"
    ],
    rules: ["需提前预约", "随时退"]
  },
  {
    id: "pkg_003",
    title: "闺蜜\n精致下午茶",
    price: 168,
    originalPrice: 258,
    suitableFor: ["bestie"],
    recommendReason: "超高颜值\n每一款\n都超级出片",
    image: "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=400&h=300&fit=crop",
    items: [
      "三层甜品塔",
      "英式红茶或咖啡",
      "马卡龙"
    ],
    rules: ["随时退", "免预约"]
  },
  {
    id: "pkg_004",
    title: "兄弟\n大口吃肉",
    price: 328,
    originalPrice: 468,
    suitableFor: ["bros"],
    recommendReason: "肉量十足\n配啤酒\n绝佳",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
    items: [
      "德式烤猪肘",
      "混合香肠拼盘",
      "炸薯角",
      "精酿啤酒"
    ],
    rules: ["随时退", "免预约"]
  }
];
