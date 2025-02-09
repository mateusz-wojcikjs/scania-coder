import { createContext, ReactNode, useContext } from "react";
import { UseFileEditor } from "../interfaces/hooks";

const FileEditorContext = createContext<UseFileEditor | null>(null);

export const FileEditorProvider: React.FC<{ value: UseFileEditor; children: ReactNode  }> = ({ value, children }) => (
  <FileEditorContext.Provider value={value}>{children}</FileEditorContext.Provider>
);

export const useFileEditorContext = (): UseFileEditor => {
  const context = useContext(FileEditorContext);
  if (!context) {
    throw new Error('useFileEditorContext must be used within a FileEditorProvider');
  }
  return context;
};
