import { ReactNode, Dispatch, SetStateAction } from "react";
import BottomNav from "./BottomNav";

type TabType = "encounter" | "friends" | "moments" | "meet";

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
  activeTab?: TabType;
  onTabChange?: Dispatch<SetStateAction<TabType>>;
}

export default function Layout({ children, showNav = true, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <main className="w-full max-w-md mx-auto min-h-screen relative bg-background shadow-2xl overflow-hidden">
        {children}
      </main>
      {showNav && (
        <div className="max-w-md mx-auto fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
          <div className="pointer-events-auto">
            <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
          </div>
        </div>
      )}
    </div>
  );
}
