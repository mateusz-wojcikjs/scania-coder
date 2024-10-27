import { UploadFile } from "antd";
import { UpdatePayload, XmlFileMetaData } from "@scania-coder/types";

export interface EditFileFormProps {
    blobFile: Blob | undefined;
    file: UploadFile<XmlFileMetaData> | undefined;
    setUrl: (url: string) => void;
    layoutFields: UpdatePayload[];
    setIsLoading: (loading: boolean) => void;
    newMajorVersion: string;
    setIsFieldAdded: (value: boolean) => void;
}
