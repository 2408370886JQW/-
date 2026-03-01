import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, Camera, Beer, Briefcase, Coffee, Moon, Heart, Gift, User, Users, 
  Share2, Check, ScanLine, ChevronRight, MapPin, Clock, Star, Navigation, X, 
  Utensils, Receipt, Sparkles, Cake, ShoppingBag, Handshake, Wine, BookOpen, RefreshCw, Award, ArrowUp, ChevronDown, ChevronUp, Flame, MessageSquare, Bookmark
} from 'lucide-react';

// ========== DATA ==========

const RELATIONS = [
  { id: 'first_meet', icon: Handshake, label: '初次见面', sceneIcon: '', subtitle: '选对地方 聊天不冷场', desc: '帮你挑好地方', bg: 'bg-pink-50', color: 'text-pink-500', border: 'border-pink-200', tag: 'romantic',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663130971121/KKMPAFsBgZZTRxVP.jpg',
    overlayColor: 'rgba(180, 80, 40, 0.65)', peopleCount: 23 },
  { id: 'couple', icon: Heart, label: '情侣约会', sceneIcon: '💕', subtitle: '浪漫的事 我们帮你想', desc: '氛围到位不踩雷', bg: 'bg-red-50', color: 'text-red-500', border: 'border-red-200', tag: 'romantic',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663130971121/nErbHJcgzurNYPeo.jpg',
    overlayColor: 'rgba(140, 30, 30, 0.65)', peopleCount: 18 },
  { id: 'bestie', icon: Camera, label: '闺蜜聚会', sceneIcon: '', subtitle: '好吃好拍还不贵', desc: '随手出片不踩雷', bg: 'bg-purple-50', color: 'text-purple-500', border: 'border-purple-200', tag: 'friends',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663130971121/YHPJLTEOSeuFPrtB.jpg',
    overlayColor: 'rgba(139, 139, 0, 0.60)', peopleCount: 12 },
  { id: 'bro', icon: Beer, label: '兄弟小聚', sceneIcon: '🍻', subtitle: '吃好喝好 就这么简单', desc: '肉管够酒管够', bg: 'bg-blue-50', color: 'text-blue-500', border: 'border-blue-200', tag: 'friends',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663130971121/pxhrlUHwirgctNxR.jpeg',
    overlayColor: 'rgba(27, 94, 32, 0.65)', peopleCount: 16 },
  { id: 'alone', icon: Coffee, label: '独处时光', sceneIcon: '☕', subtitle: '不将就 给自己充个电', desc: '安静角落治愈一下', bg: 'bg-emerald-50', color: 'text-emerald-500', border: 'border-emerald-200', tag: 'solo',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663130971121/vnlKbnnVBXsVPIXG.jpg',
    overlayColor: 'rgba(0, 77, 64, 0.60)', peopleCount: 5 },
];

// Relation Advice Card data - explains why selecting a relation matters
const RELATION_ADVICE: Record<string, { emoji: string; title: string; subtitle: string; tips: string[]; atmosphere: string }> = {
  first_meet: {
    emoji: '💫',
    title: '帮你把第一次搞定',
    subtitle: '选对地方，聊天不冷场',
    tips: ['环境安静不吵，聊得上话', '不太正式也不太随便，刚刚好', '吃完还能散散步，自然不尴尬'],
    atmosphere: '不紧张 · 聊得开 · 有氛围'
  },
  couple: {
    emoji: '💕',
    title: '约会不用自己想',
    subtitle: '帮你把浪漫安排明白',
    tips: ['灯光氛围到位，拍照也好看', '靠窗或露台位，自带仪式感', '饭后来杯甜的，完美收尾'],
    atmosphere: '有情调 · 拍得美 · 不踩雷'
  },
  bestie: {
    emoji: '📸',
    title: '姐妹局一键搞定',
    subtitle: '好吃好拍还不贵',
    tips: ['颜值高的店，随手出大片', '下午茶+拍照，经典不出错', '甜品摆盘好看，朋友圈素材管够'],
    atmosphere: '出片率高 · 甜甜的 · 聊不停'
  },
  bro: {
    emoji: '🍻',
    title: '兄弟局不用纠结',
    subtitle: '吃好喝好，别的不重要',
    tips: ['肉管够、酒管够，核心需求', '不限时不催场，放松待着', '有台球飞镖更好，边玩边聊'],
    atmosphere: '放松 · 畅快 · 不装'
  },

  alone: {
    emoji: '☕',
    title: '一个人也要好好吃',
    subtitle: '不将就，给自己充个电',
    tips: ['找个有自然光的安静角落', '一杯好咖啡配本书，治愈一下', '不赶时间，慢慢来就对了'],
    atmosphere: '安静 · 舒服 · 不被打扰'
  },
};

