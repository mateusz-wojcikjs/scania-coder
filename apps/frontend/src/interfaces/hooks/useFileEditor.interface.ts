import { UploadFile } from "antd";
import { LayoutItem, UpdatePayload, XmlFileMetaData } from "@scania-coder/types";
import { FormInstance } from "antd/lib";
import { UploadChangeParam } from "antd/es/upload";
import { ApiMutation, LayoutItemData } from "../../types";
import { Layout } from "../api";
import { CheckboxChangeEvent } from "antd/es/checkbox";

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
  onLayoutChangeMutation: ApiMutation<Layout, number>;
  editXmlMutation: ApiMutation<Blob, FormData>;
  saveLayoutMutation: ApiMutation<Layout, LayoutItemData>;
  onCheckToRemove: (e: CheckboxChangeEvent, name: number) => void;
}
