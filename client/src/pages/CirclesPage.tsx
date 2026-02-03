import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import MomentDetail from "@/components/MomentDetail";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Heart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CirclesPage() {
  const [selectedFeed, setSelectedFeed] = useState<any>(null);

  const feeds = [
    {
      id: 1,
      user: "Alex Chen",
      avatar: "AC",
      title: "周末看展 | 798这家新展太出片了！🎨",
      image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=500&auto=format&fit=crop&q=60",
      likes: 124,
      isLiked: true,
    },
    {
      id: 2,
      user: "Sarah Wu",
      avatar: "SW",
      title: "三里屯这家咖啡店的拿铁绝了 ☕️",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60",
      likes: 842,
      isLiked: false,
    },
    {
      id: 3,
      user: "Mike Zhang",
      avatar: "MZ",
      title: "工体保龄球局，今晚有人来吗？🎳",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=60",
      likes: 56,
      isLiked: false,
    },
    {
      id: 4,
      user: "Foodie Jane",
      avatar: "FJ",
      title: "必吃榜汉堡，汁水满满！🍔",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
      likes: 230,
      isLiked: true,
    },
    {
      id: 5,
      user: "Traveler Tom",
      avatar: "TT",
      title: "北京的秋天，是金色的童话 🍂",
      image: "https://images.unsplash.com/photo-1508189860359-777d945909ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      likes: 1024,
      isLiked: false,
    },
    {
      id: 6,
      user: "Art Lover",
      avatar: "AL",
      title: "沉浸式光影展，美哭了 ✨",
      image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500&auto=format&fit=crop&q=60",
      likes: 45,
      isLiked: false,
    }
  ];

  const tabs = ["好友", "发现", "北京"];

  return (
    <Layout>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
        {/* Top Navigation */}
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex-1 flex justify-center gap-6 text-base font-medium text-muted-foreground">
            {tabs.map((tab, index) => (
              <button 
                key={tab} 
                className={cn(
                  "relative py-2 transition-colors",
                  index === 1 ? "text-foreground font-bold text-lg" : "hover:text-foreground"
                )}
              >
                {tab}
                {index === 1 && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Waterfall Layout (Masonry) */}
      <div className="p-2 pb-24">
        <div className="columns-2 gap-2 space-y-2">
          {feeds.map((feed) => (
            <div key={feed.id} className="break-inside-avoid mb-2">
              <Card 
                  className="border-none shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all duration-300 rounded-xl active:scale-95 bg-white"
                  onClick={() => setSelectedFeed({
                    ...feed,
                    content: feed.title + "\n\n这里是详细内容描述...", // Mock content
                    comments: 12,
                    time: "10-24",
                    hashtags: ["探店", "生活", "打卡"]
                  })}
                >
                {/* Image with variable aspect ratio simulation */}
                <div className={cn(
                  "relative overflow-hidden bg-slate-100",
                  feed.id % 2 === 0 ? "aspect-[3/4]" : "aspect-[4/5]"
                )}>
                  <img 
                    src={feed.image} 
                    alt={feed.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <CardContent className="p-2.5 space-y-2">
                  <h3 className="font-medium text-[13px] leading-snug line-clamp-2 text-slate-900">
                    {feed.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Avatar className="w-4 h-4 border border-slate-100">
                        <AvatarFallback className="text-[8px] bg-slate-100 text-slate-500">
                          {feed.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] text-slate-500 truncate max-w-[60px]">
                        {feed.user}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Heart 
                        className={cn(
                          "w-3 h-3 transition-colors",
                          feed.isLiked ? "fill-red-500 text-red-500" : "text-slate-400"
                        )} 
                      />
                      <span className="text-[10px]">{feed.likes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Moment Detail Modal */}
      <AnimatePresence>
        {selectedFeed && (
          <MomentDetail 
            moment={selectedFeed} 
            onClose={() => setSelectedFeed(null)} 
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