// Multiple restaurants for the ONLINE flow
const ALL_RESTAURANTS = [
  {
    id: 1,
    name: '花田错·西餐厅',
    category: '美食' as const,
    promoTag: { text: '限时特惠', color: 'from-red-500 to-orange-500' },
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    location: '三里屯太古里北区 N4-30',
    distance: '1.2km',
    tags: ['轻松不尬尬', '环境安静', '适合约会'],
    rating: 4.8,
    positiveRate: 96,
    price: '¥198/人',
    soldCount: 2847,
    topReview: { text: '第一次约会选这里，氛围感拉满，服务也很贴心', author: '小林同学', stars: 5 },
    reviews: [
      { text: '第一次约会选这里，氛围感拉满，服务也很贴心，服务员很会看着办事', author: '小林同学', stars: 5, date: '3天前', avatar: 'https://i.pravatar.cc/40?img=1' },
      { text: '环境很好，灯光暗暗的很有情调，意面和牛排都很不错，分量也足', author: '吃货小张', stars: 5, date: '5天前', avatar: 'https://i.pravatar.cc/40?img=5' },
      { text: '带女朋友来的，她很喜欢这里的装修风格，下次纪念日还来', author: '小王同学', stars: 5, date: '1周前', avatar: 'https://i.pravatar.cc/40?img=12' },
      { text: '性价比很高，团购套餐比单点划算很多，推荐双人套餐', author: '省钱达人', stars: 4, date: '2周前', avatar: 'https://i.pravatar.cc/40?img=20' },
    ],
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
    promoTag: { text: '口碑好店', color: 'from-blue-500 to-indigo-500' },
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    location: '国贸CBD 银泰中心B1',
    distance: '3.5km',
    tags: ['异域风情', '私密包间', '适合商务'],
    rating: 4.6,
    positiveRate: 91,
    price: '¥258/人',
    soldCount: 1563,
    topReview: { text: '包间私密性很好，谈事请客都很有面子，菜品也很有特色', author: 'David周', stars: 5 },
    reviews: [
      { text: '包间私密性很好，谈事请客都很有面子，菜品融合得很有特色', author: 'David周', stars: 5, date: '2天前', avatar: 'https://i.pravatar.cc/40?img=3' },
      { text: '很适合商务室，服务员很专业，不会频繁打扰，客户很满意', author: '商务达人', stars: 5, date: '1周前', avatar: 'https://i.pravatar.cc/40?img=8' },
      { text: '中东风情的装修很独特，拍照很出片，羊排是招牌必点', author: '美食探店小刘', stars: 5, date: '1周前', avatar: 'https://i.pravatar.cc/40?img=15' },
      { text: '价格偏高但团购套餐还行，环境和服务值这个价', author: '理性消费', stars: 4, date: '3周前', avatar: 'https://i.pravatar.cc/40?img=22' },
    ],
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
    promoTag: { text: '新店开业', color: 'from-emerald-500 to-teal-500' },
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80',
    location: '望京SOHO T2-B1',
    distance: '2.8km',
    tags: ['氛围感', '大口吃肉', '适合聚会'],
    rating: 4.7,
    positiveRate: 94,
    price: '¥168/人',
    soldCount: 4210,
    topReview: { text: '和兄弟们吃的超过瘾，肉质新鲜，烤的恰到好处，必须回购', author: '烧烤爱好者', stars: 5 },
    reviews: [
      { text: '和兄弟们吃的超过瘾，肉质新鲜，烤的恰到好处，必须回购！', author: '烧烤爱好者', stars: 5, date: '1天前', avatar: 'https://i.pravatar.cc/40?img=7' },
      { text: '聚会首选，气氛很好，服务员会帮忙烤，不用自己动手就能吃好', author: '懒人美食家', stars: 5, date: '4天前', avatar: 'https://i.pravatar.cc/40?img=11' },
      { text: '和朋友生日聚会来的，服务员还送了小蛋糕，很有心', author: '小美同学', stars: 5, date: '1周前', avatar: 'https://i.pravatar.cc/40?img=25' },
      { text: '团购套餐超值，肉的分量很足，啤酒也是精酿的，下次还来', author: '啤酒爱好者', stars: 5, date: '2周前', avatar: 'https://i.pravatar.cc/40?img=30' },
      { text: '晚上去的，氛围很棒，就是人有点多需要等位，建议提前预约', author: '夜猫小哥', stars: 4, date: '3周前', avatar: 'https://i.pravatar.cc/40?img=33' },
    ],
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
    promoTag: { text: '人气爆棚', color: 'from-purple-500 to-pink-500' },
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    location: '朝阳门外大街 凯恒中心顶层',
    distance: '4.1km',
    tags: ['高空景观', '鸡尾酒', '适合约会'],
    rating: 4.9,
    positiveRate: 98,
    price: '¥328/人',
    soldCount: 986,
    topReview: { text: '夜景绝了，约会氛围感直接拉满，鸡尾酒也很专业', author: '夜猫小姐', stars: 5 },
    reviews: [
      { text: '夜景绝了，约会氛围感直接拉满，鸡尾酒也很专业，强烈推荐', author: '夜猫小姐', stars: 5, date: '2天前', avatar: 'https://i.pravatar.cc/40?img=9' },
      { text: '视野超好，能看到整个CBD夜景，拍照随便拍都很好看', author: '摄影小白', stars: 5, date: '5天前', avatar: 'https://i.pravatar.cc/40?img=16' },
      { text: '调酒师很专业，会根据口味推荐，每次来都能喝到不一样的惊喜', author: '微醚少女', stars: 5, date: '1周前', avatar: 'https://i.pravatar.cc/40?img=21' },
      { text: '价格略贵但体验很值，特别适合特殊日子来庆祝，仪式感满分', author: '浪漫主义者', stars: 4, date: '2周前', avatar: 'https://i.pravatar.cc/40?img=28' },
    ],
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

const BADGE_TEXTS = ['推荐', '热门', '新手推荐'];

export default function MeetPage({ onNavigate }: MeetPageProps) {
  // Badge text rotation for hero card
  const [badgeTextIndex, setBadgeTextIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBadgeTextIndex(prev => (prev + 1) % BADGE_TEXTS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

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
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [adviceCollapsed, setAdviceCollapsed] = useState(false);
  const [showGuideBubble, setShowGuideBubble] = useState(() => {
    try {
      return !localStorage.getItem('meet_guide_seen');
    } catch {
      return true;
    }
  });
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('meet_favorites');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleFavorite = (id: number, e?: React.MouseEvent) => {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      try { localStorage.setItem('meet_favorites', JSON.stringify(Array.from(next))); } catch {}
      return next;
    });
  };
  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Animated sold count component with count-up effect
  const AnimatedSoldCount = ({ count }: { count: number }) => {
    const [displayCount, setDisplayCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
      if (!ref.current || hasAnimated.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const duration = 1200; // ms
            const startTime = performance.now();
            const startVal = 0;

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic for smooth deceleration
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(startVal + (count - startVal) * eased);
              setDisplayCount(current);
              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };
            requestAnimationFrame(animate);
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(ref.current);
      return () => observer.disconnect();
    }, [count]);

    const formatCount = (n: number) => {
      if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
      return String(n);
    };

    return <span ref={ref}>已售{formatCount(displayCount)}份</span>;
  };

  // Scene-to-gradient color mapping
  const sceneGradients: Record<string, string> = {
    first_meet: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #f97316 100%)',
    couple: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #ec4899 100%)',
    bestie: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 50%, #a855f7 100%)',
    bro: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #3b82f6 100%)',
    alone: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #10b981 100%)',
  };

  // Compute scene match level for a restaurant
  const getMatchLevel = (restaurant: RestaurantType): { label: string; color: string; bg: string } | null => {
    if (!selectedRelation || !relationTag) return null;
    const relation = RELATIONS.find(r => r.id === selectedRelation);
    if (!relation) return null;
    // Check how many relation packages match the current tag
    const matchingPackages = restaurant.relationPackages.filter(p => p.relationTags.includes(relationTag));
    const hasDirectTag = restaurant.relationTags.includes(relationTag);
    if (hasDirectTag && matchingPackages.length >= 2) {
      return { label: '超合适', color: 'text-white', bg: 'bg-gradient-to-r from-orange-500 to-amber-500' };
    } else if (hasDirectTag && matchingPackages.length >= 1) {
      return { label: '很不错', color: 'text-orange-500', bg: 'bg-orange-50/80' };  } else if (hasDirectTag) {
      return { label: '也合适', color: 'text-slate-500', bg: 'bg-slate-100' };
    }
    return null;
  };

  // Compute numeric match score for sorting (higher = better match)
  const getMatchScore = (restaurant: RestaurantType): number => {
    if (!selectedRelation || !relationTag) return 0;
    const matchingPackages = restaurant.relationPackages.filter(p => p.relationTags.includes(relationTag));
    const hasDirectTag = restaurant.relationTags.includes(relationTag);
    if (hasDirectTag && matchingPackages.length >= 2) return 3; // 高度匹配
    if (hasDirectTag && matchingPackages.length >= 1) return 2; // 推荐
    if (hasDirectTag) return 1; // 相关
    return 0;
  };

  // Filtered restaurants for online flow — sorted by match score (best first), with shuffle support
  const filteredRestaurants = useMemo(() => {
    const base = relationTag
      ? ALL_RESTAURANTS.filter(r => r.relationTags.includes(relationTag))
      : [...ALL_RESTAURANTS];
    // Sort by match score first
    base.sort((a, b) => getMatchScore(b) - getMatchScore(a));
    // If shuffleSeed > 0, apply seeded shuffle within same match-score groups
    if (shuffleSeed > 0) {
      // Group by match score
      const groups: Record<number, typeof base> = {};
      base.forEach(r => {
        const score = getMatchScore(r);
        if (!groups[score]) groups[score] = [];
        groups[score].push(r);
      });
      // Shuffle each group using Fisher-Yates with seed
      const seededRandom = (seed: number) => {
        let s = seed;
        return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
      };
      const rng = seededRandom(shuffleSeed);
      Object.values(groups).forEach(group => {
        for (let i = group.length - 1; i > 0; i--) {
          const j = Math.floor(rng() * (i + 1));
          [group[i], group[j]] = [group[j], group[i]];
        }
      });
      // Reassemble: highest score groups first
      const scores = Object.keys(groups).map(Number).sort((a, b) => b - a);
      const result: typeof base = [];
      scores.forEach(s => result.push(...groups[s]));
      return result;
    }
    return base;
  }, [relationTag, shuffleSeed]);

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
    setBannerDismissed(false);
    setAdviceCollapsed(false);
    setOnlineStep(2);
    // Dismiss guide bubble on first interaction
    if (showGuideBubble) {
      setShowGuideBubble(false);
      try { localStorage.setItem('meet_guide_seen', '1'); } catch {}
    }
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
    // Dismiss guide bubble on first interaction
    if (showGuideBubble) {
      setShowGuideBubble(false);
      try { localStorage.setItem('meet_guide_seen', '1'); } catch {}
    }
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

  // Scroll-based header auto-hide for onlineStep 2
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || onlineStep !== 2) return;
    const handleScroll = () => {
      const currentY = container.scrollTop;
      if (currentY > lastScrollY.current && currentY > 60) {
        setHeaderHidden(true);
      } else {
        setHeaderHidden(false);
      }
      lastScrollY.current = currentY;
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [onlineStep]);

  // Reset header visibility when step changes
  useEffect(() => {
    setHeaderHidden(false);
    lastScrollY.current = 0;
  }, [onlineStep]);

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
            <h3 className="font-bold text-slate-900 mb-3">店内实拍</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
              {pkg.gallery.map((img: string, idx: number) => (
                <img key={idx} src={img} alt={`环境 ${idx + 1}`} className="w-40 h-28 rounded-xl object-cover shrink-0" />
              ))}
            </div>
          </section>
        )}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-3">套餐里有什么</h3>
          <div className="space-y-3 text-sm text-slate-600">
            {pkg.items.map((item, idx) => (
              <div key={idx} className="flex justify-between"><span>{item.name}</span><span>x{item.qty}</span></div>
            ))}
          </div>
        </section>
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-3">买前看一眼</h3>
          <ul className="space-y-2 text-sm text-slate-500 list-disc pl-4">
            {pkg.notes.map((note, idx) => (<li key={idx}>{note}</li>))}
          </ul>
        </section>
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-3">关于这家店</h3>
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl">
            <img src={restaurant.image} alt={restaurant.name} className="w-14 h-14 rounded-xl object-cover" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{restaurant.name}</h4>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1"><MapPin className="w-3 h-3" /><span>{restaurant.location}</span></div>
            </div>
          </div>
        </section>
        {/* User Reviews Section */}
        {restaurant.reviews && restaurant.reviews.length > 0 && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900">大家怎么说</h3>
                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{restaurant.reviews.length}条评价</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-orange-500 text-sm font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{restaurant.rating}</span>
                </div>
                {restaurant.positiveRate && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    restaurant.positiveRate >= 95 ? 'bg-green-50 text-green-600' :
                    restaurant.positiveRate >= 90 ? 'bg-blue-50 text-blue-600' :
                    'bg-slate-50 text-slate-500'
                  }`}>
                    {restaurant.positiveRate}%好评
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {(reviewsExpanded ? restaurant.reviews : restaurant.reviews.slice(0, 2)).map((review: any, idx: number) => (
                <div key={idx} className={`${idx > 0 ? 'border-t border-slate-50 pt-4' : ''}`}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <img src={review.avatar} alt={review.author} className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{review.author}</span>
                        <span className="text-xs text-slate-300">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.stars ? 'fill-orange-400 text-orange-400' : 'fill-slate-200 text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed pl-[42px]">{review.text}</p>
                </div>
              ))}
            </div>
            {restaurant.reviews.length > 2 && (
              <button
                onClick={() => setReviewsExpanded(!reviewsExpanded)}
                className="w-full mt-4 py-2.5 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 bg-slate-50 rounded-xl active:scale-[0.98] transition-all"
              >
                {reviewsExpanded ? (
                  <>收起评价 <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>查看全部{restaurant.reviews.length}条评价 <ChevronDown className="w-4 h-4" /></>
                )}
              </button>
            )}
          </section>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-20">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowShareModal(true)}
            className="w-12 h-12 shrink-0 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 active:bg-slate-200 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={onSelect} className="flex-1 bg-slate-900 text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-slate-200">
            就这个了 ¥{pkg.price}
          </motion.button>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2001] bg-black/50 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-t-3xl p-6 pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
              <h3 className="font-bold text-lg text-slate-900 text-center mb-2">分享给朋友</h3>
              <p className="text-sm text-slate-400 text-center mb-6">把这个超值套餐推荐给好友一起来</p>
              
              {/* Share preview card */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                <div className="flex gap-3">
                  <img src={pkg.image} alt={pkg.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{pkg.name}</h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{restaurant.name}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-orange-500 font-bold">¥{pkg.price}</span>
                      <span className="text-slate-300 line-through text-xs">¥{pkg.originalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share options */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { icon: '💬', label: '微信', color: 'bg-green-50' },
                  { icon: '👥', label: '朋友圈', color: 'bg-green-50' },
                  { icon: '🔗', label: '复制链接', color: 'bg-blue-50' },
                  { icon: '💬', label: '短信', color: 'bg-orange-50' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setShowShareModal(false);
                      // Show a brief toast-like feedback
                      const toast = document.createElement('div');
                      toast.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/80 text-white px-6 py-3 rounded-xl text-sm font-medium z-[9999] backdrop-blur-sm';
                      toast.textContent = item.label === '复制链接' ? '链接已复制' : `即将通过${item.label}分享`;
                      document.body.appendChild(toast);
                      setTimeout(() => toast.remove(), 1500);
                    }}
                    className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
                  >
                    <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-2xl`}>
                      {item.icon}
                    </div>
                    <span className="text-xs text-slate-600">{item.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-3 bg-slate-100 rounded-full text-slate-600 font-medium text-sm active:bg-slate-200 transition-colors"
              >
                取消
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
          <h3 className="font-bold text-slate-900 mb-4">怎么付款</h3>
          <div className="space-y-3">
            <div onClick={() => setPaymentMethod('wechat')} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'wechat' ? 'border-green-500 bg-green-50' : 'border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white"><span className="font-bold text-sm">微</span></div>
                <div><span className="font-bold text-slate-900 block">微信支付</span><span className="text-xs text-slate-400">常用</span></div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'wechat' ? 'border-green-500 bg-green-500' : 'border-slate-300'}`}>
                {paymentMethod === 'wechat' && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
            <div onClick={() => setPaymentMethod('alipay')} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'alipay' ? 'border-blue-500 bg-blue-50' : 'border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white"><span className="font-bold text-sm">支</span></div>
                <div><span className="font-bold text-slate-900 block">支付宝</span><span className="text-xs text-slate-400">支持花呗</span></div>
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
          <h3 className="font-bold text-slate-900 text-lg">输入密码完成支付</h3>
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
      <p className="text-slate-500 mb-12">拿着核销码去店里就行</p>
      <div className="w-full space-y-4">
        <motion.button whileTap={{ scale: 0.95 }} onClick={onViewOrder} className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-lg shadow-lg">查看订单</motion.button>
        <div className="grid grid-cols-2 gap-4">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => { resetAll(); onNavigate('encounter'); }} className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <motion.div animate={{ scale: [1, 2], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-full h-full bg-blue-500 rounded-full" />
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform relative z-10"><MapPin className="w-6 h-6 text-blue-500" /></div>
            <div className="text-center relative z-10">
              <div className="font-bold text-slate-900">看看附近的人</div>
              <div className="text-[10px] text-blue-500 font-medium mt-0.5">说不定能遇到有缘人</div>
            </div>
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => { resetAll(); onNavigate('moments'); }} className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all group relative">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.5 }} className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-20 flex items-center gap-1 border-2 border-white">
              <motion.span animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>+12个新朋友</motion.span>
            </motion.div>
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform relative z-10"><Camera className="w-6 h-6 text-purple-500" /></div>
            <div className="text-center relative z-10">
              <div className="font-bold text-slate-900">看看周边动态</div>
              <div className="text-[10px] text-purple-500 font-medium mt-0.5">看看大家都在玩什么</div>
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
          <p className="text-xs text-slate-400">到店给店员看这个码就行</p>
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
          <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100">还没有合适的套餐</div>
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
          {/* Promo tag on detail page */}
          {restaurant.promoTag && (
            <div className={`absolute top-24 right-6 bg-gradient-to-r ${restaurant.promoTag.color} px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-md`}>
              {restaurant.promoTag.text}
            </div>
          )}
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
              <span className="text-sm text-slate-500">下面是「{RELATIONS.find(r => r.id === selectedRelation)?.label}」专属套餐</span>
            </div>
          )}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 px-1">适合这个场景的套餐</h3>
            {pkgs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100">还没有合适的套餐</div>
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
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-0 z-[9999] bg-slate-50 flex flex-col">
          {/* Online Step 2: Multi-Restaurant List */}
          {onlineStep === 2 && (
            <>
              {/* Fixed Header - always visible at top */}
              <div className="bg-white px-4 pt-14 pb-4 flex items-center gap-4 flex-shrink-0 shadow-sm">
                <button onClick={() => { setOnlineStep(1); setFlowMode(null); }} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">帮你挑好的</h1>
                  <p className="text-xs text-slate-400">{RELATIONS.find(r => r.id === selectedRelation)?.label} · 省时省心</p>
                </div>
              </div>
              {/* Scrollable Content Area */}
              <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-8">
              {/* Smart Recommendation Banner */}
              <AnimatePresence>
                {!bannerDismissed && (
                  <motion.div
                    initial={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="mx-4 mt-3 rounded-2xl relative overflow-hidden"
                    style={{ background: (selectedRelation && sceneGradients[selectedRelation]) || sceneGradients.first_meet }}
                  >
                    <div className="px-4 py-2.5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm leading-snug">
                          已按你的场景帮你筛好了
                        </p>
                        <p className="text-white/80 text-xs mt-0.5">
                          下面这些店和「{RELATIONS.find(r => r.id === selectedRelation)?.label}」最配
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setBannerDismissed(true); }}
                        className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center flex-shrink-0 transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Relation Advice Card - Collapsible */}
              {selectedRelation && RELATION_ADVICE[selectedRelation] && (() => {
                const advice = RELATION_ADVICE[selectedRelation];
                const relation = RELATIONS.find(r => r.id === selectedRelation);
                return (
                  <div className="px-4 pt-3">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`rounded-2xl overflow-hidden border-2 ${relation?.border || 'border-slate-200'} ${relation?.bg || 'bg-slate-50'}`}
                    >
                      {/* Card Header - Always visible, clickable to toggle */}
                      <button
                        onClick={() => setAdviceCollapsed(!adviceCollapsed)}
                        className="w-full px-5 pt-5 pb-3 flex items-start gap-3 text-left active:opacity-80 transition-opacity"
                      >
                        <span className="text-3xl">{advice.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 text-base">{advice.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {adviceCollapsed ? advice.atmosphere : advice.subtitle}
                          </p>
                        </div>
                        <motion.div
                          animate={{ rotate: adviceCollapsed ? 0 : 180 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className={`w-7 h-7 rounded-full bg-white/60 flex items-center justify-center flex-shrink-0 mt-1`}
                        >
                          <ChevronUp className={`w-4 h-4 ${relation?.color || 'text-slate-400'}`} />
                        </motion.div>
                      </button>
                      {/* Collapsible Content */}
                      <AnimatePresence initial={false}>
                        {!adviceCollapsed && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
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
                            {/* Atmosphere Tag + Switch Scene */}
                            <div className="px-5 pb-4 flex items-center gap-2">
                              <div className="bg-white/60 rounded-xl px-4 py-2.5 flex items-center gap-2 flex-1">
                                <span className="text-xs text-slate-400">这个场景适合</span>
                                <span className={`text-xs font-bold ${relation?.color || 'text-slate-600'}`}>{advice.atmosphere}</span>
                              </div>
                              {(() => {
                                const currentIdx = RELATIONS.findIndex(r => r.id === selectedRelation);
                                const nextIdx = (currentIdx + 1) % RELATIONS.length;
                                const nextRelation = RELATIONS[nextIdx];
                                return (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedRelation(nextRelation.id);
                                      setRelationTag(nextRelation.tag);
                                      setBannerDismissed(false);
                                      setAdviceCollapsed(false);
                                      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${relation?.color || 'text-slate-600'} bg-white/60 hover:bg-white/80`}
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    <span>换个场景</span>
                                    <span className="text-slate-400 font-normal">→ {nextRelation.label}</span>
                                  </button>
                                );
                              })()}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    {/* Simple divider */}
                    <div className="pt-2" />
                  </div>
                );
              })()}
              <div className="px-4 pb-4 space-y-4">
                {filteredRestaurants.map((restaurant, index) => {
                  const matchLevel = getMatchLevel(restaurant);
                  const isBestMatch = index === 0 && matchLevel && matchLevel.label === '超合适';
                  return (
                  <motion.div key={restaurant.id} whileTap={{ scale: 0.98 }} onClick={() => handleOnlineSelectRestaurant(restaurant)} className={`bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow ${isBestMatch ? 'border-2 border-orange-300 ring-2 ring-orange-100' : 'border border-slate-100'}`}>
                    {/* Best Match Top Banner */}
                    {isBestMatch && (
                      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-1.5 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-white" />
                        <span className="text-xs font-bold text-white">最合适</span>
                        <span className="text-xs text-white/80 ml-1">和你的场景最搭</span>
                      </div>
                    )}
                    <div className="relative h-40">
                      <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="font-bold text-lg">{restaurant.name}</h3>
                        <div className="flex items-center gap-2 text-xs opacity-90 mt-1">
                          <MapPin className="w-3 h-3" /><span>{restaurant.location}</span>
                          <span className="mx-0.5">·</span>
                          <Navigation className="w-3 h-3" /><span>{restaurant.distance}</span>
                        </div>
                      </div>
                      {/* Rating badge & Favorite */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={(e) => toggleFavorite(restaurant.id, e)}
                          className={`w-8 h-8 rounded-lg backdrop-blur flex items-center justify-center transition-colors ${favoriteIds.has(restaurant.id) ? 'bg-orange-500 text-white' : 'bg-white/90 text-slate-400'}`}
                        >
                          <Bookmark className={`w-4 h-4 ${favoriteIds.has(restaurant.id) ? 'fill-current' : ''}`} />
                        </motion.button>
                        <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-orange-500"><Star className="w-3 h-3 fill-current" />{restaurant.rating}</div>
                      </div>
                      {/* Promo tag */}
                      {restaurant.promoTag && (
                        <div className={`absolute top-3 left-3 bg-gradient-to-r ${restaurant.promoTag.color} px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-md`}>
                          {restaurant.promoTag.text}
                        </div>
                      )}
                      {/* Scene match level badge - shift down if promo tag exists */}
                      {matchLevel && !isBestMatch && (
                        <div className={`absolute ${restaurant.promoTag ? 'top-10' : 'top-3'} left-3 ${matchLevel.bg} backdrop-blur px-2.5 py-1 rounded-lg flex items-center gap-1 text-xs font-bold ${matchLevel.color} shadow-sm`}>
                          <Sparkles className="w-3 h-3" />
                          {matchLevel.label}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {restaurant.tags.map((tag: string, idx: number) => (<span key={idx} className="bg-slate-50 text-slate-500 text-xs px-2 py-1 rounded-lg">{tag}</span>))}
                      </div>
                      {/* Social proof: sold count + top review */}
                      <div className="flex items-center gap-3 mb-2.5 text-xs">
                        <div className="flex items-center gap-1 text-orange-500 font-semibold">
                          <Flame className="w-3 h-3" />
                          <AnimatedSoldCount count={restaurant.soldCount} />
                        </div>
                        {restaurant.topReview && (
                          <div className="flex-1 flex items-center gap-1.5 text-slate-400 truncate">
                            <MessageSquare className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">"{restaurant.topReview.text}"</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">{restaurant.relationPackages.length}个套餐 省得你挑</span>
                        <div className="flex items-center gap-1 text-slate-900 font-bold">{restaurant.price}<ChevronRight className="w-4 h-4" /></div>
                      </div>
                    </div>
                  </motion.div>
                  );
                })}
              </div>

              {/* Shuffle + Back to Top Buttons */}
              <div className="flex justify-center gap-3 py-6 pb-10">
                <motion.button
                  whileTap={{ scale: 0.92, rotate: 15 }}
                  onClick={() => {
                    setShuffleSeed(prev => prev + 1);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-md text-white text-sm font-bold active:shadow-lg transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  换一批推荐
                </motion.button>
                <button
                  onClick={() => {
                    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white shadow-md border border-slate-100 text-slate-500 text-sm font-medium active:scale-95 transition-all hover:shadow-lg hover:text-slate-700"
                >
                  <ArrowUp className="w-4 h-4" />
                  回到顶部
                </button>
              </div>
              </div>
            </>
          )}
          {/* Online Step 3: Restaurant Detail + Relation Package List */}
          {onlineStep === 3 && selectedRestaurant && renderRestaurantWithRelationPackages(
            selectedRestaurant,
            () => setOnlineStep(2),
            (pkg) => { setSelectedPackage(pkg); setOnlinePackageSource('relation'); setReviewsExpanded(false); setOnlineStep(4); }
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
                    <h1 className="text-xl font-bold text-slate-900">全部商家</h1>
                    <p className="text-xs text-slate-400">吃喝玩乐 · 好价套餐都在这</p>
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

                </div>
              </div>
              <div className="p-4 space-y-4">
                {categoryFilteredRestaurants.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <ShoppingBag className="w-12 h-12 mb-3 opacity-40" />
                    <p className="text-sm">还没有「{selectedCategory}」类的店</p>
                    <button onClick={() => setSelectedCategory('全部')} className="mt-3 text-sm text-blue-500 font-medium">看看全部</button>
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
                      {/* Rating badge & Favorite */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={(e) => toggleFavorite(restaurant.id, e)}
                          className={`w-8 h-8 rounded-lg backdrop-blur flex items-center justify-center transition-colors ${favoriteIds.has(restaurant.id) ? 'bg-orange-500 text-white' : 'bg-white/90 text-slate-400'}`}
                        >
                          <Bookmark className={`w-4 h-4 ${favoriteIds.has(restaurant.id) ? 'fill-current' : ''}`} />
                        </motion.button>
                        <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-orange-500"><Star className="w-3 h-3 fill-current" />{restaurant.rating}</div>
                      </div>
                      {/* Promo tag */}
                      {restaurant.promoTag && (
                        <div className={`absolute top-3 left-3 bg-gradient-to-r ${restaurant.promoTag.color} px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-md`}>
                          {restaurant.promoTag.text}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-50 text-blue-500 text-xs px-2 py-1 rounded-lg font-medium">{restaurant.category}</span>
                        {restaurant.tags.slice(0, 2).map((tag: string, idx: number) => (<span key={idx} className="bg-slate-50 text-slate-500 text-xs px-2 py-1 rounded-lg">{tag}</span>))}
                      </div>
                      {/* Social proof: sold count + top review */}
                      <div className="flex items-center gap-3 mb-2.5 text-xs">
                        <div className="flex items-center gap-1 text-orange-500 font-semibold">
                          <Flame className="w-3 h-3" />
                          <AnimatedSoldCount count={restaurant.soldCount} />
                        </div>
                        {restaurant.topReview && (
                          <div className="flex-1 flex items-center gap-1.5 text-slate-400 truncate">
                            <MessageSquare className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">"{restaurant.topReview.text}"</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">{restaurant.normalPackages.length}个好价套餐</span>
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
            (pkg) => { setSelectedPackage(pkg); setOnlinePackageSource('normal'); setReviewsExpanded(false); setOnlineStep(4); }
          )}
        </motion.div>
      )}

    </AnimatePresence>
  );

  // ========== MAIN ENTRY PAGE (Online Flow Entry) ==========
  return (
    <div className="absolute inset-0 bg-white flex flex-col overflow-hidden">
      {createPortal(fullScreenContent, document.body)}

      {/* Entry Page: Relation Selection - Hinge Explore Style */}
      {!flowMode && (
        <div className="flex-1 flex flex-col bg-[#FAFAFA] relative h-full overflow-y-auto pb-36">
          {/* Back Button */}
          <button onClick={() => onNavigate('encounter')} className="fixed top-12 left-6 w-10 h-10 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform z-[10000]">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>

          {/* Header + Subtitle + User Count */}
          <div className="px-5 pt-24 pb-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">相见</h1>
                <p className="text-[13px] text-slate-400 mt-1 leading-relaxed">告诉我你和谁见<br />剩下的交给我</p>
              </div>
              <div className="text-right mt-1.5">
                <div className="flex items-center gap-1 justify-end">
                  <div className="flex -space-x-1.5">
                    <div className="w-4 h-4 rounded-full bg-orange-300 border border-white/80" />
                    <div className="w-4 h-4 rounded-full bg-pink-300 border border-white/80" />
                    <div className="w-4 h-4 rounded-full bg-amber-300 border border-white/80" />
                  </div>
                  <span className="text-[12px] font-bold text-slate-700">{RELATIONS.reduce((sum, r) => sum + r.peopleCount, 0)} 人正在用</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">数字是正在用的人数</p>
              </div>
            </div>
          </div>

          {/* Hero Card - 初次见面 (index 0) as featured full-width horizontal with shimmer + badge */}
          <div className="px-4 pt-3 pb-2">
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setFlowMode('online');
                handleOnlineSelectRelation(RELATIONS[0]);
              }}
              className="relative w-full rounded-[16px] overflow-hidden hero-card-shimmer"
              style={{ aspectRatio: '16/10' }}
            >
              <img
                src={RELATIONS[0].image}
                alt={RELATIONS[0].label}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ backgroundColor: RELATIONS[0].overlayColor }}
              />
              {/* 推荐 Badge - top left with rotating text */}
              <div className="absolute top-3 left-3 z-10 recommend-badge rounded-full px-3 py-1 flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-xs font-extrabold tracking-wide badge-text-rotate">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={badgeTextIndex}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="inline-block"
                    >
                      {BADGE_TEXTS[badgeTextIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>
              {/* People count badge - top right */}
              <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-xs font-bold">{RELATIONS[0].peopleCount}</span>
              </div>
              {/* Bottom center text with title + subtitle (no social proof, no handshake icon) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-5 z-[1]">
                <h3 className="text-white font-extrabold text-[24px] tracking-tight">
                  {RELATIONS[0].label}
                </h3>
                <p className="text-white/80 text-[13px] mt-1 font-medium">{RELATIONS[0].subtitle}</p>
              </div>
            </motion.button>
          </div>

          {/* Guide Bubble for first-time users */}
          <AnimatePresence>
            {showGuideBubble && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="mx-4 mt-1 mb-0"
              >
                <div className="relative bg-slate-800 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg">
                  {/* Arrow pointing up */}
                  <div className="absolute -top-2 left-8 w-4 h-4 bg-slate-800 rotate-45 rounded-sm" />
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-base">👇</span>
                  </div>
                  <p className="text-white text-xs leading-relaxed flex-1">点击下方任意场景卡片  开启你的线下见面之旅</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGuideBubble(false);
                      try { localStorage.setItem('meet_guide_seen', '1'); } catch {}
                    }}
                    className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
                  >
                    <X className="w-3.5 h-3.5 text-white/70" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section Header */}
          <div className="px-5 pt-4 pb-2">
            <h2 className="text-[15px] font-extrabold text-slate-900">今天线下见面  选个场景就好</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">你只需选场景  剩下的交给我们<br />去哪儿、吃什么由你们决定  我们只是让选择更简单</p>
          </div>

          {/* Mixed Layout: Row 1 - Two horizontal short cards (情侣约会 + 闺蜜聚会) */}
          <div className="px-4 pb-3">
            <div className="grid grid-cols-2 gap-3">
              {/* 情侣约会 - horizontal short card, LEFT-aligned title */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.06 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => {
                  setFlowMode('online');
                  handleOnlineSelectRelation(RELATIONS[1]);
                }}
                className="relative rounded-[16px] overflow-hidden relation-card-press"
                style={{ aspectRatio: '4/3' }}
              >
                <img
                  src={RELATIONS[1].image}
                  alt={RELATIONS[1].label}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ backgroundColor: RELATIONS[1].overlayColor }} />
                <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                  <Users className="w-3 h-3 text-white" />
                  <span className="text-white text-[10px] font-bold">{RELATIONS[1].peopleCount}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                  <h3 className="text-white font-extrabold text-[16px] tracking-tight leading-tight flex items-center gap-1.5">
                    {RELATIONS[1].sceneIcon && <span className="text-[18px] drop-shadow-sm">{RELATIONS[1].sceneIcon}</span>}
                    {RELATIONS[1].label}
                  </h3>
                  <p className="text-white/75 text-[11px] mt-0.5 font-medium leading-tight">{RELATIONS[1].subtitle}</p>
                </div>
              </motion.button>

              {/* 闺蜜聚会 - horizontal short card, LEFT-aligned title */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.12 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => {
                  setFlowMode('online');
                  handleOnlineSelectRelation(RELATIONS[2]);
                }}
                className="relative rounded-[16px] overflow-hidden relation-card-press"
                style={{ aspectRatio: '4/3' }}
              >
                <img
                  src={RELATIONS[2].image}
                  alt={RELATIONS[2].label}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ backgroundColor: RELATIONS[2].overlayColor }} />
                <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                  <Users className="w-3 h-3 text-white" />
                  <span className="text-white text-[10px] font-bold">{RELATIONS[2].peopleCount}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                  <h3 className="text-white font-extrabold text-[16px] tracking-tight leading-tight flex items-center gap-1.5">
                    {RELATIONS[2].sceneIcon && <span className="text-[18px] drop-shadow-sm">{RELATIONS[2].sceneIcon}</span>}
                    {RELATIONS[2].label}
                  </h3>
                  <p className="text-white/75 text-[11px] mt-0.5 font-medium leading-tight">{RELATIONS[2].subtitle}</p>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Mixed Layout: Row 2 - Two tall vertical cards (兄弟小聚 + 独处时光) */}
          <div className="px-4 pb-2">
            <div className="grid grid-cols-2 gap-3">
              {/* 兄弟小聚 - tall vertical card, LEFT-aligned title */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.18 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => {
                  setFlowMode('online');
                  handleOnlineSelectRelation(RELATIONS[3]);
                }}
                className="relative rounded-[16px] overflow-hidden relation-card-press"
                style={{ aspectRatio: '3/4' }}
              >
                <img
                  src={RELATIONS[3].image}
                  alt={RELATIONS[3].label}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ backgroundColor: RELATIONS[3].overlayColor }} />
                <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                  <Users className="w-3 h-3 text-white" />
                  <span className="text-white text-[10px] font-bold">{RELATIONS[3].peopleCount}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3.5 text-left">
                  <h3 className="text-white font-extrabold text-[16px] tracking-tight leading-tight flex items-center gap-1.5">
                    <span className="text-[18px] drop-shadow-sm">{RELATIONS[3].sceneIcon}</span>
                    {RELATIONS[3].label}
                  </h3>
                  <p className="text-white/75 text-[11px] mt-0.5 font-medium leading-tight">{RELATIONS[3].subtitle}</p>
                </div>
              </motion.button>

              {/* 独处时光 - tall vertical card, CENTER-aligned title (unchanged) */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.24 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => {
                  setFlowMode('online');
                  handleOnlineSelectRelation(RELATIONS[4]);
                }}
                className="relative rounded-[16px] overflow-hidden relation-card-press"
                style={{ aspectRatio: '3/4' }}
              >
                <img
                  src={RELATIONS[4].image}
                  alt={RELATIONS[4].label}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ backgroundColor: RELATIONS[4].overlayColor }} />
                <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                  <Users className="w-3 h-3 text-white" />
                  <span className="text-white text-[10px] font-bold">{RELATIONS[4].peopleCount}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3.5 text-center">
                  <h3 className="text-white font-extrabold text-[16px] tracking-tight leading-tight flex items-center justify-center gap-1.5">
                    <span className="text-[18px] drop-shadow-sm">{RELATIONS[4].sceneIcon}</span>
                    {RELATIONS[4].label}
                  </h3>
                  <p className="text-white/75 text-[11px] mt-0.5 font-medium leading-tight">{RELATIONS[4].subtitle}</p>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Skip Relation - Photo card style matching relation cards */}
          <div className="px-4 pt-3 pb-8">
            <motion.button
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleOnlineSkipRelation}
              className="relative w-full rounded-[16px] overflow-hidden relation-card-press"
              style={{ aspectRatio: '16/6' }}
            >
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663130971121/XNVgUgHBMzervbvS.jpg"
                alt="不选场景 直接看优惠"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ backgroundColor: 'rgba(30, 41, 59, 0.65)' }} />
              {/* Left-aligned text */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-white font-extrabold text-[17px] tracking-tight flex items-center gap-1.5">
                    <span className="text-[20px] drop-shadow-sm">🍽️</span>
                    不选场景 直接看优惠
                  </h3>
                  <p className="text-white/70 text-[11px] mt-0.5 font-medium">全部商家套餐都在这，慢慢挑</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60" />
              </div>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
