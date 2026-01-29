import { Link, useLocation } from "wouter";
import { MapPin, Users, Plus, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  // Wireframe structure: Map, Circles, Publish (Center), Chat, Friends
  // Note: "Friends" in wireframe maps to Profile/Friends page, using Profile for now as per existing routes
  const navItems = [
    { path: "/", icon: MapPin, label: "地图" }, // Home is now Map-centric
    { path: "/circles", icon: Users, label: "圈子" },
    { path: "/publish", icon: Plus, label: "发布", isSpecial: true },
    { path: "/chat", icon: MessageSquare, label: "聊天" }, // New route placeholder
    { path: "/profile", icon: User, label: "我的" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 pb-safe">
      <div className="flex justify-around items-end h-16 px-2 max-w-md mx-auto relative">
        {navItems.map((item) => {
          const isActive = location === item.path;
          
          if (item.isSpecial) {
            return (
              <Link key={item.path} href={item.path}>
                <div className="relative -top-5 flex flex-col items-center justify-center cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600 mt-1">
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          }

          return (
            <Link key={item.path} href={item.path}>
              <div className="flex flex-col items-center justify-center w-16 h-full pb-2 cursor-pointer active:scale-95 transition-transform">
                <item.icon
                  className={cn(
                    "w-6 h-6 mb-1 transition-colors",
                    isActive ? "text-slate-900 fill-slate-900" : "text-slate-400"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors",
                    isActive ? "text-slate-900" : "text-slate-400"
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
