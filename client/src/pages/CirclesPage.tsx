import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart, MessageCircle, Share2, MoreHorizontal, Plus } from "lucide-react";

export default function CirclesPage() {
  const feeds = [
    {
      id: 1,
      user: "Alex Chen",
      avatar: "AC",
      content: "周末有人想一起去新的艺术展吗？听说很棒！🎨 #看展 #周末去哪儿",
      image: "/images/category-exhibition.jpg",
      likes: 24,
      comments: 5,
      time: "15分钟前",
      tag: "看展"
    },
    {
      id: 2,
      user: "Sarah Wu",
      avatar: "SW",
      content: "这家咖啡店的拿铁拉花太美了，环境也超级cozy~ ☕️ 推荐大家来打卡！",
      image: "/images/category-coffee.jpg",
      likes: 42,
      comments: 8,
      time: "1小时前",
      tag: "探店"
    },
    {
      id: 3,
      user: "Mike Zhang",
      avatar: "MZ",
      content: "今晚工体保龄球局，缺2人！🎳 有没有高手来带飞？",
      image: "/images/category-play.jpg",
      likes: 15,
      comments: 12,
      time: "2小时前",
      tag: "玩乐"
    }
  ];

  const topics = ["全部", "热门", "看展", "探店", "运动", "音乐", "读书"];

  return (
    <Layout>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">圈子</h1>
          <Button size="sm" className="rounded-full h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-1" /> 发布
          </Button>
        </div>
        
        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="搜索感兴趣的话题..." 
              className="pl-9 bg-muted/50 border-none rounded-full h-10"
            />
          </div>
        </div>

        {/* Topics */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {topics.map((topic, index) => (
              <button
                key={index}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  index === 0 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {feeds.map((feed) => (
          <Card key={feed.id} className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">{feed.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-sm">{feed.user}</h4>
                    <span className="text-xs text-muted-foreground">{feed.time}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="px-4 pb-3">
                <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{feed.content}</p>
              </div>

              {feed.image && (
                <div className="w-full aspect-[4/3] bg-muted overflow-hidden">
                  <img src={feed.image} alt="Feed content" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-1.5 text-muted-foreground hover:text-red-500 transition-colors group">
                    <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">{feed.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group">
                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">{feed.comments}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group">
                    <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
