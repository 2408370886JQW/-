import { useState } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users, Zap, Store, ArrowRight, Heart, MessageCircle } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const features = [
    { icon: Users, label: "找搭子", color: "bg-orange-100 text-orange-600" },
    { icon: Zap, label: "进圈子", color: "bg-purple-100 text-purple-600" },
    { icon: Store, label: "去相见", color: "bg-teal-100 text-teal-600", link: "/meet" },
    { icon: MessageCircle, label: "发动态", color: "bg-blue-100 text-blue-600" },
  ];

  const feeds = [
    {
      id: 1,
      user: "Alex Chen",
      avatar: "AC",
      content: "周末有人想一起去新的艺术展吗？听说很棒！🎨",
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
      content: "这家咖啡店的拿铁拉花太美了，环境也超级cozy~ ☕️",
      image: "/images/category-coffee.jpg",
      likes: 42,
      comments: 8,
      time: "1小时前",
      tag: "探店"
    }
  ];

  const merchants = [
    {
      id: 1,
      name: "Gather & Brew",
      category: "咖啡厅",
      rating: 4.8,
      image: "/images/category-coffee.jpg",
      distance: "0.5km"
    },
    {
      id: 2,
      name: "Fun Lounge",
      category: "娱乐",
      rating: 4.6,
      image: "/images/category-play.jpg",
      distance: "1.2km"
    }
  ];

  return (
    <Layout>
      {/* Header / Search */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center text-sm font-medium text-foreground/80">
            <MapPin className="w-4 h-4 mr-1 text-primary" />
            <span>朝阳区, 北京</span>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="搜索用户、动态或兴趣..." 
            className="pl-9 bg-muted/50 border-none rounded-full h-10 focus-visible:ring-1 focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden aspect-[2/1] shadow-sm">
          <img 
            src="/images/hero-banner.jpg" 
            alt="Social Life" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <div className="text-white">
              <h2 className="font-bold text-lg">发现身边的精彩</h2>
              <p className="text-xs opacity-90">结识新朋友，探索好去处</p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-4 gap-3">
          {features.map((feature, index) => (
            <Link key={index} href={feature.link || "#"}>
              <div className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-active:scale-95 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-foreground/80">{feature.label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Merchants */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">精选好去处</h3>
            <Link href="/meet">
              <span className="text-xs text-primary flex items-center cursor-pointer">
                更多 <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {merchants.map((merchant) => (
              <Link key={merchant.id} href="/meet">
                <Card className="min-w-[200px] border-none shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                  <div className="h-24 overflow-hidden rounded-t-xl relative">
                    <img src={merchant.image} alt={merchant.name} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 right-2 bg-white/90 text-foreground hover:bg-white text-[10px] px-1.5 py-0.5 h-5">
                      {merchant.distance}
                    </Badge>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-bold text-sm truncate">{merchant.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{merchant.category}</span>
                      <div className="flex items-center text-xs font-medium text-orange-500">
                        <span>★ {merchant.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Feed Stream */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">推荐动态</h3>
          <div className="space-y-4">
            {feeds.map((feed) => (
              <Card key={feed.id} className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-3 flex items-center gap-3">
                    <Avatar className="w-8 h-8 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{feed.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm">{feed.user}</h4>
                        <span className="text-[10px] text-muted-foreground">{feed.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-3 pb-2">
                    <p className="text-sm leading-relaxed mb-2">{feed.content}</p>
                    <Badge variant="secondary" className="text-[10px] font-normal mb-2">#{feed.tag}</Badge>
                  </div>

                  {feed.image && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img src={feed.image} alt="Feed content" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="p-3 flex items-center gap-4 text-muted-foreground">
                    <button className="flex items-center gap-1 text-xs hover:text-primary transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{feed.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-xs hover:text-primary transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{feed.comments}</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
