import { Link, useLocation } from "wouter";
import { MapPin, Users, Plus, MessageSquare, User, X, Image as ImageIcon, Video, Smile, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Mock locations for tagging
const NEARBY_LOCATIONS = [
  "三里屯太古里",
  "国贸商城",
  "朝阳公园",
  "蓝色港湾",
  "798艺术区"
];

export default function BottomNav() {
  const [location] = useLocation();
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  
  // State for media preview
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for location tagging
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [content, setContent] = useState("");
  
  // State for hashtags
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [showHashtagInput, setShowHashtagInput] = useState(false);
  const [hashtagInput, setHashtagInput] = useState("");
  
  const POPULAR_HASHTAGS = ["#周末去哪儿", "#探店", "#美食", "#打卡", "#生活记录", "#OOTD"];

  // Original Navigation Structure
  const navItems = [
    { path: "/", icon: MapPin, label: "地图", isMap: true, activeColor: "text-blue-500" },
    { path: "/circles", icon: Users, label: "圈子", activeColor: "text-pink-500" },
    { path: "/publish", icon: Plus, label: "发动态", isSpecial: true },
    { path: "/chat", icon: MessageSquare, label: "消息", activeColor: "text-green-500" },
    { path: "/profile", icon: User, label: "我的", activeColor: "text-yellow-500" },
  ];

  const togglePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPublishOpen(!isPublishOpen);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setMediaFiles([...mediaFiles, e.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = (index: number) => {
    const newFiles = [...mediaFiles];
    newFiles.splice(index, 1);
    setMediaFiles(newFiles);
  };

  const handlePublish = () => {
    if (!content && mediaFiles.length === 0) {
      toast.error("请输入内容或上传图片");
      return;
    }

    // Create new moment object
    const newMoment = {
      id: Date.now(),
      content,
      media: mediaFiles,
      location: selectedLocation,
      hashtags,
      timestamp: new Date().toISOString()
    };

    // Dispatch custom event to notify Home component
    const event = new CustomEvent('new-moment-posted', { detail: newMoment });
    window.dispatchEvent(event);

    // Reset state and close
    setContent("");
    setMediaFiles([]);
    setSelectedLocation(null);
    setHashtags([]);
    setIsPublishOpen(false);
    
    toast.success("发布成功！");
  };

  return (
    <>
      {/* Publish Popup Overlay - Post Moment Interface */}
      <AnimatePresence>
        {isPublishOpen && (
          <div className="fixed inset-0 z-[60] flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPublishOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Menu Content */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-t-3xl p-6 pb-safe z-10 h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => setIsPublishOpen(false)} className="text-slate-500 font-medium">
                  取消
                </button>
                <h3 className="text-lg font-bold text-slate-900">发布动态</h3>
                <Button 
                  onClick={handlePublish}
                  className="bg-blue-600 text-white rounded-full px-6 h-8 text-sm"
                >
                  发布
                </Button>
              </div>

              {/* Content Input */}
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
                <Textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="分享此刻的想法..." 
                  className="min-h-[120px] border-none resize-none text-base p-0 focus-visible:ring-0 placeholder:text-slate-400"
                />
                
                {/* Media Preview Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {mediaFiles.map((src, index) => (
                    <div key={index} className="aspect-square relative rounded-xl overflow-hidden group">
                      <img src={src} alt="preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeMedia(index)}
                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Upload Button */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <Plus className="w-8 h-8" />
                    <span className="text-xs font-medium">添加图片/视频</span>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                  />
                </div>

                {/* Location Tag Display */}
                <div className="flex flex-wrap gap-2">
                  {selectedLocation && (
                    <div className="flex items-center gap-2 text-blue-600 bg-blue-50 self-start px-3 py-1.5 rounded-full text-sm font-medium">
                      <MapPin className="w-4 h-4" />
                      {selectedLocation}
                      <button onClick={() => setSelectedLocation(null)} className="ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  
                  {/* Hashtags Display */}
                  {hashtags.map(tag => (
                    <div key={tag} className="flex items-center gap-1 text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full text-sm font-medium">
                      <span>{tag}</span>
                      <button onClick={() => setHashtags(prev => prev.filter(t => t !== tag))} className="ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hashtag Picker */}
              <AnimatePresence>
                {showHashtagInput && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-20 left-4 right-4 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-20"
                  >
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        placeholder="输入话题..."
                        className="flex-1 bg-slate-100 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && hashtagInput.trim()) {
                            const tag = hashtagInput.startsWith('#') ? hashtagInput : `#${hashtagInput}`;
                            if (!hashtags.includes(tag)) {
                              setHashtags([...hashtags, tag]);
                            }
                            setHashtagInput("");
                          }
                        }}
                      />
                      <Button 
                        onClick={() => {
                          if (hashtagInput.trim()) {
                            const tag = hashtagInput.startsWith('#') ? hashtagInput : `#${hashtagInput}`;
                            if (!hashtags.includes(tag)) {
                              setHashtags([...hashtags, tag]);
                            }
                            setHashtagInput("");
                          }
                        }}
                        className="bg-pink-500 text-white"
                      >
                        添加
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_HASHTAGS.map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            if (!hashtags.includes(tag)) {
                              setHashtags([...hashtags, tag]);
                            }
                          }}
                          className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full text-xs font-medium hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Location Picker Popup */}
              <AnimatePresence>
                {showLocationPicker && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-20 left-4 right-4 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-20"
                  >
                    <div className="text-xs font-bold text-slate-400 px-3 py-2">附近地点</div>
                    {NEARBY_LOCATIONS.map(loc => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setShowLocationPicker(false);
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {loc}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toolbar */}
              <div className="border-t border-slate-100 pt-4 mt-4">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-slate-600"
                  >
                    <ImageIcon className="w-6 h-6 text-green-500" />
                    <span className="text-sm font-medium">图片</span>
                  </button>
                  <button 
                    onClick={() => setShowHashtagInput(!showHashtagInput)}
                    className={cn(
                      "flex items-center gap-2 transition-colors",
                      hashtags.length > 0 ? "text-pink-600" : "text-slate-600"
                    )}
                  >
                    <span className="text-lg font-bold text-pink-500">#</span>
                    <span className="text-sm font-medium">话题</span>
                  </button>
                  <button 
                    onClick={() => setShowLocationPicker(!showLocationPicker)}
                    className={cn(
                      "flex items-center gap-2 transition-colors",
                      selectedLocation ? "text-blue-600" : "text-slate-600"
                    )}
                  >
                    <MapPin className={cn("w-6 h-6", selectedLocation ? "text-blue-600" : "text-blue-500")} />
                    <span className="text-sm font-medium">{selectedLocation ? "已定位" : "所在位置"}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-600 ml-auto">
                    <Smile className="w-6 h-6 text-amber-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-100 pb-safe rounded-t-[32px] shadow-[0_-4px_30px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-end h-20 px-2 max-w-md mx-auto relative">
          {navItems.map((item) => {
            const isActive = location === item.path;
            
            if (item.isSpecial) {
              return (
                <div key={item.path} onClick={togglePublish}>
                  <div className="relative -top-8 flex flex-col items-center justify-center cursor-pointer group">
                    <motion.div 
                      animate={isPublishOpen ? { rotate: 45, scale: 1.1 } : { rotate: 0, scale: 1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-900/20 border-4 border-white mb-1"
                    >
                      <Plus className="w-8 h-8 text-white" strokeWidth={3} />
                    </motion.div>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                      发布动态
                    </span>
                  </div>
                </div>
              );
            }

            // Special handling for Map icon with animation
            if (item.isMap) {
              return (
                <Link key={item.path} href={item.path}>
                  <div className="flex flex-col items-center justify-center w-16 h-full pb-3 cursor-pointer relative">
                    {/* Animated Background Effect when Active */}
                    {isActive && (
                      <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-blue-100/50 blur-md -z-10"
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    )}
                    
                    <motion.div
                      animate={isActive ? { y: -4, scale: 1.1 } : { y: 0, scale: 1 }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <item.icon 
                        className={cn(
                          "w-6 h-6 transition-colors duration-300",
                          isActive ? "text-blue-600 fill-blue-600" : "text-slate-400"
                        )} 
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      <span className={cn(
                        "text-[10px] font-medium transition-colors duration-300",
                        isActive ? "text-blue-600" : "text-slate-400"
                      )}>
                        {item.label}
                      </span>
                    </motion.div>
                  </div>
                </Link>
              );
            }

            return (
              <Link key={item.path} href={item.path}>
                <div className="flex flex-col items-center justify-center w-16 h-full pb-3 cursor-pointer relative">
                  {isActive && (
                    <motion.div
                      className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full blur-md -z-10 opacity-20",
                        item.activeColor?.replace("text-", "bg-").replace("500", "100")
                      )}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}

                  <motion.div
                    animate={isActive ? { y: -4, scale: 1.1 } : { y: 0, scale: 1 }}
                    whileTap={{ scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <item.icon 
                      className={cn(
                        "w-6 h-6 transition-colors duration-300",
                        isActive ? item.activeColor : "text-slate-400"
                      )} 
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span className={cn(
                      "text-[10px] font-medium transition-colors duration-300",
                      isActive ? item.activeColor : "text-slate-400"
                    )}>
                      {item.label}
                    </span>
                  </motion.div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
