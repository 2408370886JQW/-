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
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}>
                <item.icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn("transition-transform duration-200", isActive && "scale-110")}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
