import { createContext, useContext, useState, ReactNode } from "react";
import { type Project } from "@/services/projectApi";

interface ChatMessageType {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: string;
  isTyping?: boolean;
  isLoading?: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  timestamp: string;
  originalFile?: File;
}

interface UploadedFileBatch {
  id: string;
  files: Array<{ name: string; size: string }>;
  contentPreview: string;
  timestamp: string;
}

interface AppStateContextType {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  selectedBRDTemplate: string | null;
  setSelectedBRDTemplate: (template: string | null) => void;
  chatMessages: {
    overview: ChatMessageType[];
    brd: ChatMessageType[];
    confluence: ChatMessageType[];
    jira: ChatMessageType[];
    design: ChatMessageType[];
  };
  setChatMessages: (view: keyof AppStateContextType["chatMessages"], messages: ChatMessageType[]) => void;
  isFileUploading: boolean;
  setIsFileUploading: (uploading: boolean) => void;
  pendingUploadResponse: any | null;
  setPendingUploadResponse: (response: any | null) => void;
  uploadedFileBatches: UploadedFileBatch[];
  addUploadedFileBatch: (batch: UploadedFileBatch) => void;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: (files: UploadedFile[] | ((prev: UploadedFile[]) => UploadedFile[])) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedBRDTemplate, setSelectedBRDTemplate] = useState<string | null>(null);
  const [chatMessages, setChatMessagesState] = useState<AppStateContextType["chatMessages"]>({
    overview: [],
    brd: [],
    confluence: [],
    jira: [],
    design: [],
  });
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [pendingUploadResponse, setPendingUploadResponse] = useState<any | null>(null);
  const [uploadedFileBatches, setUploadedFileBatches] = useState<UploadedFileBatch[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const setChatMessages = (view: keyof AppStateContextType["chatMessages"], messages: ChatMessageType[]) => {
    setChatMessagesState(prev => ({
      ...prev,
      [view]: messages,
    }));
  };

  const addUploadedFileBatch = (batch: UploadedFileBatch) => {
    setUploadedFileBatches(prev => [...prev, batch]);
  };

  return (
    <AppStateContext.Provider
      value={{
        selectedProject,
        setSelectedProject,
        selectedBRDTemplate,
        setSelectedBRDTemplate,
        chatMessages,
        setChatMessages,
        isFileUploading,
        setIsFileUploading,
        pendingUploadResponse,
        setPendingUploadResponse,
        uploadedFileBatches,
        addUploadedFileBatch,
        uploadedFiles,
        setUploadedFiles,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
