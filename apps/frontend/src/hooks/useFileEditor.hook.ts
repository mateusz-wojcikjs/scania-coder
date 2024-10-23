import { UpdatePayload, XmlFileMetaData } from "@scania-coder/types";
import { useEffect, useState } from "react";
import { message, UploadFile } from "antd";
import { ApiError, UseState } from "../types";
import { UseFileEditor } from "../interfaces/hooks";
import { api } from "../api.ts";

export const useFileEditor: () => UseFileEditor = (): UseFileEditor => {
  const [fileData, setFileData]: UseState<XmlFileMetaData | undefined> = useState();
  const [file, setFile]: UseState<UploadFile<XmlFileMetaData> | undefined> = useState();
  const [blobFile, setBlobFile]: UseState<Blob | undefined> = useState();
  const [isLoading, setIsLoading]: UseState<boolean> = useState(false);
  const [url, setUrl] = useState("");
  const [layoutFields, setLayoutFields] = useState([]);
  const [layoutItems, setLayoutItems]: UseState<UpdatePayload [] | undefined> = useState();
  const [fileVersion, setFileVersion] = useState(fileData?.majorVersion);

  useEffect(() => {
    (async () => {
      try {
        const data = await api(`/api/layouts`);
        const transformedData = data.map((layout: { id: string; name: string; }) => ({
          value: layout.id,
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
      const data = await api<{ updates: UpdatePayload[] }>(`/api/layouts/${id}`);
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
