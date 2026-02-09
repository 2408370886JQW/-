import { Link, useLocation } from "wouter";
import { MapPin, Users, Plus, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

type TabType = "encounter" | "friends" | "moments" | "meet";

interface BottomNavProps {
  activeTab?: TabType;
  onTabChange?: Dispatch<SetStateAction<TabType>>;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const [location, setLocation] = useLocation();

  const navItems = [
    { 
      id: "encounter", 
      icon: MapPin, 
      label: "地图", 
      activeColor: "text-blue-500",
      onClick: () => {
        if (onTabChange) onTabChange("encounter");
        setLocation("/");
      }
    },
    { 
      id: "moments", 
      icon: Users, 
      label: "圈子", 
      activeColor: "text-pink-500",
      onClick: () => {
        if (onTabChange) onTabChange("moments");
        setLocation("/");
      }
    },
    { 
      id: "publish", 
      icon: Plus, 
      label: "发动态", 
      isSpecial: true,
      onClick: () => {
        // Trigger publish modal via custom event or prop
        window.dispatchEvent(new CustomEvent('open-publish-modal'));
      }
    },
    { 
      id: "chat", 
      icon: MessageSquare, 
      label: "消息", 
      activeColor: "text-green-500",
      onClick: () => setLocation("/chat")
    },
    { 
      id: "profile", 
      icon: User, 
      label: "我的", 
      activeColor: "text-yellow-500",
      onClick: () => setLocation("/profile")
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 pb-safe pt-2 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-50">
      <div className="flex justify-between items-center h-14">
        {navItems.map((item) => {
          const isActive = location === "/" 
            ? activeTab === item.id 
            : location === `/${item.id}`;

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className="relative -top-5"
              >
                <div className="w-14 h-14 bg-slate-900 rounded-full shadow-lg shadow-slate-900/20 flex items-center justify-center text-white active:scale-95 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className="flex flex-col items-center gap-1 w-12 cursor-pointer"
            >
              <div className={cn(
                "transition-colors duration-300",
                isActive ? item.activeColor : "text-slate-300"
              )}>
                <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors duration-300",
                isActive ? "text-slate-900" : "text-slate-400"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
