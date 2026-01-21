import { useContext } from "react";
import { FileEditorContext } from "../contexts/fileEditor.context";
import { UseFileEditor } from "../interfaces/hooks";

export const useFileEditorContext = (): UseFileEditor => {
  const context = useContext(FileEditorContext);
  if (!context) {
    throw new Error("useFileEditorContext must be used within a FileEditorProvider");
  }
  return context;
};
