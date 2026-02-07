import { Heart, Camera, Beer, Star, User, Users } from "lucide-react";

export const MOCK_STORE = {
  id: "store_001",
  name: "花田错·创意餐厅",
  address: "朝阳区三里屯太古里北区 N4-30",
  rating: 4.8,
  tags: ["创意菜", "氛围感", "适合约会"],
};

export const RELATIONSHIP_OPTIONS = [
  { id: "first_date", label: "第一次见面", icon: Star, color: "text-pink-500", bg: "bg-pink-50", theme: "pink" },
  { id: "couple", label: "情侣/暧昧", icon: Heart, color: "text-rose-500", bg: "bg-rose-50", theme: "rose" },
  { id: "bestie", label: "闺蜜", icon: Camera, color: "text-purple-500", bg: "bg-purple-50", theme: "purple" },
  { id: "bros", label: "兄弟", icon: Beer, color: "text-blue-500", bg: "bg-blue-50", theme: "blue" },
  { id: "solitary", label: "独处时光", icon: User, color: "text-slate-500", bg: "bg-slate-50", theme: "slate" },
  { id: "family", label: "阖家团圆", icon: Users, color: "text-orange-500", bg: "bg-orange-50", theme: "orange" },
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
  },
  solitary: {
    title: "独处\n时光建议",
    flow: "阅读\n轻食\n发呆",
    duration: "随心\n所欲",
    tags: ["#安静", "#自在", "#充电"],
    description: "找个角落\n戴上耳机\n享受美食\n与自己\n对话"
  },
  family: {
    title: "阖家\n团圆建议",
    flow: "大餐\n合影\n闲聊",
    duration: "温馨\n时刻",
    tags: ["#温馨", "#热闹", "#亲情"],
    description: "点满一桌\n好菜\n照顾好\n老人小孩\n享受\n天伦之乐"
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
  },
  {
    id: "pkg_005",
    title: "独享\n静谧单人餐",
    price: 88,
    originalPrice: 128,
    suitableFor: ["solitary"],
    recommendReason: "一人食\n也要\n精致",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    items: [
      "经典肉酱面",
      "凯撒沙拉",
      "柠檬茶"
    ],
    rules: ["随时退", "免预约"]
  },
  {
    id: "pkg_006",
    title: "阖家\n欢聚套餐",
    price: 688,
    originalPrice: 988,
    suitableFor: ["family"],
    recommendReason: "菜量大\n口味老少皆宜\n适合\n全家共享",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80",
    items: [
      "烤全鸡",
      "清蒸鲈鱼",
      "时蔬大拼盘",
      "海鲜炒饭",
      "水果拼盘"
    ],
    rules: ["需提前预约", "随时退"]
  }
];
