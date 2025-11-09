import { toast as sonnerToast } from "sonner";

// Simple Sonner-based toast hook for compatibility with existing imports
export function useToast() {
  return {
    toasts: [] as any[],
    toast: sonnerToast,
    dismiss: sonnerToast.dismiss,
  };
}

export const toast = sonnerToast;
