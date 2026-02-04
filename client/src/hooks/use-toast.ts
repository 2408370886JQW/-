import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

export function useToast() {
  const toast = ({ title, description, variant, action }: ToastProps) => {
    if (variant === "destructive") {
      sonnerToast.error(title, {
        description,
        action,
      });
    } else {
      sonnerToast.success(title, {
        description,
        action,
      });
    }
  };

  return { toast };
}
