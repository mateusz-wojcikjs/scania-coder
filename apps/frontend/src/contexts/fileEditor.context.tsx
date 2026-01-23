import { createContext, ReactNode } from "react";
import { UseFileEditor } from "../interfaces/hooks";

export const FileEditorContext = createContext<UseFileEditor | null>(null);

export const FileEditorProvider: React.FC<{ value: UseFileEditor; children: ReactNode  }> = ({ value, children }) => (
  <FileEditorContext.Provider value={value}>{children}</FileEditorContext.Provider>
);
