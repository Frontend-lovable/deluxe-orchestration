import { useState, useRef } from "react";
import { Download, Upload, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: file.name.includes('.') ? file.name.split('.')[0] : file.name,
        size: formatFileSize(file.size),
        timestamp: "Just now",
        originalFile: file,
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast({
        title: "Files uploaded successfully",
        description: `${newFiles.length} file(s) added to your workspace.`,
      });
    }
    // Reset input value to allow uploading the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    toast({
      title: "File deleted",
      description: "File has been removed from your workspace.",
    });
  };

  const handleDownloadFile = (file: UploadedFile) => {
    if (file.originalFile) {
      const url = URL.createObjectURL(file.originalFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      toast({
        title: "Download unavailable",
        description: "This file cannot be downloaded as it's not available locally.",
        variant: "destructive",
      });
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-8">
          <div>
            <CardTitle className="text-base font-bold text-[hsl(var(--heading-primary))]">Uploaded Files</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
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
              className="bg-white border border-[#3B3B3B] hover:bg-gray-50"
            >
              <Upload className="w-4 h-4 text-[#3B3B3B]" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-4">
          {uploadedFiles.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No file selected.
            </div>
          ) : (
            <div className="space-y-3 mb-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {file.size} • {file.timestamp}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadFile(file)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        
        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              All files processed and draft ready for review
            </div>
            <Button variant="outline" className="w-full justify-center gap-2 h-12 bg-white border border-[#8C8C8C] hover:bg-gray-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Submit Files
            </Button>
          </div>
        )}
        
        <div className="mt-4">
          <h4 className="font-medium mb-3">Actions</h4>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start h-12 bg-white border border-[#8C8C8C] hover:bg-gray-50" disabled={uploadedFiles.length === 0}>
              <Upload className="w-4 h-4 mr-2" />
              Upload to Confluence
            </Button>
            <p className="text-xs text-muted-foreground px-2">
              Complete all BRD sections before submitting for approval
            </p>
          </div>
          <Button className="w-full mt-4" variant="default" disabled={uploadedFiles.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Download BRD
          </Button>
        </div>
        </div>
      </CardContent>
    </Card>
  );
};