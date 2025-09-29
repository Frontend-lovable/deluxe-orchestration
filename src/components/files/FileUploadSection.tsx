import { useState, useRef } from "react";
import { Download, Upload, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { uploadFiles } from "@/services/projectApi";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  timestamp: string;
  originalFile?: File;
}

interface FileUploadSectionProps {
  onCreateBRD?: () => void;
  onBRDGenerated?: (content: string) => void;
  onBRDSectionsUpdate?: (sections: any[]) => void;
}

export const FileUploadSection = ({ onCreateBRD, onBRDGenerated, onBRDSectionsUpdate }: FileUploadSectionProps = {}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
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

  const parseBRDSections = (brdContent: string) => {
    const sections = [];
    const lines = brdContent.split('\n');
    
    const sectionMapping = {
      "Document Overview": ["document overview", "## 1. document overview"],
      "Purpose": ["## 2. purpose"],
      "Background / Context": ["## 3. background", "background / context", "background/context"],
      "Stakeholders": ["## 4. stakeholders"],
      "Scope": ["## 5. scope"],
      "Business Objectives & ROI": ["## 6. business objectives", "business objectives & roi", "business objectives and roi"],
      "Functional Requirements": ["## 7. functional requirements"],
      "Non-Functional Requirements": ["## 8. non-functional requirements"],
      "User Stories / Use Cases": ["## 9. user stories", "user stories / use cases"],
      "Assumptions": ["## 10. assumptions"],
      "Constraints": ["## 11. constraints"],
      "Acceptance Criteria / KPIs": ["## 12. acceptance criteria", "acceptance criteria / kpis"],
      "Timeline / Milestones": ["## 13. timeline", "timeline / milestones"],
      "Risks and Dependencies": ["## 14. risks and dependencies", "risks & dependencies"],
      "Approval & Review": ["## 15. approval", "approval & review"],
      "Glossary & Appendix": ["## 16. glossary", "glossary & appendix"]
    };

    for (const [sectionTitle, keywords] of Object.entries(sectionMapping)) {
      let startIndex = -1;
      let endIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase().trim();
        if (keywords.some(keyword => line.includes(keyword.toLowerCase()))) {
          startIndex = i;
          break;
        }
      }

      if (startIndex !== -1) {
        for (let i = startIndex + 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('## ') && i > startIndex) {
            endIndex = i;
            break;
          }
        }
        
        if (endIndex === -1) endIndex = lines.length;

        const sectionLines = lines.slice(startIndex, endIndex);
        const content = sectionLines.join('\n').trim();
        
        if (content.length > 0) {
          sections.push({
            title: sectionTitle,
            content: content
          });
        }
      }
    }

    return sections;
  };

  const handleSubmitFiles = async () => {
    if (uploadedFiles.length === 0) return;

    const filesToUpload = uploadedFiles
      .map(file => file.originalFile)
      .filter((file): file is File => file !== undefined);

    if (filesToUpload.length === 0) {
      toast({
        title: "No files to upload",
        description: "Please select files before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setShowLoader(true);
    
    try {
      const formData = new FormData();
      filesToUpload.forEach((file) => {
        formData.append('file', file);
      });

      const response = await fetch('http://deluxe-internet-300914418.us-east-1.elb.amazonaws.com:8000/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Extract brd_id from the response
      const brdId = result.brd_id;
      if (!brdId) {
        throw new Error('BRD ID not found in response');
      }

      toast({
        title: "Files submitted successfully",
        description: `${filesToUpload.length} file(s) have been uploaded to the server.`,
      });

      // Make second API call to get BRD content using the correct endpoint
      const brdResponse = await fetch(`http://deluxe-internet-300914418.us-east-1.elb.amazonaws.com:8000/api/v1/files/brd/${brdId}`, {
        method: 'GET',
      });

      if (!brdResponse.ok) {
        throw new Error(`BRD fetch error! status: ${brdResponse.status}`);
      }

      const brdResult = await brdResponse.json();
      
      // Pass the BRD content to the chat interface
      if (onBRDGenerated && brdResult.content) {
        onBRDGenerated(brdResult.content);
      }

      // Parse and pass sections to BRD Progress
      if (onBRDSectionsUpdate && brdResult.content) {
        const parsedSections = parseBRDSections(brdResult.content);
        onBRDSectionsUpdate(parsedSections);
      }

      toast({
        title: "BRD generated successfully",
        description: "Your Business Requirements Document has been generated and displayed in the chat.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setShowLoader(false);
    }
  };
  return (
    <>
      <FullScreenLoader isVisible={showLoader} message="Please wait" />
      <Card className="h-auto xl:h-[600px] flex flex-col">
        <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-bold text-[hsl(var(--heading-primary))] break-words">Uploaded Files</CardTitle>
            <p className="text-sm text-muted-foreground mt-1" style={{color: '#727272'}}>
              {uploadedFiles.length} files available for BRD creation
            </p>
          </div>
          <div className="flex-shrink-0">
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
              className="bg-white border border-[#3B3B3B] hover:bg-gray-50 w-full sm:w-auto"
            >
              <Upload className="w-4 h-4 text-[#3B3B3B] mr-2 sm:mr-0" />
              <span className="sm:hidden">Upload Files</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-4">
          {uploadedFiles.length === 0 ? (
            <div className="flex items-center justify-center h-24 sm:h-32 text-muted-foreground text-center">
              <p className="text-sm" style={{color: '#727272'}}>No file selected.</p>
            </div>
          ) : (
            <div className="space-y-3 mb-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex flex-col sm:flex-row sm:items-center p-3 border border-border rounded-lg gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0 flex-grow">
                    <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate" title={file.name}>{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {file.size} • {file.timestamp}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadFile(file)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-destructive hover:text-destructive h-8 w-8 p-0"
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
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="text-sm">All files processed and draft ready for review</span>
            </div>
            <Button variant="outline" className="w-full justify-center gap-2 h-12 bg-white border border-[#8C8C8C] hover:bg-gray-50" onClick={handleSubmitFiles} disabled={uploadedFiles.length === 0 || isSubmitting}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>{isSubmitting ? "Submitting..." : "Submit Files"}</span>
            </Button>
          </div>
        )}
        
        <div className="mt-4">
          <h4 className="font-medium mb-3">Actions</h4>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-center items-center h-12 bg-white border border-[#8C8C8C] hover:bg-gray-50 px-3" disabled={uploadedFiles.length === 0}>
              <Upload className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Update</span>
            </Button>
            <p className="text-xs text-muted-foreground px-2" style={{color: '#727272'}}>
              Complete all BRD sections before submitting for approval
            </p>
          </div>
          <div className="flex gap-2 mt-4">
            <Button className="w-full" variant="default" disabled={uploadedFiles.length === 0}>
              <Download className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Download BRD</span>
            </Button>
          </div>
        </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
};