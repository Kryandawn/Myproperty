declare module '@/hooks/use-toast' {
  interface ToastProps {
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive' | 'success';
  }

  interface UseToastResult {
    toast: (props: ToastProps) => void;
  }

  export function useToast(): UseToastResult;
}
