import { ReactNode } from "react";
import BottomNav from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export default function Layout({ children, showNav = true }: LayoutProps) {
  return (
    <div className="h-screen bg-background font-sans antialiased overflow-hidden flex justify-center">
      <main className="w-full max-w-md h-full relative bg-background shadow-2xl overflow-hidden flex flex-col">
        {children}
      </main>
      {showNav && (
        <div className="max-w-md mx-auto fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
          <div className="pointer-events-auto">
            <BottomNav />
          </div>
        </div>
      )}
    </div>
  );
}
