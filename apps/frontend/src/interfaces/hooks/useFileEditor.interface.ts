import { UploadFile } from "antd";
import { LayoutItem, UpdatePayload, XmlFileMetaData } from "@scania-coder/types";
import { FormInstance } from "antd/lib";
import { UploadChangeParam } from "antd/es/upload";

export interface UseFileEditor {
  isLoading: boolean;
  url: string;
  blobFile: Blob | undefined;
  file: UploadFile<XmlFileMetaData> | undefined;
  fileData: XmlFileMetaData | null;
  fileVersion: string | null;
  layouts: LayoutItem[] | undefined
  layoutFields: UpdatePayload[];
  setFile: (file: UploadFile<XmlFileMetaData> | undefined) => void;
  setFileData: (fileData: XmlFileMetaData | null) => void;
  setFileVersion: (version: string | null) => void;
  setUrl: (url: string) => void;
  setIsLoading: (loading: boolean) => void;
  isFieldAdded: boolean;
  fileList: UploadFile[];
  clearForm: () => void;
  setIsFieldAdded: (value: boolean) => void;
  form: FormInstance;
  handleChangeFile: (info: UploadChangeParam<UploadFile<XmlFileMetaData>>) => void;
  onLayoutChangeMutation: any;
}
