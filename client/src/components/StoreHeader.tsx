import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoreHeaderProps {
  title: string;
  onBack?: () => void;
  className?: string;
  rightElement?: React.ReactNode;
}

export default function StoreHeader({ title, onBack, className, rightElement }: StoreHeaderProps) {
  return (
    <div className={cn("sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white shadow-sm", className)}>
      <div className="flex items-center gap-3">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
        )}
        <h1 className="text-lg font-bold text-slate-900 truncate max-w-[200px]">{title}</h1>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
}
