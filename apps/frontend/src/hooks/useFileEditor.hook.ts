import { LayoutData, LayoutItem, UpdatePayload, XmlFileMetaData } from "@scania-coder/types";
import { useEffect, useState } from "react";
import { message, UploadFile } from "antd";
import { ApiError, UseState } from "../types";
import { UseFileEditor } from "../interfaces/hooks";
import { api } from "../api.ts";

export const useFileEditor: () => UseFileEditor = (): UseFileEditor => {
  const [fileData, setFileData]: UseState<XmlFileMetaData | null> = useState<XmlFileMetaData | null>(null);
  const [file, setFile]: UseState<UploadFile<XmlFileMetaData> | undefined> = useState();
  const [blobFile, setBlobFile]: UseState<Blob | undefined> = useState();
  const [isLoading, setIsLoading]: UseState<boolean> = useState(false);
  const [url, setUrl] = useState("");
  const [layoutFields, setLayoutFields]: UseState<UpdatePayload[]> = useState<UpdatePayload[]>([]);
  const [layoutItems, setLayoutItems]: UseState<LayoutItem[]> = useState<LayoutItem[]>([]);
  const [fileVersion, setFileVersion]: UseState<string | null> = useState<string | null>(fileData?.majorVersion ?? '0');

  useEffect(() => {
    (async () => {
      try {
        const data: LayoutData[] = await api(`/api/layouts`, "GET");
        const transformedData: LayoutItem[] = data.map((layout: LayoutData): LayoutItem => ({
          value: layout.id.toString(),
          label: layout.name,
        }));

        setLayoutItems(transformedData);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const onChange = async (id: number) => {
    setIsLoading(true);
    try {
      const data: { updates: UpdatePayload[] } = await api(`/api/layouts/${id}`, 'GET');
      setLayoutFields(data.updates);
      message.success('Poprawnie użyto szablonu');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          message.error('Unauthorized access. Please log in again.');
        } else {
          message.error(`Error ${err.status}: ${err.message}`);
        }
      } else {
        console.error(err);
        message.error('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    url,
    onChange,
    file,
    fileData,
    blobFile,
    layoutItems,
    layoutFields,
    setFileData,
    setFile,
    setBlobFile,
    setUrl,
    setIsLoading,
    fileVersion,
    setFileVersion,
  }
}
