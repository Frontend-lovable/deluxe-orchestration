import { useState, useRef } from "react";
import { Download, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UploadedFile {
  name: string;
  size: string;
  timestamp: string;
}

export const FileUploadSection = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      name: "BRD 1.01",
      size: "2.42 MB",
      timestamp: "2 hours ago",
    },
    {
      name: "Meeting Transcript",
      size: "2.42 MB",
      timestamp: "2 hours ago",
    },
    {
      name: "Data flow.png",
      size: "2.42 MB",
      timestamp: "2 hours ago",
    },
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
        name: file.name.includes('.') ? file.name.split('.')[0] : file.name,
        size: formatFileSize(file.size),
        timestamp: "Just now",
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-[hsl(var(--heading-primary))]">Uploaded Files</CardTitle>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="*/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button variant="outline" size="sm" onClick={triggerFileUpload}>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          3 files available for BRD creation
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-sm">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {file.size} • {file.timestamp}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-3 bg-accent rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            All files processed and draft ready for review
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium mb-3">Actions</h4>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Upload to Confluence
            </Button>
            <p className="text-xs text-muted-foreground px-2">
              Complete all BRD sections before submitting for approval
            </p>
          </div>
          <Button className="w-full mt-4" variant="default">
            <Download className="w-4 h-4 mr-2" />
            Download BRD
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};