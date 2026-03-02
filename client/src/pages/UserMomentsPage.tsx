import { useState, useRef, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Heart, MessageCircle, Send, ThumbsUp } from "lucide-react";

// Comment type
interface Comment {
  id: string;
  avatar: string;
  nickname: string;
  content: string;
  time: string;
  likes: number;
}

// Mock comments data for each moment
const MOCK_COMMENTS: Record<string, Comment[]> = {
  m1: [
    { id: "c1", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop", nickname: "小雨", content: "好美的日落！是在哪里拍的呀？", time: "2小时前", likes: 5 },
    { id: "c2", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop", nickname: "阿杰", content: "绝了，这光线太棒了", time: "3小时前", likes: 2 },
  ],
  m2: [
    { id: "c3", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", nickname: "大卫", content: "这家咖啡店在哪？看起来很不错", time: "1小时前", likes: 8 },
    { id: "c4", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop", nickname: "小雨", content: "下次带我一起去！", time: "1小时前", likes: 3 },
    { id: "c5", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop", nickname: "小鹿", content: "就在三里屯那边，超好喝的拿铁", time: "45分钟前", likes: 1 },
  ],
  m3: [
    { id: "c6", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop", nickname: "Leo", content: "看着好馋啊", time: "5小时前", likes: 4 },
  ],
  m4: [
    { id: "c7", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", nickname: "大卫", content: "好可爱！是橘猫吗？", time: "30分钟前", likes: 12 },
    { id: "c8", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop", nickname: "小雨", content: "我也想rua", time: "20分钟前", likes: 6 },
    { id: "c9", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop", nickname: "阿杰", content: "这猫的表情太搞笑了哈哈", time: "15分钟前", likes: 3 },
  ],
  m5: [
    { id: "c10", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", nickname: "大卫", content: "拍得真好看", time: "2小时前", likes: 7 },
  ],
  m8: [
    { id: "c11", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop", nickname: "小鹿", content: "这个汉堡看着太诱人了！", time: "1小时前", likes: 15 },
    { id: "c12", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop", nickname: "小雨", content: "在哪家店？我也要去打卡", time: "45分钟前", likes: 9 },
    { id: "c13", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop", nickname: "Leo", content: "上次一起吃的那家吧？确实好吃", time: "30分钟前", likes: 4 },
  ],
  m9: [
    { id: "c14", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop", nickname: "小鹿", content: "北京的秋天真的太美了", time: "3小时前", likes: 22 },
    { id: "c15", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop", nickname: "阿杰", content: "这是故宫附近拍的吗？", time: "2小时前", likes: 8 },
  ],
  m10: [
    { id: "c16", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop", nickname: "小雨", content: "你们这帮兄弟感情真好", time: "4小时前", likes: 6 },
  ],
  m11: [
    { id: "c17", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop", nickname: "小鹿", content: "生日快乐呀！🎂", time: "6小时前", likes: 18 },
    { id: "c18", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop", nickname: "Leo", content: "蛋糕看着不错", time: "5小时前", likes: 3 },
    { id: "c19", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop", nickname: "小雨", content: "下次叫上我！", time: "4小时前", likes: 5 },
    { id: "c20", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", nickname: "阿杰", content: "哈哈生日快乐老哥", time: "3小时前", likes: 2 },
  ],
};

// Same mock data as Home.tsx - in production this would come from API
const USER_DATA: Record<number, {
  id: number;
  nickname: string;
  avatar: string;
  zodiac: string;
  tags: string[];
  gender: string;
  moments: { id: string; image: string; likes: number; content: string }[];
}> = {
  1: {
    id: 1,
    nickname: "小鹿",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    zodiac: "双子座",
    tags: ["摄影", "咖啡"],
    gender: "female",
    moments: [
      { id: "m1", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop", likes: 24, content: "海边日落" },
      { id: "m2", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=600&fit=crop", likes: 156, content: "下午茶时光" },
      { id: "m3", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=600&fit=crop", likes: 45, content: "周末聚餐" },
      { id: "m4", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop", likes: 89, content: "偶遇小猫" },
      { id: "m5", image: "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=600&h=600&fit=crop", likes: 67, content: "闺蜜出游" },
    ],
  },
  3: {
    id: 3,
    nickname: "大卫",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    zodiac: "狮子座",
    tags: ["美食", "旅行", "音乐"],
    gender: "male",
    moments: [
      { id: "m8", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop", likes: 210, content: "必吃汉堡" },
      { id: "m9", image: "https://images.unsplash.com/photo-1508189860359-777d945909ef?w=600&h=600&fit=crop", likes: 445, content: "北京秋色" },
      { id: "m10", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=600&fit=crop", likes: 128, content: "兄弟聚会" },
      { id: "m11", image: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=600&h=600&fit=crop", likes: 56, content: "生日派对" },
    ],
  },
};

export default function UserMomentsPage() {
  const [, params] = useRoute("/user-moments/:userId");
  const userId = params?.userId ? parseInt(params.userId) : null;
  const user = userId ? USER_DATA[userId] : null;

  const [likedMoments, setLikedMoments] = useState<Set<string>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(() => {
    // Initialize with mock data
    const initial: Record<string, Comment[]> = {};
    if (user) {
      user.moments.forEach((m) => {
        initial[m.id] = MOCK_COMMENTS[m.id] || [];
      });
    }
    return initial;
  });
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [activeCommentMomentId, setActiveCommentMomentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Re-initialize comments when user changes
  useEffect(() => {
    if (user) {
      const initial: Record<string, Comment[]> = {};
      user.moments.forEach((m) => {
        initial[m.id] = MOCK_COMMENTS[m.id] || [];
      });
      setCommentsMap(initial);
    }
  }, [userId]);

  const toggleLike = (momentId: string) => {
    setLikedMoments((prev) => {
      const next = new Set(prev);
      if (next.has(momentId)) {
        next.delete(momentId);
      } else {
        next.add(momentId);
      }
      return next;
    });
  };

  const toggleCommentLike = (commentId: string) => {
    setLikedComments((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  const toggleExpandComments = (momentId: string) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(momentId)) {
        next.delete(momentId);
      } else {
        next.add(momentId);
      }
      return next;
    });
  };

  const openCommentInput = (momentId: string) => {
    setActiveCommentMomentId(momentId);
    setCommentText("");
    // Focus input after state update
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const submitComment = () => {
    if (!commentText.trim() || !activeCommentMomentId) return;

    const newComment: Comment = {
      id: `new-${Date.now()}`,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
      nickname: "我",
      content: commentText.trim(),
      time: "刚刚",
      likes: 0,
    };

    setCommentsMap((prev) => ({
      ...prev,
      [activeCommentMomentId]: [...(prev[activeCommentMomentId] || []), newComment],
    }));

    // Auto-expand comments for this moment
    setExpandedComments((prev) => {
      const next = new Set(prev);
      next.add(activeCommentMomentId);
      return next;
    });

    setCommentText("");
    setActiveCommentMomentId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitComment();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500">用户不存在</p>
        <Link to="/" className="text-blue-600 text-sm font-medium">
          返回地图
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/">
            <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center active:scale-90 transition-transform">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`w-10 h-10 rounded-full border-2 overflow-hidden ${
                user.gender === "female" ? "border-pink-400" : "border-blue-400"
              }`}
            >
              <img
                src={user.avatar}
                className="w-full h-full object-cover"
                alt={user.nickname}
              />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">
                {user.nickname}的动态
              </h1>
              <p className="text-xs text-slate-400">
                共 {user.moments.length} 条动态
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Moments List */}
      <div className="px-4 py-4 space-y-4">
        {user.moments.map((moment) => {
          const isLiked = likedMoments.has(moment.id);
          const comments = commentsMap[moment.id] || [];
          const isExpanded = expandedComments.has(moment.id);
          const visibleComments = isExpanded ? comments : comments.slice(0, 2);
          const hasMoreComments = comments.length > 2 && !isExpanded;

          return (
            <div
              key={moment.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100"
            >
              {/* Image */}
              <div className="relative aspect-square">
                <img
                  src={moment.image}
                  className="w-full h-full object-cover"
                  alt={moment.content}
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm text-slate-800 font-medium mb-3">
                  {moment.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-5">
                  <button
                    className="flex items-center gap-1.5 active:scale-90 transition-transform"
                    onClick={() => toggleLike(moment.id)}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isLiked
                          ? "fill-red-500 text-red-500"
                          : "text-slate-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isLiked ? "text-red-500" : "text-slate-500"
                      }`}
                    >
                      {isLiked ? moment.likes + 1 : moment.likes}
                    </span>
                  </button>
                  <button
                    className="flex items-center gap-1.5 active:scale-90 transition-transform"
                    onClick={() => openCommentInput(moment.id)}
                  >
                    <MessageCircle className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-medium text-slate-500">
                      {comments.length > 0 ? comments.length : "评论"}
                    </span>
                  </button>
                </div>

                {/* Comments Section */}
                {comments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    {/* Comment List */}
                    <div className="space-y-3">
                      {visibleComments.map((comment) => {
                        const isCommentLiked = likedComments.has(comment.id);
                        return (
                          <div key={comment.id} className="flex gap-2.5">
                            {/* Avatar */}
                            <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                              <img
                                src={comment.avatar}
                                className="w-full h-full object-cover"
                                alt={comment.nickname}
                              />
                            </div>
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-slate-700">
                                  {comment.nickname}
                                </span>
                                <span className="text-[10px] text-slate-400 shrink-0">
                                  {comment.time}
                                </span>
                              </div>
                              <p className="text-[13px] text-slate-600 mt-0.5 leading-relaxed">
                                {comment.content}
                              </p>
                              {/* Comment actions */}
                              <div className="flex items-center gap-3 mt-1">
                                <button
                                  className="flex items-center gap-1 active:scale-90 transition-transform"
                                  onClick={() => toggleCommentLike(comment.id)}
                                >
                                  <ThumbsUp
                                    className={`w-3 h-3 ${
                                      isCommentLiked
                                        ? "fill-blue-500 text-blue-500"
                                        : "text-slate-400"
                                    }`}
                                  />
                                  <span
                                    className={`text-[11px] ${
                                      isCommentLiked
                                        ? "text-blue-500 font-medium"
                                        : "text-slate-400"
                                    }`}
                                  >
                                    {isCommentLiked
                                      ? comment.likes + 1
                                      : comment.likes > 0
                                      ? comment.likes
                                      : ""}
                                  </span>
                                </button>
                                <button
                                  className="text-[11px] text-slate-400 active:text-slate-600"
                                  onClick={() => openCommentInput(moment.id)}
                                >
                                  回复
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Show more comments */}
                    {hasMoreComments && (
                      <button
                        className="mt-2 text-xs text-blue-500 font-medium active:text-blue-700"
                        onClick={() => toggleExpandComments(moment.id)}
                      >
                        查看全部 {comments.length} 条评论
                      </button>
                    )}

                    {/* Collapse comments */}
                    {isExpanded && comments.length > 2 && (
                      <button
                        className="mt-2 text-xs text-slate-400 font-medium active:text-slate-600"
                        onClick={() => toggleExpandComments(moment.id)}
                      >
                        收起评论
                      </button>
                    )}
                  </div>
                )}

                {/* Inline comment prompt (when no comments) */}
                {comments.length === 0 && (
                  <button
                    className="mt-3 pt-3 border-t border-slate-100 w-full text-left"
                    onClick={() => openCommentInput(moment.id)}
                  >
                    <span className="text-xs text-slate-400">说点什么...</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed Bottom Comment Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-4 py-3 safe-area-bottom">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop"
              className="w-full h-full object-cover"
              alt="我"
            />
          </div>
          {/* Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                // If no moment is active, default to first moment
                if (!activeCommentMomentId && user?.moments.length) {
                  setActiveCommentMomentId(user.moments[0].id);
                }
              }}
              placeholder={
                activeCommentMomentId
                  ? "写下你的评论..."
                  : "点击评论图标开始评论"
              }
              className="w-full bg-slate-100 rounded-full px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          {/* Send Button */}
          <button
            onClick={submitComment}
            disabled={!commentText.trim() || !activeCommentMomentId}
            className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              commentText.trim() && activeCommentMomentId
                ? "bg-blue-500 text-white"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {/* Active moment indicator */}
        {activeCommentMomentId && (
          <div className="flex items-center gap-2 mt-2 px-11">
            <span className="text-[11px] text-slate-400">
              正在评论：
              {user?.moments.find((m) => m.id === activeCommentMomentId)?.content}
            </span>
            <button
              className="text-[11px] text-blue-500 font-medium"
              onClick={() => {
                setActiveCommentMomentId(null);
                setCommentText("");
              }}
            >
              取消
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
