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
                    className="absolute bottom-20 left-4 right-4 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-20"
                  >
                    <h4 className="text-sm font-bold text-slate-900 mb-3">附近位置</h4>
                    <div className="space-y-2">
                      {NEARBY_LOCATIONS.map(loc => (
                        <button
                          key={loc}
                          onClick={() => {
                            setSelectedLocation(loc);
                            setShowLocationPicker(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-600 flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {loc}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toolbar */}
              <div className="border-t border-slate-100 pt-4 flex items-center gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                  <ImageIcon className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                  className={cn(
                    "p-2 rounded-full hover:bg-slate-100 transition-colors",
                    showLocationPicker || selectedLocation ? "text-blue-500 bg-blue-50" : "text-slate-500"
                  )}
                >
                  <MapPin className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setShowHashtagInput(!showHashtagInput)}
                  className={cn(
                    "p-2 rounded-full hover:bg-slate-100 transition-colors",
                    showHashtagInput || hashtags.length > 0 ? "text-pink-500 bg-pink-50" : "text-slate-500"
                  )}
                >
                  <span className="text-lg font-bold">#</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="relative">
        {/* Curved Background SVG */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pointer-events-none z-0">
          <svg className="absolute bottom-full left-0 w-full h-4 text-white fill-current" viewBox="0 0 375 20" preserveAspectRatio="none">
            <path d="M0,20 L375,20 L375,20 C250,20 225,0 187.5,0 C150,0 125,20 0,20 Z" />
          </svg>
        </div>

        <div className="relative z-10 h-16 px-6 flex items-center justify-between bg-white pb-safe">
          {navItems.map((item, index) => {
            if (item.isSpecial) {
              return (
                <div key={item.path} className="relative -top-6">
                  <button
                    onClick={togglePublish}
                    className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF9A9E] to-[#FECFEF] shadow-lg shadow-pink-200 flex items-center justify-center active:scale-95 transition-transform"
                    style={{
                      background: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)" 
                    }}
                  >
                    <Plus className="w-8 h-8 text-white" strokeWidth={3} />
                  </button>
                </div>
              );
            }

            const isActive = location === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.path} href={item.path}>
                <div className={cn(
                  "flex flex-col items-center gap-1 cursor-pointer transition-colors w-12",
                  isActive ? item.activeColor : "text-slate-300 hover:text-slate-400"
                )}>
                  <Icon 
                    className={cn(
                      "w-6 h-6 transition-all",
                      isActive && "scale-110"
                    )} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
