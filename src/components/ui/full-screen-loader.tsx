import { Loader2 } from "lucide-react";

interface FullScreenLoaderProps {
  message?: string;
}

export const FullScreenLoader = ({ message = "Loading..." }: FullScreenLoaderProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center gap-4 max-w-sm mx-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-lg font-medium text-center">{message}</p>
      </div>
    </div>
  );
};