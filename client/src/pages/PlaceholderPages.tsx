import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { PlusSquare, User, Settings, Heart, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export function PublishPage() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[80vh] p-8 text-center space-y-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
          <PlusSquare className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold">发布动态</h2>
        <p className="text-muted-foreground">分享你的生活瞬间，或发起一个新的活动。</p>
        <Button className="w-full max-w-xs rounded-full" size="lg">
          开始创作
        </Button>
      </div>
    </Layout>
  );
}

export function ProfilePage() {
  return (
    <Layout>
      <div className="relative h-48 bg-gradient-to-r from-primary/20 to-purple-500/20">
        <div className="absolute -bottom-12 left-4">
          <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">ME</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <div className="pt-14 px-4 pb-24 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">我的昵称</h1>
          <p className="text-muted-foreground text-sm mt-1">热爱生活，喜欢探索城市的每一个角落 🌟</p>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 text-center p-3 bg-muted/30 rounded-xl">
            <div className="font-bold text-lg">128</div>
            <div className="text-xs text-muted-foreground">关注</div>
          </div>
          <div className="flex-1 text-center p-3 bg-muted/30 rounded-xl">
            <div className="font-bold text-lg">342</div>
            <div className="text-xs text-muted-foreground">粉丝</div>
          </div>
          <div className="flex-1 text-center p-3 bg-muted/30 rounded-xl">
            <div className="font-bold text-lg">1.2k</div>
            <div className="text-xs text-muted-foreground">获赞</div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-lg">我的服务</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-none shadow-sm bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-medium text-sm">我的收藏</span>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Bell className="w-5 h-5 text-orange-500" />
                <span className="font-medium text-sm">消息通知</span>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer col-span-2">
              <CardContent className="p-4 flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-sm">设置</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
