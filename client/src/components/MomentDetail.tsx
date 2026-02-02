import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MessageCircle, Send, MoreHorizontal, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Comment {
  id: number;
  user: string;
  avatar: string;
  content: string;
  time: string;
}

interface MomentDetailProps {
  moment: {
    id: number;
    user?: string;
    avatar?: string;
    content: string;
    images?: string[]; // Support multiple images
    image?: string; // Fallback for single image
    likes: number;
    comments: number;
    location?: string;
    hashtags?: string[];
    time?: string;
  };
  onClose: () => void;
}

export default function MomentDetail({ moment, onClose }: MomentDetailProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(moment.likes);
  const [commentText, setCommentText] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Mock comments
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, user: "Alice", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", content: "太好看了！😍", time: "10分钟前" },
    { id: 2, user: "Bob", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", content: "求地址~", time: "5分钟前" },
  ]);

  const images = moment.images || (moment.image ? [moment.image] : []);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: Date.now(),
      user: "我",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop", // Current user mock
      content: commentText,
      time: "刚刚"
    };
    
    setComments([...comments, newComment]);
    setCommentText("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-safe left-4 z-20 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image Slider */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full h-full object-contain"
          />
        </AnimatePresence>

        {/* Image Navigation Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, idx) => (
              <div 
                key={idx}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  idx === currentImageIndex ? "bg-white w-3" : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}
        
        {/* Navigation Arrows (visible on tap or hover) */}
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev + 1) % images.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}
      </div>

      {/* Content Overlay */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 flex flex-col max-h-[50vh]">
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-2" />
        
        <div className="flex-1 overflow-y-auto p-4 pb-safe">
          {/* User Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img 
                src={moment.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} 
                className="w-10 h-10 rounded-full object-cover border border-slate-100"
              />
              <div>
                <div className="font-bold text-slate-900 text-sm">{moment.user || "用户"}</div>
                <div className="text-xs text-slate-400">{moment.time || "刚刚"}</div>
              </div>
            </div>
            <button className="text-slate-400">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Text Content */}
          <p className="text-slate-800 text-base leading-relaxed mb-3">
            {moment.content}
          </p>

          {/* Hashtags & Location */}
          <div className="flex flex-wrap gap-2 mb-4">
            {moment.hashtags?.map(tag => (
              <span key={tag} className="text-blue-600 text-sm font-medium">
                {tag}
              </span>
            ))}
            {moment.location && (
              <div className="flex items-center gap-1 text-slate-400 text-xs bg-slate-50 px-2 py-1 rounded-full">
                <MapPin className="w-3 h-3" />
                {moment.location}
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 py-3 border-t border-slate-100">
            <button 
              onClick={handleLike}
              className="flex items-center gap-1.5 group"
            >
              <div className={cn(
                "p-2 rounded-full transition-colors",
                isLiked ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-500 group-hover:bg-slate-100"
              )}>
                <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
              </div>
              <span className={cn("text-sm font-medium", isLiked ? "text-red-500" : "text-slate-500")}>
                {likeCount}
              </span>
            </button>
            
            <button className="flex items-center gap-1.5 group">
              <div className="p-2 rounded-full bg-slate-50 text-slate-500 group-hover:bg-slate-100 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-500">
                {comments.length}
              </span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="mt-4 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">评论 ({comments.length})</h4>
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <img src={comment.avatar} className="w-8 h-8 rounded-full object-cover shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">{comment.user}</span>
                    <span className="text-[10px] text-slate-400">{comment.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5">{comment.content}</p>
                </div>
                <button className="text-slate-300 hover:text-red-500">
                  <Heart className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Comment Input */}
        <div className="p-3 border-t border-slate-100 bg-white pb-safe">
          <div className="flex gap-2">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="说点什么..."
              className="bg-slate-100 border-none rounded-full h-10"
              onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
            />
            <Button 
              onClick={handleSendComment}
              disabled={!commentText.trim()}
              className="rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
