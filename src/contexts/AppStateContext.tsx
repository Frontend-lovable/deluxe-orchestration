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
  isFilesUploaded: boolean;
  setIsFilesUploaded: (uploaded: boolean) => void;
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
  const [isFilesUploaded, setIsFilesUploaded] = useState(false);

  const setChatMessages = (view: keyof AppStateContextType["chatMessages"], messages: ChatMessageType[]) => {
    setChatMessagesState(prev => ({
      ...prev,
      [view]: messages,
    }));
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
        isFilesUploaded,
        setIsFilesUploaded,
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
