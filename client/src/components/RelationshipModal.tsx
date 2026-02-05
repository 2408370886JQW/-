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
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">你今天是和谁来吃饭？</h2>
              <p className="text-sm text-slate-500">选择关系，获取专属相见建议</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {RELATIONSHIP_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => onSelect(option.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-xl border-2 border-transparent transition-all active:scale-95",
                      option.bg,
                      "hover:border-current hover:shadow-md"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-white/80", option.color)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={cn("font-bold", option.color)}>{option.label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">* 必选项目，以便提供更好的服务</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
