import { UploadFile } from "antd";
import { LayoutItem, UpdatePayload, XmlFileMetaData } from "@scania-coder/types";

export interface UseFileEditor {
  isLoading: boolean;
  url: string;
  blobFile: Blob | undefined;
  onChange: (id: number) => void;
  file: UploadFile<XmlFileMetaData> | undefined;
  fileData: XmlFileMetaData | null;
  fileVersion: string | null;
  layoutItems: LayoutItem[] | undefined
  layoutFields: UpdatePayload[];
  setFile: (file: UploadFile<XmlFileMetaData> | undefined) => void;
  setFileData: (fileData: XmlFileMetaData | null) => void;
  setFileVersion: (version: string | null) => void;
  setBlobFile: (blobFile: Blob | undefined) => void;
  setUrl: (url: string) => void;
  setIsLoading: (loading: boolean) => void;
}
