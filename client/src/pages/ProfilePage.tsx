import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { PlusSquare, User, Settings, Heart, Bell, Users, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function ProfilePage() {
  return (
    <Layout>
      <div className="relative h-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
        <div className="absolute -bottom-12 left-4">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" />
            <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">ME</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <div className="pt-14 px-4 pb-24 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">我的昵称</h1>
          <p className="text-slate-500 text-sm mt-1">热爱生活，喜欢探索城市的每一个角落 🌟</p>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 text-center p-3 bg-slate-50 rounded-xl">
            <div className="font-bold text-lg text-slate-900">128</div>
            <div className="text-xs text-slate-500">关注</div>
          </div>
          <div className="flex-1 text-center p-3 bg-slate-50 rounded-xl">
            <div className="font-bold text-lg text-slate-900">342</div>
            <div className="text-xs text-slate-500">粉丝</div>
          </div>
          <div className="flex-1 text-center p-3 bg-slate-50 rounded-xl">
            <div className="font-bold text-lg text-slate-900">1.2k</div>
            <div className="text-xs text-slate-500">获赞</div>
          </div>
        </div>

        {/* Friends List Entry - New Feature */}
        <Link href="/friends">
          <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm active:bg-slate-50 transition-colors cursor-pointer mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">我的好友</h3>
                <p className="text-xs text-slate-500">查看通讯录列表</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </Link>

        {/* User Moments History - New Feature */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-900">我的动态</h3>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                <img 
                  src={`https://images.unsplash.com/photo-${item === 1 ? '1507525428034-b723cf961d3e' : item === 2 ? '1509042239860-f550ce710b93' : item === 3 ? '1517248135467-4c7edcad34c4' : '1561053720-76cd73ff22c3'}?w=300&h=300&fit=crop`} 
                  alt="Moment" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center gap-1 text-white text-xs">
                    <Heart className="w-3 h-3 fill-white" />
                    <span>{item * 24}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-lg text-slate-900">我的服务</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-none shadow-sm bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-medium text-sm text-slate-700">我的收藏</span>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Bell className="w-5 h-5 text-orange-500" />
                <span className="font-medium text-sm text-slate-700">消息通知</span>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer col-span-2">
              <CardContent className="p-4 flex items-center gap-3">
                <Settings className="w-5 h-5 text-slate-500" />
                <span className="font-medium text-sm text-slate-700">设置</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
