import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, Camera, Beer, Briefcase, Coffee, Moon, Heart, Gift, User, Users, 
  Share2, Check, ScanLine, ChevronRight, MapPin, Clock, Star, Navigation, X, 
  Utensils, Receipt, Sparkles, Cake, ShoppingBag
} from 'lucide-react';

// ========== DATA ==========

const RELATIONS = [
  { id: 'first_meet', icon: Heart, label: '第一次见面', desc: '初次约会不紧张', bg: 'bg-pink-50', color: 'text-pink-500', border: 'border-pink-200', tag: 'romantic' },
  { id: 'couple', icon: Heart, label: '情侣约会', desc: '浪漫二人世界', bg: 'bg-red-50', color: 'text-red-500', border: 'border-red-200', tag: 'romantic' },
  { id: 'bestie', icon: Camera, label: '闺蜜聚会', desc: '拍照打卡必去', bg: 'bg-purple-50', color: 'text-purple-500', border: 'border-purple-200', tag: 'friends' },
  { id: 'bro', icon: Beer, label: '兄弟小聚', desc: '放松畅聊解压', bg: 'bg-blue-50', color: 'text-blue-500', border: 'border-blue-200', tag: 'friends' },
  { id: 'business', icon: Briefcase, label: '商务宴请', desc: '私密有排面', bg: 'bg-slate-100', color: 'text-slate-600', border: 'border-slate-200', tag: 'business' },
  { id: 'family', icon: Users, label: '阖家团圆', desc: '温馨家庭聚餐', bg: 'bg-orange-50', color: 'text-orange-500', border: 'border-orange-200', tag: 'family' },
  { id: 'birthday', icon: Cake, label: '生日派对', desc: '难忘生日趴', bg: 'bg-yellow-50', color: 'text-yellow-500', border: 'border-yellow-200', tag: 'friends' },
  { id: 'alone', icon: Coffee, label: '独处时光', desc: '享受一个人的安静', bg: 'bg-emerald-50', color: 'text-emerald-500', border: 'border-emerald-200', tag: 'solo' },
];

// Relation Advice Card data - explains why selecting a relation matters
const RELATION_ADVICE: Record<string, { emoji: string; title: string; subtitle: string; tips: string[]; atmosphere: string }> = {
  first_meet: {
    emoji: '💫',
    title: '初次见面小贴士',
    subtitle: '第一印象很重要，选对地方成功一半',
    tips: ['选择安静、不拥挤的环境，方便交流', '避免太正式或太随意的场所', '预留"散步聊天"的空间，缓解紧张感'],
    atmosphere: '轻松自然 · 不尴尬 · 有话题'
  },
  couple: {
    emoji: '💕',
    title: '约会氛围指南',
    subtitle: '用心安排，让每次约会都有仪式感',
    tips: ['烛光、花艺、音乐是浪漫三要素', '选择有窗景或露台的位置更加分', '甜点和饮品是约会的"甜蜜收尾"'],
    atmosphere: '浪漫温馨 · 仪式感 · 私密空间'
  },
  bestie: {
    emoji: '📸',
    title: '闺蜜出行攻略',
    subtitle: '好看、好吃、好拍，一个都不能少',
    tips: ['选择高颜值、出片率高的店铺', '下午茶+拍照是闺蜜聚会经典组合', '甜品和饮品的摆盘要"上镜"'],
    atmosphere: '精致好拍 · 甜蜜分享 · 畅聊时光'
  },
  bro: {
    emoji: '🍻',
    title: '兄弟聚会须知',
    subtitle: '不用太讲究，放松就是最好的安排',
    tips: ['大口吃肉、大口喝酒是核心需求', '选择不限时、氛围轻松的场所', '有台球、飞镖等娱乐设施更佳'],
    atmosphere: '豪爽畅快 · 无拘无束 · 解压放松'
  },
  business: {
    emoji: '🤝',
    title: '商务宴请礼仪',
    subtitle: '场合得体，细节决定成败',
    tips: ['选择私密包间，保证谈话不被打扰', '提前了解客人饮食偏好和忌口', '酒水和茶品的档次要与场合匹配'],
    atmosphere: '私密高端 · 专业得体 · 排面十足'
  },
  family: {
    emoji: '🏠',
    title: '家庭聚餐建议',
    subtitle: '老少皆宜，温馨团圆最重要',
    tips: ['菜品口味要兼顾老人和小孩', '选择宽敞、有包间的餐厅更方便', '提前预订，避免等位影响体验'],
    atmosphere: '温馨团圆 · 老少皆宜 · 其乐融融'
  },
  birthday: {
    emoji: '🎂',
    title: '生日派对攻略',
    subtitle: '让寿星感受到满满的用心和惊喜',
    tips: ['提前和商家沟通生日布置和蛋糕', '选择可以唱歌、有氛围灯光的场所', 'KTV+大餐是经典生日组合'],
    atmosphere: '惊喜满满 · 狂欢热闹 · 难忘回忆'
  },
  alone: {
    emoji: '☕',
    title: '独处时光指南',
    subtitle: '给自己一段安静的好时光',
    tips: ['选择有自然光、安静的角落位', '一杯好咖啡+一本书是最佳搭配', '不赶时间，享受慢下来的感觉'],
    atmosphere: '安静惬意 · 放空自我 · 充电时刻'
  },
};

