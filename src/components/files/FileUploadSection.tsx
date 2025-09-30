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
  onBRDGenerated?: (brdContent: string) => void;
  onBRDSectionsUpdate?: (sections: Array<{title: string, content: string}>) => void;
}

export const FileUploadSection = ({ onCreateBRD, onBRDGenerated, onBRDSectionsUpdate }: FileUploadSectionProps = {}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingBRD, setIsGeneratingBRD] = useState(false);
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
    const sections: Array<{title: string, content: string}> = [];
    
    // Map API section names to BRD Progress section names
    const sectionMapping: Record<string, string> = {
      'executive summary': 'Document Overview',
      'document overview': 'Document Overview',
      'purpose': 'Purpose',
      'background': 'Background / Context',
      'context': 'Background / Context',
      'stakeholders': 'Stakeholders',
      'stakeholder': 'Stakeholders',
      'scope': 'Scope',
      'business objectives': 'Business Objectives & ROI',
      'roi': 'Business Objectives & ROI',
      'return on investment': 'Business Objectives & ROI',
      'functional requirements': 'Functional Requirements',
      'non-functional requirements': 'Non-Functional Requirements',
      'user stories': 'User Stories / Use Cases',
      'use cases': 'User Stories / Use Cases',
      'assumptions': 'Assumptions',
      'constraints': 'Constraints',
      'acceptance criteria': 'Acceptance Criteria / KPIs',
      'kpis': 'Acceptance Criteria / KPIs',
      'key performance indicators': 'Acceptance Criteria / KPIs',
      'timeline': 'Timeline / Milestones',
      'milestones': 'Timeline / Milestones',
      'risks': 'Risks and Dependencies',
      'dependencies': 'Risks and Dependencies',
      'approval': 'Approval & Review',
      'review': 'Approval & Review',
      'glossary': 'Glossary & Appendix',
      'appendix': 'Glossary & Appendix'
    };
    
    let currentSection = 'Document Overview';
    let currentContent = '';
    
    const lines = brdContent.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim().toLowerCase();
      
      // Check if this line is a section header
      let foundSectionKey = '';
      for (const [key, value] of Object.entries(sectionMapping)) {
        if (trimmedLine.includes(key) && 
            (trimmedLine.includes(':') || trimmedLine.includes('#') || trimmedLine.match(/^\d+\./))) {
          foundSectionKey = value;
          break;
        }
      }
      
      if (foundSectionKey) {
        // Save previous section if it has content
        if (currentContent.trim()) {
          sections.push({ title: currentSection, content: currentContent.trim() });
        }
        
        currentSection = foundSectionKey;
        currentContent = line + '\n';
      } else {
        currentContent += line + '\n';
      }
    }
    
    // Add the last section
    if (currentContent.trim()) {
      sections.push({ title: currentSection, content: currentContent.trim() });
    }
    
    return sections;
  };

  const handleSubmitFiles = async () => {
    if (uploadedFiles.length === 0) return;

    // Trigger BRD template mode when file upload starts
    if (onCreateBRD) {
      onCreateBRD();
    }

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

    setIsGeneratingBRD(true);
    try {
      // Step 1: Upload files and get BRD ID
      const formData = new FormData();
      filesToUpload.forEach((file) => {
        formData.append('file', file);
      });

      const uploadResponse = await fetch('http://deluxe-internet-300914418.us-east-1.elb.amazonaws.com:8000/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      const uploadResult = await uploadResponse.json();
      console.log('Upload result:', uploadResult);
      
      // Show success message after upload
      toast({
        title: "Files uploaded successfully",
        description: uploadResult.message || "Files have been uploaded and are being processed.",
      });
      
      // Extract BRD ID from response
      const brdId = uploadResult.brd_auto_generated.brd_id;
      
      if (brdId) {
        
        // Step 2: Get BRD content using the BRD ID
        const brdResponse = await fetch(`http://deluxe-internet-300914418.us-east-1.elb.amazonaws.com:8000/api/v1/files/brd/${brdId}`);

        const brdData = await brdResponse.json();
        console.log('BRD data:', brdData);
        
        // Extract BRD content from response
        const brdContent = brdData.content || brdData.brd_content || brdData.data || JSON.stringify(brdData, null, 2);
        
        // Display in chatbox
        if (onBRDGenerated) {
          onBRDGenerated(`# BRD Generated Successfully\n\n${brdContent}`);
        }
        
        // Parse and update BRD sections
        if (onBRDSectionsUpdate) {
          const sections = parseBRDSections(brdContent);
          onBRDSectionsUpdate(sections);
        }
        
        toast({
          title: "BRD Generated Successfully",
          description: "Your Business Requirements Document has been generated and is ready for review.",
        });
      } else {
        toast({
          title: "BRD ID Not Found",
          description: "Files uploaded but BRD ID was not returned. Please try again.",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('BRD generation error:', error);
      toast({
        title: "BRD Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate BRD. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingBRD(false);
    }
  };
  return (
    <>
      {isGeneratingBRD && <FullScreenLoader message="Generating BRD Please wait" />}
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
            <Button variant="outline" className="w-full justify-center gap-2 h-12 bg-white border border-[#8C8C8C] hover:bg-gray-50" onClick={handleSubmitFiles} disabled={uploadedFiles.length === 0 || isGeneratingBRD}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>{isGeneratingBRD ? "Generating BRD..." : "Submit Files"}</span>
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