import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  timestamp: string;
  originalFile?: File;
}

export const FileUploadSection = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: file.name.includes('.') ? file.name.split('.')[0] : file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        timestamp: "Just now",
        originalFile: file,
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast({
        title: "Files uploaded successfully",
        description: `${newFiles.length} file(s) added to your workspace.`,
      });
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-[#3B3B3B] text-base">Uploaded Files</h3>
          <p className="text-sm text-[#3B3B3B] mt-1">
            {uploadedFiles.length} files available for BRD creation
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="*/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={triggerFileUpload}
            className="h-8 w-8 p-0"
          >
            <Upload className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};