import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { ArrowLeft, MapPin, Hash, Image as ImageIcon, X, Plus, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import ImageFilterEditor from "@/components/ImageFilterEditor";

const HASHTAGS = ["#周末去哪儿", "#探店", "#美食", "#旅行", "#生活记录", "#OOTD", "#咖啡探店"];

export default function PublishPage() {
  const [location, setLocation] = useLocation();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Filter Editor State
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleHashtag = (tag: string) => {
    if (selectedHashtags.includes(tag)) {
      setSelectedHashtags(selectedHashtags.filter(t => t !== tag));
    } else {
      setSelectedHashtags([...selectedHashtags, tag]);
    }
  };

  const handlePublish = () => {
    // In a real app, this would send data to backend
    // For now, we simulate a successful publish and redirect
    
    // Dispatch a custom event so Home.tsx can pick it up (mocking real-time update)
    const newMoment = {
      id: Date.now(),
      user: "我",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
      content: content,
      image: images[0],
      images: images,
      likes: 0,
      comments: 0,
      location: selectedLocation || "未知地点",
      hashtags: selectedHashtags,
      lat: 39.934, // Mock location near user
      lng: 116.455
    };
    
    const event = new CustomEvent('new-moment-posted', { detail: newMoment });
    window.dispatchEvent(event);
    
    setLocation("/");
  };

  const handleSaveFilter = (filteredImage: string) => {
    if (editingImageIndex !== null) {
      const newImages = [...images];
      newImages[editingImageIndex] = filteredImage;
      setImages(newImages);
      setEditingImageIndex(null);
    }
  };

  return (
    <Layout showNav={false}>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="px-4 pt-safe pb-2 bg-white sticky top-0 z-10 flex items-center justify-between border-b border-slate-100">
          <Link href="/">
            <button className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <h1 className="text-lg font-bold text-slate-900">发布动态</h1>
          <button 
            onClick={handlePublish}
            disabled={!content && images.length === 0}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发布
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Text Content */}
          <Textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="分享此刻的想法..." 
            className="min-h-[120px] border-none resize-none text-base p-0 focus-visible:ring-0 placeholder:text-slate-400"
          />

          {/* Image Grid */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {images.map((img, index) => (
              <div key={index} className="aspect-square relative rounded-xl overflow-hidden group bg-slate-100">
                <img src={img} className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => setEditingImageIndex(index)}
                  className="absolute bottom-1 right-1 p-1.5 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Wand2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            {images.length < 9 && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 hover:border-slate-300 transition-colors"
              >
                <Plus className="w-8 h-8 mb-1" />
                <span className="text-xs font-medium">添加图片</span>
              </button>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            accept="image/*"
            onChange={handleImageUpload}
          />

          {/* Location */}
          <div className="flex items-center gap-2 py-3 border-t border-slate-50 cursor-pointer hover:bg-slate-50 -mx-4 px-4 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-900">
                {selectedLocation || "添加地点"}
              </div>
              {!selectedLocation && <div className="text-xs text-slate-400">标记你的位置</div>}
            </div>
            <ArrowLeft className="w-4 h-4 text-slate-300 rotate-180" />
          </div>

          {/* Hashtags */}
          <div className="py-4 border-t border-slate-50">
            <div className="flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-900">添加话题</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {HASHTAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleHashtag(tag)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                    selectedHashtags.includes(tag)
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image Filter Editor Modal */}
      <AnimatePresence>
        {editingImageIndex !== null && (
          <ImageFilterEditor 
            image={images[editingImageIndex]}
            onSave={handleSaveFilter}
            onCancel={() => setEditingImageIndex(null)}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
