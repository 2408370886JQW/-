import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Heart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CirclesPage() {
  const feeds = [
    {
      id: 1,
      user: "Alex Chen",
      avatar: "AC",
      title: "周末看展 | 798这家新展太出片了！🎨",
      image: "/images/category-exhibition.jpg",
      likes: 124,
      isLiked: true,
    },
    {
      id: 2,
      user: "Sarah Wu",
      avatar: "SW",
      title: "三里屯这家咖啡店的拿铁绝了 ☕️",
      image: "/images/category-coffee.jpg",
      likes: 842,
      isLiked: false,
    },
    {
      id: 3,
      user: "Mike Zhang",
      avatar: "MZ",
      title: "工体保龄球局，今晚有人来吗？🎳",
      image: "/images/category-play.jpg",
      likes: 56,
      isLiked: false,
    },
    {
      id: 4,
      user: "Foodie Jane",
      avatar: "FJ",
      title: "必吃榜汉堡，汁水满满！🍔",
      image: "/images/category-food.jpg",
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
      image: "/images/category-exhibition.jpg",
      likes: 45,
      isLiked: false,
    }
  ];

  const tabs = ["关注", "发现", "北京"];

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

      {/* Waterfall Layout */}
      <div className="p-2 pb-24">
        <div className="columns-2 gap-2 space-y-2">
          {feeds.map((feed) => (
            <div key={feed.id} className="break-inside-avoid mb-2">
              <Card className="border-none shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <img 
                    src={feed.image} 
                    alt={feed.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardContent className="p-3 space-y-2">
                  <h3 className="font-medium text-sm leading-snug line-clamp-2 text-foreground/90">
                    {feed.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Avatar className="w-5 h-5 border border-border/50">
                        <AvatarFallback className="text-[8px] bg-muted text-muted-foreground">
                          {feed.avatar}
                        </AvatarFallback>
                        {/* <AvatarImage src={feed.userAvatar} /> */}
                      </Avatar>
                      <span className="text-[10px] text-muted-foreground truncate max-w-[60px]">
                        {feed.user}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Heart 
                        className={cn(
                          "w-3.5 h-3.5 transition-colors",
                          feed.isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
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

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-4 z-50">
        <button className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform active:scale-95">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </Layout>
  );
}
