import { motion, AnimatePresence } from "framer-motion";
import { RELATIONSHIP_OPTIONS } from "@/data/mockStoreData";
import { cn } from "@/lib/utils";

interface RelationshipModalProps {
  isOpen: boolean;
  onSelect: (relationshipId: string) => void;
}

export default function RelationshipModal({ isOpen, onSelect }: RelationshipModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[70] bg-white rounded-2xl p-6 shadow-2xl"
          >
            <div className="text-left mb-10 font-serif">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                今天<br/>
                和谁相见
              </h2>
              <div className="text-sm text-slate-400 space-y-1">
                <p>选择关系</p>
                <p>获取专属建议</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {RELATIONSHIP_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => onSelect(option.id)}
                    className={cn(
                      "flex flex-col items-start justify-center p-5 rounded-xl border border-transparent transition-all active:scale-95",
                      option.bg,
                      "hover:shadow-md"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-white/80", option.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={cn("font-bold text-lg tracking-wide", option.color)}>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
