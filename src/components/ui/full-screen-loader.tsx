import { Loader2 } from "lucide-react";

interface FullScreenLoaderProps {
  isVisible: boolean;
  message?: string;
}

export const FullScreenLoader = ({ isVisible, message = "Please wait" }: FullScreenLoaderProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 shadow-xl">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">{message}</p>
      </div>
    </div>
  );
};