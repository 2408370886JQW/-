import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MessageCircle, Send, MoreHorizontal, MapPin, ChevronLeft, ChevronRight, Star, Share2, UserPlus, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Comment {
  id: number;
  user: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface MomentDetailProps {
  moment: {
    id: number;
    user?: string;
    avatar?: string;
    content: string;
    title?: string; // Added title support
    images?: string[];
    image?: string;
    likes: number;
    comments: number;
    location?: string;
    hashtags?: string[];
    time?: string;
    isLiked?: boolean;
    isCollected?: boolean;
  };
  onClose: () => void;
}

// Mock initial comments with nested structure
const INITIAL_COMMENTS: Comment[] = [
  { 
    id: 1, 
    user: "Alice", 
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", 
    content: "太好看了！😍 这个地方在哪里呀？", 
    time: "10-24",
    likes: 12,
    replies: [
      {
        id: 11,
        user: "我",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
        content: "就在市中心那个新开的商场三楼哦！",
        time: "10-24",
        likes: 2
      },
      {
        id: 12,
        user: "Alice",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        content: "收到！周末去打卡~",
        time: "10-24",
        likes: 1
      }
    ]
  },
  { 
    id: 2, 
    user: "Bob", 
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", 
    content: "拍得真不错，构图很棒！📷", 
    time: "10-23",
    likes: 5,
    replies: []
  },
  { 
    id: 3, 
    user: "Charlie", 
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop", 
    content: "看起来很好吃😋", 
    time: "10-23",
    likes: 0,
    replies: []
  },
];

export default function MomentDetail({ moment, onClose }: MomentDetailProps) {
  const [isLiked, setIsLiked] = useState(moment.isLiked || false);
  const [isCollected, setIsCollected] = useState(moment.isCollected || false);
  const [likeCount, setLikeCount] = useState(moment.likes);
  const [collectCount, setCollectCount] = useState(128); // Mock collect count
  const [commentText, setCommentText] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [replyTo, setReplyTo] = useState<{ id: number, user: string } | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const images = moment.images || (moment.image ? [moment.image] : []);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleCollect = () => {
    if (isCollected) {
      setCollectCount(prev => prev - 1);
    } else {
      setCollectCount(prev => prev + 1);
    }
    setIsCollected(!isCollected);
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: Date.now(),
      user: "我",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop", // Current user mock
      content: commentText,
      time: "刚刚",
      likes: 0,
      replies: []
    };
    
    if (replyTo) {
      // Add as reply
      setComments(comments.map(c => {
        if (c.id === replyTo.id) {
          return {
            ...c,
            replies: [...(c.replies || []), newComment]
          };
        }
        return c;
      }));
      setReplyTo(null);
    } else {
      // Add as top-level comment
      setComments([newComment, ...comments]);
    }
    
    setCommentText("");
    
    // Scroll to bottom of comments if needed, or just show toast
  };

  const toggleCommentLike = (commentId: number, isReply = false, parentId?: number) => {
    if (isReply && parentId) {
      setComments(comments.map(c => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: c.replies?.map(r => 
              r.id === commentId 
                ? { ...r, likes: r.isLiked ? r.likes - 1 : r.likes + 1, isLiked: !r.isLiked }
                : r
            )
          };
        }
        return c;
      }));
    } else {
      setComments(comments.map(c => 
        c.id === commentId 
          ? { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked }
          : c
      ));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-white flex flex-col md:flex-row"
    >
      {/* Left Side: Media (Image/Video) - Full height on desktop, top part on mobile */}
      <div className="relative w-full md:w-[60%] h-[50vh] md:h-full bg-black flex items-center justify-center overflow-hidden shrink-0">
        {/* Mobile Back Button */}
        <button 
          onClick={onClose}
          className="md:hidden absolute top-safe left-4 z-20 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-contain bg-black"
          />
        </AnimatePresence>

        {/* Image Navigation Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <div 
                key={idx}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  idx === currentImageIndex ? "bg-white w-3" : "bg-white/40"
                )}
              />
            ))}
          </div>
        )}
        
        {/* Navigation Arrows (Desktop) */}
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length); }}
              className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/40 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev + 1) % images.length); }}
              className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/40 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Right Side: Content & Interaction - Scrollable */}
      <div className="flex-1 flex flex-col h-[50vh] md:h-full bg-white relative">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <img 
              src={moment.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} 
              className="w-9 h-9 rounded-full object-cover border border-slate-100"
            />
            <span className="font-medium text-slate-900 text-sm">{moment.user || "用户"}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant={isFollowing ? "outline" : "default"}
              size="sm"
              onClick={() => setIsFollowing(!isFollowing)}
              className={cn(
                "rounded-full px-5 h-8 text-xs font-medium transition-all",
                isFollowing 
                  ? "border-slate-200 text-slate-500 hover:bg-slate-50" 
                  : "bg-red-500 hover:bg-red-600 text-white shadow-sm"
              )}
            >
              {isFollowing ? "已关注" : "关注"}
            </Button>
            <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
          <div className="p-4 md:p-6 pb-32">
            {/* Mobile User Info Bar */}
            <div className="md:hidden flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={moment.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} 
                  className="w-9 h-9 rounded-full object-cover border border-slate-100"
                />
                <span className="font-medium text-slate-900 text-sm">{moment.user || "用户"}</span>
              </div>
              <Button 
                variant={isFollowing ? "outline" : "default"}
                size="sm"
                onClick={() => setIsFollowing(!isFollowing)}
                className={cn(
                  "rounded-full px-4 h-7 text-xs font-medium transition-all",
                  isFollowing 
                    ? "border-slate-200 text-slate-500 hover:bg-slate-50" 
                    : "bg-red-500 hover:bg-red-600 text-white"
                )}
              >
                {isFollowing ? "已关注" : "关注"}
              </Button>
            </div>

            {/* Title & Content */}
            <div className="space-y-2 mb-4">
              <h1 className="text-lg font-bold text-slate-900 leading-snug">
                {moment.title || moment.content.slice(0, 20)}
              </h1>
              <p className="text-slate-800 text-[15px] leading-relaxed whitespace-pre-wrap">
                {moment.content}
              </p>
            </div>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {moment.hashtags?.map(tag => (
                <span key={tag} className="text-blue-600 text-[15px] hover:underline cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span>{moment.time || "10-24"}</span>
                {moment.location && (
                  <span className="flex items-center gap-0.5 text-blue-600">
                    {moment.location}
                  </span>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
              <div className="text-sm text-slate-500 font-medium">
                共 {comments.reduce((acc, curr) => acc + 1 + (curr.replies?.length || 0), 0)} 条评论
              </div>
              
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-3 group">
                  <img src={comment.avatar} className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="text-xs font-medium text-slate-500">{comment.user}</div>
                      <button 
                        onClick={() => toggleCommentLike(comment.id)}
                        className="flex flex-col items-center gap-0.5"
                      >
                        <Heart className={cn("w-3.5 h-3.5", comment.isLiked ? "fill-red-500 text-red-500" : "text-slate-300")} />
                        <span className={cn("text-[10px]", comment.isLiked ? "text-red-500" : "text-slate-300")}>
                          {comment.likes || "赞"}
                        </span>
                      </button>
                    </div>
                    
                    <p className="text-sm text-slate-800 mt-0.5 leading-relaxed cursor-pointer" onClick={() => setReplyTo({ id: comment.id, user: comment.user })}>
                      {comment.content}
                      <span className="text-xs text-slate-400 ml-2">{comment.time}</span>
                    </p>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 space-y-3">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex gap-2.5">
                            <img src={reply.avatar} className="w-6 h-6 rounded-full object-cover shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="text-xs font-medium text-slate-500">{reply.user}</div>
                                <button 
                                  onClick={() => toggleCommentLike(reply.id, true, comment.id)}
                                  className="flex flex-col items-center gap-0.5"
                                >
                                  <Heart className={cn("w-3 h-3", reply.isLiked ? "fill-red-500 text-red-500" : "text-slate-300")} />
                                  <span className={cn("text-[10px]", reply.isLiked ? "text-red-500" : "text-slate-300")}>
                                    {reply.likes || "赞"}
                                  </span>
                                </button>
                              </div>
                              <p className="text-sm text-slate-800 mt-0.5 leading-relaxed">
                                {reply.content}
                                <span className="text-xs text-slate-400 ml-2">{reply.time}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Interaction Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-3 pb-safe z-20 flex items-center gap-4">
          <div className="flex-1 relative">
            <Input 
              placeholder={replyTo ? `回复 ${replyTo.user}...` : "说点什么..."}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="bg-slate-100 border-none rounded-full pl-4 pr-10 h-10 text-sm focus-visible:ring-1 focus-visible:ring-slate-300"
              onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
            />
            {commentText && (
              <button 
                onClick={handleSendComment}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-5 shrink-0">
            <button 
              onClick={handleLike}
              className="flex flex-col items-center gap-0.5 group"
            >
              <Heart className={cn(
                "w-6 h-6 transition-all active:scale-75", 
                isLiked ? "fill-red-500 text-red-500" : "text-slate-800 group-hover:text-slate-600"
              )} />
              <span className={cn("text-[10px] font-medium", isLiked ? "text-red-500" : "text-slate-600")}>
                {likeCount}
              </span>
            </button>
            
            <button 
              onClick={handleCollect}
              className="flex flex-col items-center gap-0.5 group"
            >
              <Star className={cn(
                "w-6 h-6 transition-all active:scale-75", 
                isCollected ? "fill-amber-400 text-amber-400" : "text-slate-800 group-hover:text-slate-600"
              )} />
              <span className={cn("text-[10px] font-medium", isCollected ? "text-amber-400" : "text-slate-600")}>
                {collectCount}
              </span>
            </button>
            
            <button className="flex flex-col items-center gap-0.5 group">
              <MessageCircle className="w-6 h-6 text-slate-800 group-hover:text-slate-600 transition-colors" />
              <span className="text-[10px] font-medium text-slate-600">
                {comments.reduce((acc, curr) => acc + 1 + (curr.replies?.length || 0), 0)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
