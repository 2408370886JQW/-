import { useState } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Map, List, Star, MapPin, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MeetPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [activeCategory, setActiveCategory] = useState("全部");

  const categories = [
    { id: "all", label: "全部" },
    { id: "food", label: "吃美食" },
    { id: "play", label: "玩乐" },
    { id: "exhibition", label: "看展" },
    { id: "coffee", label: "喝咖啡" },
  ];

  const merchants = [
    {
      id: 1,
      name: "Gather & Brew",
      category: "咖啡厅",
      rating: 4.8,
      reviews: 128,
      price: "¥45/人",
      distance: "0.5km",
      image: "/images/category-coffee.jpg",
      tags: ["环境好", "适合办公", "宠物友好"],
      address: "朝阳区三里屯西五街5号"
    },
    {
      id: 2,
      name: "Fun Lounge",
      category: "娱乐",
      rating: 4.6,
      reviews: 85,
      price: "¥120/人",
      distance: "1.2km",
      image: "/images/category-play.jpg",
      tags: ["聚会首选", "有包间", "桌游"],
      address: "朝阳区工体北路8号"
    },
    {
      id: 3,
      name: "Modern Art Space",
      category: "看展",
      rating: 4.9,
      reviews: 342,
      price: "¥80/人",
      distance: "2.5km",
      image: "/images/category-exhibition.jpg",
      tags: ["拍照出片", "沉浸式", "限时"],
      address: "朝阳区798艺术区"
    },
    {
      id: 4,
      name: "Burger & Bistro",
      category: "美食",
      rating: 4.5,
      reviews: 210,
      price: "¥90/人",
      distance: "0.8km",
      image: "/images/category-food.jpg",
      tags: ["美式汉堡", "精酿啤酒", "露台"],
      address: "朝阳区新源里西20号"
    }
  ];

  return (
    <Layout>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
        {/* Search Header */}
        <div className="px-4 py-3 flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="搜索商家、地点..." 
              className="pl-9 bg-muted/50 border-none rounded-full h-10"
            />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full w-10 h-10 bg-muted/50 hover:bg-muted"
            onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
          >
            {viewMode === "list" ? <Map className="w-5 h-5" /> : <List className="w-5 h-5" />}
          </Button>
        </div>

        {/* Category Filter */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.label)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  activeCategory === cat.label
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-4 pb-24">
        {viewMode === "list" ? (
          <div className="space-y-4">
            {merchants.map((merchant) => (
              <Card key={merchant.id} className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex h-32">
                  <div className="w-32 h-full relative shrink-0">
                    <img src={merchant.image} alt={merchant.name} className="w-full h-full object-cover" />
                    {merchant.id === 1 && (
                      <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600 text-[10px] px-1.5 py-0.5 h-5 border-none">
                        热门
                      </Badge>
                    )}
                  </div>
                  <CardContent className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-base truncate pr-2">{merchant.name}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{merchant.distance}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center text-orange-500 text-xs font-bold">
                          <Star className="w-3 h-3 fill-current mr-0.5" />
                          {merchant.rating}
                        </div>
                        <span className="text-xs text-muted-foreground">{merchant.price}</span>
                        <span className="text-xs text-muted-foreground">• {merchant.category}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {merchant.tags.map((tag, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{merchant.address}</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="h-[60vh] flex items-center justify-center bg-muted/30 rounded-2xl border-2 border-dashed border-muted-foreground/20">
            <div className="text-center space-y-2">
              <Map className="w-12 h-12 text-muted-foreground/50 mx-auto" />
              <p className="text-muted-foreground text-sm">地图模式开发中...</p>
              <Button variant="outline" size="sm" onClick={() => setViewMode("list")}>
                返回列表
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
