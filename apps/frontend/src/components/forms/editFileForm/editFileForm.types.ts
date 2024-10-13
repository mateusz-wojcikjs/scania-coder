import { UploadFile } from "antd";
import { XmlFileMetaData } from "@scania-coder/types";

export interface EditFileFormProps {
    blobFile: Blob | undefined;
    file: UploadFile<XmlFileMetaData> | undefined;
    setUrl: (url: string) => void;
    layoutFields: {name: string; newValue: string}[];
    setIsLoading: (loading: boolean) => void;
    newMajorVersion: string;
    setIsFieldAdded: (value: boolean) => void;
}
