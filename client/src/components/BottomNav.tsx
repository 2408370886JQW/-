import { Link, useLocation } from "wouter";
import { Map, Users, PlusSquare, Store, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/map", icon: Map, label: "地图" },
    { path: "/circles", icon: Users, label: "圈子" },
    { path: "/publish", icon: PlusSquare, label: "发布" },
    { path: "/meet", icon: Store, label: "相见" },
    { path: "/profile", icon: User, label: "我的" },
  ];

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 pb-safe">
      <div className="flex justify-around items-center h-16 bg-background/80 backdrop-blur-md rounded-full shadow-lg border border-white/20">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <a className="flex flex-col items-center justify-center w-full h-full space-y-1">
                <item.icon
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