// Multiple restaurants for the ONLINE flow
const ALL_RESTAURANTS = [
  {
    id: 1,
    name: '花田错·西餐厅',
    category: '美食' as const,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    location: '三里屯太古里北区 N4-30',
    tags: ['轻松不尴尬', '环境安静', '适合约会'],
    rating: 4.8,
    price: '¥198/人',
    phone: '010-6417-8899',
    hours: '11:00 - 22:00',
    relationTags: ['romantic', 'friends', 'solo', 'business'],
    gallery: [
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    ],
    // RELATION packages (only shown when user selects a relation)
    relationPackages: [
      {
        id: 101, name: '初见·双人轻食套餐', desc: '牛油果鲜虾沙拉 + 黑松露奶油意面 + 特调气泡水x2',
        price: 198, originalPrice: 298,
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
        relationTags: ['romantic', 'friends', 'solo'],
        items: [{ name: '牛油果鲜虾沙拉', qty: 1 }, { name: '黑松露奶油意面', qty: 1 }, { name: '特调气泡水', qty: 2 }, { name: '餐前面包', qty: 1 }],
        gallery: ['https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80'],
        notes: ['有效期：购买后30天内有效', '使用时间：11:00 - 21:00', '需提前2小时预约']
      },
      {
        id: 102, name: '心动·法式浪漫晚餐', desc: '澳洲M5和牛眼肉 + 鹅肝慕斯 + 甜点拼盘 + 红酒x2',
        price: 520, originalPrice: 888,
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
        relationTags: ['romantic'],
        items: [{ name: '澳洲M5和牛眼肉', qty: 1 }, { name: '鹅肝慕斯', qty: 1 }, { name: '甜点拼盘', qty: 1 }, { name: '红酒一杯', qty: 2 }],
        gallery: ['https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80'],
        notes: ['有效期：购买后15天内有效', '仅限晚餐时段 17:30 - 22:00', '需提前1天预约']
      },
      {
        id: 103, name: '微醺·下午茶甜蜜时光', desc: '精选甜点三层塔 + 手冲咖啡x2 + 季节限定蛋糕',
        price: 128, originalPrice: 198,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80',
        relationTags: ['romantic', 'friends', 'solo'],
        items: [{ name: '精选甜点三层塔', qty: 1 }, { name: '手冲咖啡', qty: 2 }, { name: '季节限定蛋糕', qty: 1 }],
        gallery: ['https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80'],
        notes: ['有效期：购买后30天内有效', '使用时间：14:00 - 17:00']
      },
      {
        id: 104, name: '兄弟·畅饮烧烤套餐', desc: '精选烤串拼盘 + 精酿啤酒x4 + 毛豆花生',
        price: 268, originalPrice: 398,
        image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80',
        relationTags: ['friends'],
        items: [{ name: '精选烤串拼盘', qty: 1 }, { name: '精酿啤酒', qty: 4 }, { name: '毛豆花生', qty: 1 }],
        gallery: ['https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80'],
        notes: ['有效期：购买后30天内有效', '使用时间：17:00 - 22:00']
      },
      {
        id: 105, name: '商务·精致位上套餐', desc: '前菜拼盘 + 主厨推荐牛排 + 甜品 + 红酒2杯',
        price: 458, originalPrice: 688,
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
        relationTags: ['business'],
        items: [{ name: '前菜拼盘', qty: 1 }, { name: '主厨推荐牛排', qty: 1 }, { name: '甜品', qty: 1 }, { name: '红酒', qty: 2 }],
        gallery: ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80'],
        notes: ['有效期：购买后15天内有效', '含包间费', '需提前1天预约']
      },
      {
        id: 106, name: '阖家·温馨家宴套餐', desc: '红烧肉 + 清蒸鲈鱼 + 时蔬拼盘 + 汤品 (4-6人)',
        price: 688, originalPrice: 1088,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
        relationTags: ['family'],
        items: [{ name: '红烧肉', qty: 1 }, { name: '清蒸鲈鱼', qty: 1 }, { name: '时蔬拼盘', qty: 2 }, { name: '老火靓汤', qty: 1 }, { name: '米饭', qty: 6 }],
        gallery: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'],
        notes: ['有效期：购买后15天内有效', '4-6人套餐', '需提前1天预约']
      },
    ],
    // NORMAL group-buy packages (Meituan-style, no relation tags)
    normalPackages: [
      {
        id: 901, name: '双人精选套餐', desc: '主菜x2 + 汤品x1 + 甜品x2 + 饮品x2',
        price: 168, originalPrice: 256,
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
        relationTags: [] as string[],
        items: [{ name: '主厨推荐主菜', qty: 2 }, { name: '每日例汤', qty: 1 }, { name: '精选甜品', qty: 2 }, { name: '鲜榨果汁', qty: 2 }],
        gallery: ['https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80'],
        notes: ['有效期：购买后30天内有效', '使用时间：11:00 - 21:00', '周末节假日通用']
      },
      {
        id: 902, name: '三人欢聚套餐', desc: '主菜x3 + 凉菜x2 + 汤品x1 + 饮品x3',
        price: 238, originalPrice: 378,
        image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80',
        relationTags: [] as string[],
        items: [{ name: '主厨推荐主菜', qty: 3 }, { name: '精选凉菜', qty: 2 }, { name: '每日例汤', qty: 1 }, { name: '鲜榨果汁', qty: 3 }],
        gallery: ['https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80'],
        notes: ['有效期：购买后30天内有效', '使用时间：11:00 - 21:00', '周末节假日通用']
      },
      {
        id: 903, name: '四人豪华套餐', desc: '主菜x4 + 凉菜x2 + 汤品x1 + 甜品x4 + 饮品x4',
        price: 358, originalPrice: 528,
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
        relationTags: [] as string[],
        items: [{ name: '主厨推荐主菜', qty: 4 }, { name: '精选凉菜', qty: 2 }, { name: '每日例汤', qty: 1 }, { name: '精选甜品', qty: 4 }, { name: '鲜榨果汁', qty: 4 }],
        gallery: ['https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80'],
        notes: ['有效期：购买后30天内有效', '使用时间：11:00 - 21:00', '周末节假日通用']
      },
      {
        id: 904, name: '单人商务简餐', desc: '主菜x1 + 汤品x1 + 甜品x1 + 咖啡x1',
        price: 88, originalPrice: 138,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80',
        relationTags: [] as string[],
        items: [{ name: '主厨推荐主菜', qty: 1 }, { name: '每日例汤', qty: 1 }, { name: '精选甜品', qty: 1 }, { name: '现磨咖啡', qty: 1 }],
        gallery: ['https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80'],
        notes: ['有效期：购买后30天内有效', '使用时间：11:00 - 14:00', '仅限工作日']
      },
    ],
  },
  {
    id: 2,
    name: '丝路有约·中东融合餐厅',
    category: '美食' as const,
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    location: '国贸CBD 银泰中心B1',
    tags: ['异域风情', '私密包间', '适合商务'],
    rating: 4.6,
    price: '¥258/人',
    phone: '010-8529-3300',
    hours: '11:30 - 23:00',
    relationTags: ['romantic', 'business', 'friends'],
    gallery: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
    ],
    relationPackages: [
      {
        id: 201, name: '商务·精致位上套餐', desc: '前菜拼盘 + 主厨推荐牛排 + 甜品 + 红酒2杯',
        price: 458, originalPrice: 688,
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
        relationTags: ['business', 'romantic'],
        items: [{ name: '前菜拼盘', qty: 1 }, { name: '主厨推荐牛排', qty: 1 }, { name: '甜品', qty: 1 }, { name: '红酒', qty: 2 }],
        gallery: ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80'],
        notes: ['有效期：购买后15天内有效', '含包间费', '需提前1天预约']
      },
      {
        id: 202, name: '闺蜜·下午茶畅聊套餐', desc: '中东甜点拼盘 + 特调奶茶x2 + 水果拼盘',
        price: 158, originalPrice: 238,
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
        relationTags: ['friends', 'romantic', 'solo'],
        items: [{ name: '中东甜点拼盘', qty: 1 }, { name: '特调奶茶', qty: 2 }, { name: '水果拼盘', qty: 1 }],
        gallery: ['https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80'],
        notes: ['有效期：购买后30天内有效', '使用时间：14:00 - 17:30']
      },
    ],
    normalPackages: [
      {
        id: 911, name: '双人精选套餐', desc: '主菜x2 + 中东小食x3 + 饮品x2',
        price: 198, originalPrice: 308,
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
        relationTags: [] as string[],
        items: [{ name: '主厨推荐主菜', qty: 2 }, { name: '中东小食', qty: 3 }, { name: '特调饮品', qty: 2 }],
        gallery: ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80'],
        notes: ['有效期：购买后30天内有效', '使用时间：11:30 - 22:00']
      },
      {
        id: 912, name: '四人聚会套餐', desc: '主菜x4 + 中东小食x5 + 汤品x1 + 饮品x4',
        price: 388, originalPrice: 588,
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
        relationTags: [] as string[],
        items: [{ name: '主厨推荐主菜', qty: 4 }, { name: '中东小食', qty: 5 }, { name: '每日例汤', qty: 1 }, { name: '特调饮品', qty: 4 }],
        gallery: ['https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80'],
        notes: ['有效期：购买后30天内有效', '使用时间：11:30 - 22:00']
      },
    ],
  },
  {
    id: 3,
    name: '炭火青春·日式烤肉',
    category: '美食' as const,
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80',
    location: '望京SOHO T2-B1',
    tags: ['氛围感', '大口吃肉', '适合聚会'],
    rating: 4.7,
    price: '¥168/人',
    phone: '010-8470-2200',
    hours: '17:00 - 02:00',
    relationTags: ['friends', 'family', 'romantic'],
    gallery: [
      'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    ],
    relationPackages: [
      {
        id: 301, name: '兄弟·豪华烤肉拼盘', desc: '安格斯牛排 + 黑椒猪排 + 精酿啤酒x4',
        price: 368, originalPrice: 568,
        image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80',
        relationTags: ['friends', 'family'],
        items: [{ name: '安格斯牛排', qty: 1 }, { name: '黑椒猪排', qty: 1 }, { name: '精酿啤酒', qty: 4 }, { name: '薯条拼盘', qty: 1 }],
        gallery: ['https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80'],
        notes: ['有效期：购买后30天内有效', '使用时间：17:00 - 01:00']
      },
      {
        id: 302, name: '阖家·团圆家宴套餐', desc: '红烧肉 + 清蒸鲈鱼 + 时蔬拼盘 + 汤品 (4-6人)',
        price: 688, originalPrice: 1088,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
        relationTags: ['family'],
        items: [{ name: '红烧肉', qty: 1 }, { name: '清蒸鲈鱼', qty: 1 }, { name: '时蔬拼盘', qty: 2 }, { name: '老火靓汤', qty: 1 }, { name: '米饭', qty: 6 }],
        gallery: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'],
        notes: ['有效期：购买后15天内有效', '4-6人套餐', '需提前1天预约']
      },
    ],
    normalPackages: [
      {
        id: 921, name: '双人烤肉套餐', desc: '精选肉品拼盘 + 蔬菜拼盘 + 饮品x2',
        price: 188, originalPrice: 288,
        image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80',
        relationTags: [] as string[],
        items: [{ name: '精选肉品拼盘', qty: 1 }, { name: '蔬菜拼盘', qty: 1 }, { name: '饮品', qty: 2 }],
        gallery: ['https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80'],
        notes: ['有效期：购买后30天内有效', '使用时间：17:00 - 01:00']
      },
      {
        id: 922, name: '四人畅吃套餐', desc: '豪华肉品拼盘 + 海鲜拼盘 + 蔬菜拼盘 + 饮品x4',
        price: 398, originalPrice: 608,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
        relationTags: [] as string[],
        items: [{ name: '豪华肉品拼盘', qty: 1 }, { name: '海鲜拼盘', qty: 1 }, { name: '蔬菜拼盘', qty: 1 }, { name: '饮品', qty: 4 }],
        gallery: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'],
        notes: ['有效期：购买后30天内有效', '使用时间：17:00 - 01:00']
      },
    ],
  },
  {
    id: 4,
    name: '云端·Sky Lounge',
    category: '饮品' as const,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    location: '朝阳门外大街 凯恒中心顶层',
    tags: ['高空景观', '鸡尾酒', '适合约会'],
    rating: 4.9,
    price: '¥328/人',
    phone: '010-6551-8800',
    hours: '18:00 - 02:00',
    relationTags: ['romantic', 'business', 'friends'],
    gallery: [
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    ],
    relationPackages: [
      {
        id: 401, name: '星空·双人鸡尾酒套餐', desc: '招牌鸡尾酒x2 + 精选小食拼盘',
        price: 288, originalPrice: 456,
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
        relationTags: ['romantic', 'friends'],
        items: [{ name: '招牌鸡尾酒', qty: 2 }, { name: '精选小食拼盘', qty: 1 }],
        gallery: ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80'],
        notes: ['有效期：购买后15天内有效', '仅限晚间时段', '需提前预约']
      },
    ],
    normalPackages: [
      {
        id: 931, name: '双人微醺套餐', desc: '鸡尾酒x2 + 小食拼盘x1',
        price: 258, originalPrice: 398,
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80',
        heroImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
        relationTags: [] as string[],
        items: [{ name: '鸡尾酒', qty: 2 }, { name: '小食拼盘', qty: 1 }],
        gallery: ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80'],
        notes: ['有效期：购买后15天内有效', '仅限晚间时段']
      },
    ],
  },
];

