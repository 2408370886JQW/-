import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Check, Sliders, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageFilterEditorProps {
  image: string;
  onSave: (filteredImage: string) => void;
  onCancel: () => void;
}

const FILTERS = [
  { id: "normal", name: "原图", filter: "none" },
  { id: "vivid", name: "鲜艳", filter: "saturate(1.5) contrast(1.1)" },
  { id: "warm", name: "暖阳", filter: "sepia(0.3) saturate(1.2) brightness(1.05)" },
  { id: "cool", name: "清冷", filter: "hue-rotate(180deg) sepia(0.1) saturate(0.8)" }, // Adjusted for better cool tone
  { id: "bw", name: "黑白", filter: "grayscale(1) contrast(1.2)" },
  { id: "vintage", name: "复古", filter: "sepia(0.6) contrast(0.9) brightness(0.9)" },
  { id: "cyber", name: "赛博", filter: "hue-rotate(45deg) contrast(1.2) saturate(1.5)" },
];

export default function ImageFilterEditor({ image, onSave, onCancel }: ImageFilterEditorProps) {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState(image);

  // Apply filter to canvas for saving
  const handleSave = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;
    
    img.onload = () => {
      if (canvas && ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = activeFilter.filter;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        onSave(canvas.toDataURL("image/jpeg", 0.9));
      }
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      {/* Header */}
      <div className="px-4 pt-safe pb-4 flex items-center justify-between bg-black/50 backdrop-blur-md absolute top-0 left-0 right-0 z-10">
        <button onClick={onCancel} className="text-white p-2">
          <X className="w-6 h-6" />
        </button>
        <h3 className="text-white font-bold">编辑图片</h3>
        <button onClick={handleSave} className="text-blue-400 font-bold p-2">
          <Check className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Preview */}
      <div className="flex-1 flex items-center justify-center bg-black overflow-hidden relative">
        <img 
          src={image} 
          className="max-w-full max-h-full object-contain transition-all duration-300"
          style={{ filter: activeFilter.filter }}
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Filter Selector */}
      <div className="bg-black/80 backdrop-blur-xl pb-safe pt-6 px-4">
        <div className="flex items-center gap-2 mb-4 text-white/50 text-xs font-medium uppercase tracking-wider">
          <Wand2 className="w-3 h-3" />
          选择滤镜
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
          {FILTERS.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter)}
              className="flex flex-col gap-2 items-center shrink-0 group"
            >
              <div className={cn(
                "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                activeFilter.id === filter.id ? "border-blue-500 scale-105" : "border-transparent opacity-60 group-hover:opacity-100"
              )}>
                <img 
                  src={image} 
                  className="w-full h-full object-cover"
                  style={{ filter: filter.filter }}
                />
              </div>
              <span className={cn(
                "text-xs font-medium transition-colors",
                activeFilter.id === filter.id ? "text-white" : "text-white/50"
              )}>
                {filter.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
