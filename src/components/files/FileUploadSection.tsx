import { useRef } from "react";
import { Download, Upload, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { uploadFiles, downloadBRD } from "@/services/projectApi";
import { useAppState } from "@/contexts/AppStateContext";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  timestamp: string;
  originalFile?: File;
}

interface FileUploadSectionProps {
  onUploadSuccess?: (response?: any) => void;
}

export const FileUploadSection = ({ onUploadSuccess }: FileUploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { 
    isFileUploading, 
    setIsFileUploading, 
    setPendingUploadResponse,
    uploadedFileBatches,
    addUploadedFileBatch,
    uploadedFiles,
    setUploadedFiles,
    isBRDApproved,
    selectedProject,
    setIsBRDApproved,
    brdId,
    setBrdId,
    isBRDDownloading,
    setIsBRDDownloading
  } = useAppState();

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
    if (!selectedProject) {
      toast({
        title: "No project selected",
        description: "Please select a project first from the Project Workspace",
        variant: "destructive",
      });
      return;
    }
    fileInputRef.current?.click();
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

    setIsFileUploading(true);
    try {
      const response = await uploadFiles(filesToUpload);
      
      // Store brdId from response
      if (response.brd_auto_generated?.brd_id) {
        setBrdId(response.brd_auto_generated.brd_id);
      }
      
      // Add batch with content preview
      const batch = {
        id: `batch-${Date.now()}`,
        files: uploadedFiles.map(f => ({ name: f.name, size: f.size })),
        contentPreview: response.brd_auto_generated?.content_preview || response.message || "Files processed successfully",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      addUploadedFileBatch(batch);
      
      // Clear current files to allow new upload
      setUploadedFiles([]);
      
      // Remove "Done" badges from BRD Progress
      setIsBRDApproved(false);
      
      setPendingUploadResponse(response);
      onUploadSuccess?.(response);
    } catch (error) {
      // Keep files in the list and maintain download/delete options on failure
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFileUploading(false);
    }
  };

  const handleDownloadBRD = async () => {
    if (uploadedFileBatches.length === 0) {
      toast({
        title: "No BRD available",
        description: "Please upload files and generate a BRD first.",
        variant: "destructive",
      });
      return;
    }

    // Get the most recent batch's content preview
    const latestBatch = uploadedFileBatches[uploadedFileBatches.length - 1];
    const contentPreview = latestBatch.contentPreview;
    const projectName = selectedProject?.project_name || "project";
    const filename = `${projectName}_brd`;

    setIsBRDDownloading(true);
    try {
      const blob = await downloadBRD(contentPreview, filename);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "BRD downloaded",
        description: "Your BRD has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download BRD. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBRDDownloading(false);
    }
  };

  return (
    <Card className="h-auto xl:h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-bold text-[hsl(var(--heading-primary))] break-words">Uploaded Files</CardTitle>
            <p className="text-sm text-muted-foreground mt-1" style={{color: '#727272'}}>
              {uploadedFiles.length} files ready to submit
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
              disabled={!selectedProject}
            >
              <Upload className="w-4 h-4 text-[#3B3B3B] mr-2 sm:mr-0" />
              <span className="sm:hidden">Upload Files</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2">
        {!selectedProject ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <div className="text-sm mb-2">No project selected</div>
              <div className="text-xs">Please select a project first from Project Workspace</div>
            </div>
          </div>
        ) : (
        <div className="space-y-4">
          {/* Previously uploaded batches */}
          {uploadedFileBatches.map((batch) => (
            <div key={batch.id} className="border border-border rounded-lg p-3 bg-muted/30">
              <div className="space-y-2">
                {batch.files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 opacity-60">
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {file.size} • {batch.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Current files being prepared */}
          {uploadedFiles.length === 0 && uploadedFileBatches.length === 0 ? (
            <div className="flex items-center justify-center h-24 sm:h-32 text-muted-foreground text-center">
              <p className="text-sm" style={{color: '#727272'}}>No file selected.</p>
            </div>
          ) : uploadedFiles.length > 0 ? (
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
          ) : null}
        
        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-4">
            <Button variant="outline" className="w-full justify-center gap-2 h-12 bg-white border border-[#8C8C8C] hover:bg-gray-50" onClick={handleSubmitFiles} disabled={uploadedFiles.length === 0 || isFileUploading}>
              {isFileUploading ? (
                <>
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent flex-shrink-0" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Submit Files</span>
                </>
              )}
            </Button>
          </div>
        )}
        
        
        <div className="mt-4">
          <h4 className="font-medium mb-3">Actions</h4>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-center items-center h-12 bg-white border border-[#8C8C8C] hover:bg-gray-50 px-3" disabled={!isBRDApproved}>
              <Upload className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Upload to Confluence</span>
            </Button>
            <p className="text-xs text-muted-foreground px-2" style={{color: '#727272'}}>
              Complete all BRD sections before submitting for approval
            </p>
          </div>
          <Button 
            className="w-full mt-4" 
            variant="default" 
            disabled={!isBRDApproved || isBRDDownloading}
            onClick={handleDownloadBRD}
          >
            {isBRDDownloading ? (
              <>
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2 flex-shrink-0" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Download BRD</span>
              </>
            )}
          </Button>
        </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
};