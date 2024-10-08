import { UploadFile } from "antd";

export interface EditFileFormProps {
    blobFile: Blob | undefined;
    file: UploadFile<File> | undefined;
    setUrl: (url: string) => void;
    layoutFields: {name: string; newValue: string}[];
    setIsLoading: (loading: boolean) => void;
}
