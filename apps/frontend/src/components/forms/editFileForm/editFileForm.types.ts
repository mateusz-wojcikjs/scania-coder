import { UploadFile } from "antd";
import { UpdatePayload, XmlFileMetaData } from "@scania-coder/types";
import { FormInstance } from "antd/lib";

export interface EditFileFormProps {
    blobFile: Blob | undefined;
    file: UploadFile<XmlFileMetaData> | undefined;
    setUrl: (url: string) => void;
    layoutFields: UpdatePayload[];
    setIsLoading: (loading: boolean) => void;
    newMajorVersion: string;
    setFile: (file: UploadFile<XmlFileMetaData> | undefined) => void;
    setFileData: (fileData: XmlFileMetaData | null) => void;
    form: FormInstance;
}