type PackageType = typeof ALL_RESTAURANTS[0]['relationPackages'][0];
type RestaurantType = typeof ALL_RESTAURANTS[0];

// ========== COMPONENT ==========

interface MeetPageProps {
  onNavigate: (tab: string) => void;
}

export default function MeetPage({ onNavigate }: MeetPageProps) {
  // Flow mode: 'online' for all flows
  const [flowMode, setFlowMode] = useState<'online' | null>(null);

  // ---- ONLINE FLOW STEPS ----
  // online-1: Entry page (relation selection) - rendered in main return
  // online-2: Multi-restaurant list (filtered by relation)
  // online-3: Restaurant detail + relation package list
  // online-4: Package detail
  // online-5: Payment
  // online-6: Success
  // online-7: Order detail
  // online-8: Pure group-buy restaurant list (no relation, normal packages)
  // online-9: Restaurant detail + normal package list
  const [onlineStep, setOnlineStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>(1);


  // Track which path user took for online package detail back navigation
  const [onlinePackageSource, setOnlinePackageSource] = useState<'relation' | 'normal'>('relation');

  // Category filter for pure group-buy restaurant list
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  // Shared state
  const [selectedRelation, setSelectedRelation] = useState<string | null>(null);
  const [relationTag, setRelationTag] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantType | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('wechat');
  const [isPaying, setIsPaying] = useState(false);

  // Filtered restaurants for online flow
  const filteredRestaurants = relationTag
    ? ALL_RESTAURANTS.filter(r => r.relationTags.includes(relationTag))
    : ALL_RESTAURANTS;

  // Category-filtered restaurants for pure group-buy list
  const RESTAURANT_CATEGORIES = ['全部', '美食', '饮品', '娱乐'];
  const categoryFilteredRestaurants = selectedCategory === '全部'
    ? ALL_RESTAURANTS
    : ALL_RESTAURANTS.filter(r => r.category === selectedCategory);

  // Get relation packages filtered by tag
  const getRelationPackages = (restaurant: RestaurantType) => {
    if (!relationTag) return restaurant.relationPackages;
    return restaurant.relationPackages.filter(p => p.relationTags.includes(relationTag));
  };

  // ---- HANDLERS ----

  // Online: select relation → go to restaurant list
  const handleOnlineSelectRelation = (relation: typeof RELATIONS[0]) => {
    setSelectedRelation(relation.id);
    setRelationTag(relation.tag);
    setOnlineStep(2);
  };

  // Online: select restaurant → go to restaurant detail
  const handleOnlineSelectRestaurant = (restaurant: RestaurantType) => {
    setSelectedRestaurant(restaurant);
    setOnlineStep(3);
  };

  // Online: skip relation → go to pure group-buy restaurant list
  const handleOnlineSkipRelation = () => {
    setFlowMode('online');
    setSelectedRelation(null);
    setRelationTag(null);
    setSelectedCategory('全部');
    setOnlineStep(8);
  };

  // Online: select restaurant for normal packages (no relation)
  const handleOnlineSelectRestaurantNormal = (restaurant: RestaurantType) => {
    setSelectedRestaurant(restaurant);
    setOnlineStep(9);
  };


  // Shared: payment completion
  useEffect(() => {
    if (isPaying) {
      const timer = setTimeout(() => {
        setIsPaying(false);
        setOnlineStep(6);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FF69B4', '#FFD700', '#00BFFF', '#32CD32'] });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isPaying]);

  // Reset all state
  const resetAll = () => {
    setFlowMode(null);
    setOnlineStep(1);
    setSelectedRelation(null);
    setRelationTag(null);
    setSelectedRestaurant(null);
    setSelectedPackage(null);
    setPaymentMethod('wechat');
    setIsPaying(false);
    setSelectedCategory('全部');
  };

  // ========== SHARED UI COMPONENTS ==========

  // --- Package Detail Page ---
  const renderPackageDetail = (pkg: PackageType, restaurant: RestaurantType, onBack: () => void, onSelect: () => void) => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-24">
      <div className="relative h-56 bg-slate-200 shrink-0">
        <img src={pkg.heroImage} alt={pkg.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />
        <button onClick={onBack} className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 space-y-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h2>
          <p className="text-slate-500 text-sm mb-4">{pkg.desc}</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-orange-500">¥{pkg.price}</span>
            <span className="text-slate-400 line-through text-sm">¥{pkg.originalPrice}</span>
            <span className="bg-red-50 text-red-500 text-xs px-2 py-0.5 rounded-full font-bold">{Math.round((1 - pkg.price / pkg.originalPrice) * 100) / 10}折</span>
          </div>
        </div>
        {pkg.gallery && pkg.gallery.length > 0 && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-3">环境展示</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
              {pkg.gallery.map((img: string, idx: number) => (
                <img key={idx} src={img} alt={`环境 ${idx + 1}`} className="w-40 h-28 rounded-xl object-cover shrink-0" />
              ))}
            </div>
          </section>
        )}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-3">套餐内容</h3>
          <div className="space-y-3 text-sm text-slate-600">
            {pkg.items.map((item, idx) => (
              <div key={idx} className="flex justify-between"><span>{item.name}</span><span>x{item.qty}</span></div>
            ))}
          </div>
        </section>
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-3">购买须知</h3>
          <ul className="space-y-2 text-sm text-slate-500 list-disc pl-4">
            {pkg.notes.map((note, idx) => (<li key={idx}>{note}</li>))}
          </ul>
        </section>
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-3">商家信息</h3>
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl">
            <img src={restaurant.image} alt={restaurant.name} className="w-14 h-14 rounded-xl object-cover" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{restaurant.name}</h4>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1"><MapPin className="w-3 h-3" /><span>{restaurant.location}</span></div>
            </div>
          </div>
        </section>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-20">
        <motion.button whileTap={{ scale: 0.95 }} onClick={onSelect} className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-slate-200">
          选择此套餐 ¥{pkg.price}
        </motion.button>
      </div>
    </motion.div>
  );

  // --- Payment Page ---
  const renderPaymentPage = (pkg: PackageType, restaurant: RestaurantType, onBack: () => void) => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-24">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 pt-12 pb-4 border-b border-slate-100 flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
        <h1 className="text-xl font-bold text-slate-900">支付订单</h1>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex gap-4 mb-4">
            <img src={pkg.image} alt={pkg.name} className="w-20 h-20 rounded-xl object-cover" />
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 mb-1">{pkg.name}</h4>
              <p className="text-slate-500 text-xs mb-2">{restaurant.name}</p>
              <div className="text-orange-500 font-bold">¥{pkg.price}</div>
            </div>
          </div>
          <div className="border-t border-slate-50 pt-4 flex justify-between items-center">
            <span className="text-slate-500 font-bold">合计</span>
            <span className="text-3xl font-bold text-slate-900">¥{pkg.price}.00</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-4">选择支付方式</h3>
          <div className="space-y-3">
            <div onClick={() => setPaymentMethod('wechat')} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'wechat' ? 'border-green-500 bg-green-50' : 'border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white"><span className="font-bold text-sm">微</span></div>
                <div><span className="font-bold text-slate-900 block">微信支付</span><span className="text-xs text-slate-400">推荐使用</span></div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'wechat' ? 'border-green-500 bg-green-500' : 'border-slate-300'}`}>
                {paymentMethod === 'wechat' && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
            <div onClick={() => setPaymentMethod('alipay')} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'alipay' ? 'border-blue-500 bg-blue-50' : 'border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white"><span className="font-bold text-sm">支</span></div>
                <div><span className="font-bold text-slate-900 block">支付宝</span><span className="text-xs text-slate-400">花呗可用</span></div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'alipay' ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                {paymentMethod === 'alipay' && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-20">
        <button onClick={() => setIsPaying(true)} disabled={isPaying} className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2">
          {isPaying ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />支付中...</>) : (`确认支付 ¥${pkg.price}`)}
        </button>
      </div>
    </motion.div>
  );

  // --- Payment Password Overlay ---
  const renderPaymentOverlay = () => isPaying ? (
    <div className="fixed inset-0 z-[2002] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center">
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden">
        <div className="relative border-b border-slate-100 p-4 text-center">
          <button onClick={() => setIsPaying(false)} className="absolute left-4 top-1/2 -translate-y-1/2 p-1"><X className="w-5 h-5 text-slate-900" /></button>
          <h3 className="font-bold text-slate-900 text-lg">请输入支付密码</h3>
        </div>
        <div className="p-8 flex flex-col items-center">
          <div className="text-sm text-slate-500 mb-2">FIND ME 发现我</div>
          <div className="text-3xl font-bold text-slate-900 mb-8">¥{selectedPackage?.price || 0}.00</div>
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <div key={i} className="w-12 h-12 border border-slate-200 rounded-lg flex items-center justify-center bg-slate-50">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.3 }} className="w-3 h-3 bg-slate-900 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 bg-slate-100 gap-[1px] pt-[1px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (<button key={num} className="bg-white py-5 text-xl font-medium active:bg-slate-50">{num}</button>))}
          <div className="bg-slate-100" />
          <button className="bg-white py-5 text-xl font-medium active:bg-slate-50">0</button>
          <button className="bg-slate-100 flex items-center justify-center active:bg-slate-200"><X className="w-6 h-6 text-slate-900" /></button>
        </div>
      </motion.div>
    </div>
  ) : null;

  // --- Success Page ---
  const renderSuccessPage = (onViewOrder: () => void, onBack: () => void) => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col bg-white p-6 text-center overflow-y-auto">
      {/* Back button */}
      <div className="flex items-center mb-4 -mx-2">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <Check className="w-12 h-12 text-green-600" />
      </motion.div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">支付成功</h2>
      <p className="text-slate-500 mb-12">订单已确认，请前往门店使用</p>
      <div className="w-full space-y-4">
        <motion.button whileTap={{ scale: 0.95 }} onClick={onViewOrder} className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-lg shadow-lg">查看订单</motion.button>
        <div className="grid grid-cols-2 gap-4">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => { resetAll(); onNavigate('encounter'); }} className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <motion.div animate={{ scale: [1, 2], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-full h-full bg-blue-500 rounded-full" />
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform relative z-10"><MapPin className="w-6 h-6 text-blue-500" /></div>
            <div className="text-center relative z-10">
              <div className="font-bold text-slate-900">开启偶遇雷达</div>
              <div className="text-[10px] text-blue-500 font-medium mt-0.5">附近有28人正在等你</div>
            </div>
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => { resetAll(); onNavigate('moments'); }} className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all group relative">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.5 }} className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-20 flex items-center gap-1 border-2 border-white">
              <motion.span animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>+12个新朋友</motion.span>
            </motion.div>
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform relative z-10"><Camera className="w-6 h-6 text-purple-500" /></div>
            <div className="text-center relative z-10">
              <div className="font-bold text-slate-900">探索周边新鲜事</div>
              <div className="text-[10px] text-purple-500 font-medium mt-0.5">发现有趣灵魂</div>
            </div>
          </motion.button>
        </div>
      </div>
      </div>
    </motion.div>
  );

  // --- Order Detail Page ---
  const renderOrderDetail = (pkg: PackageType | null, restaurant: RestaurantType | null, onBack: () => void) => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-24">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 pt-12 pb-4 border-b border-slate-100 flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
        <h1 className="text-xl font-bold text-slate-900">订单详情</h1>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <h3 className="font-bold text-lg text-slate-900 mb-1">{pkg?.name || '套餐'}</h3>
          <p className="text-slate-500 text-sm mb-6">有效期至 2026-03-15</p>
          <div className="w-48 h-48 bg-slate-900 rounded-xl flex items-center justify-center mb-4"><ScanLine className="w-24 h-24 text-white opacity-50" /></div>
          <div className="bg-slate-50 px-4 py-2 rounded-lg mb-2">
            <span className="text-slate-400 text-xs block mb-1">核销码</span>
            <span className="text-xl font-mono font-bold text-slate-900 tracking-widest">8829 1034</span>
          </div>
          <p className="text-xs text-slate-400">请向店员出示此码核销</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
            <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden"><img src={restaurant?.image || ''} alt="Restaurant" className="w-full h-full object-cover" /></div>
            <div>
              <h4 className="font-bold text-slate-900">{restaurant?.name}</h4>
              <div className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3 h-3" />{restaurant?.location}</div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">下单时间</span><span className="text-slate-900">{new Date().toLocaleString('zh-CN')}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">支付方式</span><span className="text-slate-900">{paymentMethod === 'wechat' ? '微信支付' : '支付宝'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">实付金额</span><span className="font-bold text-slate-900">¥{pkg?.price || 0}.00</span></div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm">联系商家</button>
          <button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm">申请退款</button>
        </div>
      </div>
    </motion.div>
  );

  // --- Package List (reusable for both relation and normal packages) ---
  const renderPackageList = (title: string, subtitle: string, packages: PackageType[], restaurant: RestaurantType, onBack: () => void, onSelectPkg: (pkg: PackageType) => void) => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-8">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 pt-12 pb-4 border-b border-slate-100 flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {packages.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100">暂无匹配套餐</div>
        ) : packages.map(pkg => (
          <motion.div key={pkg.id} whileTap={{ scale: 0.98 }} onClick={() => onSelectPkg(pkg)} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex">
              <img src={pkg.image} alt={pkg.name} className="w-28 h-28 object-cover shrink-0" />
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{pkg.name}</h4>
                  <p className="text-slate-500 text-xs line-clamp-2">{pkg.desc}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-500 font-bold text-lg">¥{pkg.price}</span>
                  <span className="text-slate-400 line-through text-xs">¥{pkg.originalPrice}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // --- Restaurant Detail + Package List (for ONLINE flow step 3) ---
  const renderRestaurantWithRelationPackages = (restaurant: RestaurantType, onBack: () => void, onSelectPkg: (pkg: PackageType) => void) => {
    const pkgs = getRelationPackages(restaurant);
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-24">
        <div className="relative h-56 bg-slate-200 shrink-0">
          <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />
          <button onClick={onBack} className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"><ArrowLeft className="w-5 h-5" /></button>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="font-bold text-xl">{restaurant.name}</h2>
            <div className="flex items-center gap-2 text-xs opacity-90 mt-1"><MapPin className="w-3 h-3" /><span>{restaurant.location}</span></div>
          </div>
          <div className="absolute top-12 right-6 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-orange-500"><Star className="w-3 h-3 fill-current" />{restaurant.rating}</div>
        </div>
        <div className="p-4 space-y-4 -mt-6 relative z-10">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              {restaurant.tags.map((tag, idx) => (<span key={idx} className="bg-slate-50 text-slate-500 text-xs px-2 py-1 rounded-lg">{tag}</span>))}
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-slate-500"><Clock className="w-4 h-4" /><span>{restaurant.hours}</span></div>
              <span className="text-slate-900 font-bold">{restaurant.price}</span>
            </div>
          </div>
          {selectedRelation && (
            <div className="flex items-center gap-2 px-1">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-slate-500">已为你筛选「{RELATIONS.find(r => r.id === selectedRelation)?.label}」专属套餐</span>
            </div>
          )}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 px-1">关系专属套餐</h3>
            {pkgs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100">暂无匹配套餐</div>
            ) : pkgs.map(pkg => (
              <motion.div key={pkg.id} whileTap={{ scale: 0.98 }} onClick={() => onSelectPkg(pkg)} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex">
                  <img src={pkg.image} alt={pkg.name} className="w-28 h-28 object-cover shrink-0" />
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{pkg.name}</h4>
                      <p className="text-slate-500 text-xs line-clamp-2">{pkg.desc}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-500 font-bold text-lg">¥{pkg.price}</span>
                      <span className="text-slate-400 line-through text-xs">¥{pkg.originalPrice}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };


  // ========== PORTAL CONTENT ==========
  const fullScreenContent = (
    <AnimatePresence mode="wait">
      {/* ===== ONLINE FLOW ===== */}
      {flowMode === 'online' && onlineStep >= 2 && (
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-0 z-[9999] bg-slate-50 flex flex-col overflow-hidden">
          {/* Online Step 2: Multi-Restaurant List */}
          {onlineStep === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-8">
              <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 pt-12 pb-4 border-b border-slate-100 flex items-center gap-4">
                <button onClick={() => { setOnlineStep(1); setFlowMode(null); }} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">推荐商家</h1>
                  <p className="text-xs text-slate-400">{RELATIONS.find(r => r.id === selectedRelation)?.label} · 为你精选</p>
                </div>
              </div>
              {/* Relation Advice Card */}
              {selectedRelation && RELATION_ADVICE[selectedRelation] && (() => {
                const advice = RELATION_ADVICE[selectedRelation];
                const relation = RELATIONS.find(r => r.id === selectedRelation);
                return (
                  <div className="px-4 pt-4">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`rounded-2xl overflow-hidden border-2 ${relation?.border || 'border-slate-200'} ${relation?.bg || 'bg-slate-50'}`}
                    >
                      {/* Card Header */}
                      <div className="px-5 pt-5 pb-3 flex items-start gap-3">
                        <span className="text-3xl">{advice.emoji}</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-base">{advice.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{advice.subtitle}</p>
                        </div>
                      </div>
                      {/* Tips */}
                      <div className="px-5 pb-3 space-y-2">
                        {advice.tips.map((tip, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className={`w-5 h-5 rounded-full bg-white/80 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <Sparkles className={`w-3 h-3 ${relation?.color || 'text-slate-400'}`} />
                            </div>
                            <span className="text-sm text-slate-600 leading-relaxed">{tip}</span>
                          </div>
                        ))}
                      </div>
                      {/* Atmosphere Tag */}
                      <div className="px-5 pb-4">
                        <div className="bg-white/60 rounded-xl px-4 py-2.5 flex items-center gap-2">
                          <span className="text-xs text-slate-400">推荐氛围</span>
                          <span className={`text-xs font-bold ${relation?.color || 'text-slate-600'}`}>{advice.atmosphere}</span>
                        </div>
                      </div>
                    </motion.div>
                    {/* Transition text */}
                    <div className="flex items-center gap-3 py-4">
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-xs text-slate-400 flex-shrink-0">因为你选了「{relation?.label}」，为你推荐以下商家</span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>
                  </div>
                );
              })()}
              <div className="px-4 pb-4 space-y-4">
                {filteredRestaurants.map(restaurant => (
                  <motion.div key={restaurant.id} whileTap={{ scale: 0.98 }} onClick={() => handleOnlineSelectRestaurant(restaurant)} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="relative h-40">
                      <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="font-bold text-lg">{restaurant.name}</h3>
                        <div className="flex items-center gap-2 text-xs opacity-90 mt-1"><MapPin className="w-3 h-3" /><span>{restaurant.location}</span></div>
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-orange-500"><Star className="w-3 h-3 fill-current" />{restaurant.rating}</div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {restaurant.tags.map((tag, idx) => (<span key={idx} className="bg-slate-50 text-slate-500 text-xs px-2 py-1 rounded-lg">{tag}</span>))}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">{restaurant.relationPackages.length}个套餐可选</span>
                        <div className="flex items-center gap-1 text-slate-900 font-bold">{restaurant.price}<ChevronRight className="w-4 h-4" /></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          {/* Online Step 3: Restaurant Detail + Relation Package List */}
          {onlineStep === 3 && selectedRestaurant && renderRestaurantWithRelationPackages(
            selectedRestaurant,
            () => setOnlineStep(2),
            (pkg) => { setSelectedPackage(pkg); setOnlinePackageSource('relation'); setOnlineStep(4); }
          )}
          {/* Online Step 4: Package Detail */}
          {onlineStep === 4 && selectedPackage && selectedRestaurant && renderPackageDetail(
            selectedPackage, selectedRestaurant,
            () => setOnlineStep(onlinePackageSource === 'normal' ? 9 : 3),
            () => setOnlineStep(5)
          )}
          {/* Online Step 5: Payment */}
          {onlineStep === 5 && selectedPackage && selectedRestaurant && renderPaymentPage(
            selectedPackage, selectedRestaurant,
            () => setOnlineStep(4)
          )}
          {renderPaymentOverlay()}
          {/* Online Step 6: Success */}
          {onlineStep === 6 && renderSuccessPage(
            () => setOnlineStep(7),
            () => setOnlineStep(onlinePackageSource === 'normal' ? 9 : 3)
          )}
          {/* Online Step 7: Order Detail */}
          {onlineStep === 7 && renderOrderDetail(selectedPackage, selectedRestaurant, () => setOnlineStep(6))}

          {/* Online Step 8: Pure Group-Buy Restaurant List (no relation) */}
          {onlineStep === 8 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-8">
              <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="px-4 pt-12 pb-3 flex items-center gap-4">
                  <button onClick={() => { setOnlineStep(1); setFlowMode(null); }} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">团购商家</h1>
                    <p className="text-xs text-slate-400">吃 / 喝 / 玩 · 热门套餐</p>
                  </div>
                </div>
                {/* Category Filter Tabs */}
                <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {RESTAURANT_CATEGORIES.map(cat => (
                    <motion.button
                      key={cat}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat}
                    </motion.button>
                  ))}
                  {/* Clear Filter Button - always visible */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedCategory('全部')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory !== '全部'
                        ? 'text-red-500 bg-red-50 border border-red-200 hover:bg-red-100'
                        : 'text-slate-300 bg-slate-50 border border-slate-100 cursor-default'
                    }`}
                    disabled={selectedCategory === '全部'}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>清除筛选</span>
                  </motion.button>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {categoryFilteredRestaurants.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <ShoppingBag className="w-12 h-12 mb-3 opacity-40" />
                    <p className="text-sm">暂无「{selectedCategory}」类商家</p>
                    <button onClick={() => setSelectedCategory('全部')} className="mt-3 text-sm text-blue-500 font-medium">查看全部商家</button>
                  </div>
                ) : categoryFilteredRestaurants.map(restaurant => (
                  <motion.div key={restaurant.id} whileTap={{ scale: 0.98 }} onClick={() => handleOnlineSelectRestaurantNormal(restaurant)} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="relative h-40">
                      <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="font-bold text-lg">{restaurant.name}</h3>
                        <div className="flex items-center gap-2 text-xs opacity-90 mt-1"><MapPin className="w-3 h-3" /><span>{restaurant.location}</span></div>
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-orange-500"><Star className="w-3 h-3 fill-current" />{restaurant.rating}</div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-50 text-blue-500 text-xs px-2 py-1 rounded-lg font-medium">{restaurant.category}</span>
                        {restaurant.tags.slice(0, 2).map((tag, idx) => (<span key={idx} className="bg-slate-50 text-slate-500 text-xs px-2 py-1 rounded-lg">{tag}</span>))}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">{restaurant.normalPackages.length}个团购套餐可选</span>
                        <div className="flex items-center gap-1 text-slate-900 font-bold">{restaurant.price}<ChevronRight className="w-4 h-4" /></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Online Step 9: Restaurant Detail + Normal Package List */}
          {onlineStep === 9 && selectedRestaurant && renderPackageList(
            '团购套餐',
            `${selectedRestaurant.name} · 全部团购`,
            selectedRestaurant.normalPackages,
            selectedRestaurant,
            () => setOnlineStep(8),
            (pkg) => { setSelectedPackage(pkg); setOnlinePackageSource('normal'); setOnlineStep(4); }
          )}
        </motion.div>
      )}

    </AnimatePresence>
  );

  // ========== MAIN ENTRY PAGE (Online Flow Entry) ==========
  return (
    <div className="absolute inset-0 bg-white flex flex-col overflow-hidden">
      {createPortal(fullScreenContent, document.body)}

      {/* Entry Page: Relation Selection */}
      {!flowMode && (
        <div className="flex-1 flex flex-col bg-white relative h-full overflow-y-auto pb-36">
          {/* Back Button */}
          <button onClick={() => onNavigate('encounter')} className="fixed top-12 left-6 w-10 h-10 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform z-[10000]">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>

          {/* Header */}
          <div className="px-6 pt-24 pb-2">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">相见</h1>
            <p className="text-slate-400 text-sm leading-relaxed">这次见面怎么安排？<br/>请选择适合你的关系场景</p>
          </div>

          {/* Relation Grid */}
          <div className="px-6 pt-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">你们是什么关系？</h2>
            <div className="grid grid-cols-2 gap-3">
              {RELATIONS.map((relation, idx) => {
                const Icon = relation.icon;
                return (
                  <motion.button
                    key={relation.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setFlowMode('online');
                      handleOnlineSelectRelation(relation);
                    }}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 ${relation.border} ${relation.bg} transition-all hover:shadow-md active:shadow-sm`}
                  >
                    <div className={`w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-sm`}>
                      <Icon className={`w-5 h-5 ${relation.color}`} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-900 text-sm">{relation.label}</div>
                      <div className="text-[10px] text-slate-400">{relation.desc}</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Skip Relation Button (secondary, bottom of grid) */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOnlineSkipRelation}
              className="mt-6 mb-8 w-full bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 text-blue-600 rounded-2xl p-4 flex items-center justify-center gap-3 hover:shadow-md transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="font-bold text-sm">暂不选择关系，直接查看团购套餐</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>


        </div>
      )}
    </div>
  );
}
