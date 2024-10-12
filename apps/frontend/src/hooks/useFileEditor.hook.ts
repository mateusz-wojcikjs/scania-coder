import { UpdatePayload, XmlFileMetaData } from "@scania-coder/types";
import { useEffect, useState } from "react";
import { message, UploadFile } from "antd";
import { UseState } from "../types";
import { UseFileEditor } from "../interfaces/hooks";

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
        const res = await fetch("/api/layouts");
        const data = await res.json();
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
      const res = await fetch(`/api/layouts/${id}`);
      const data = await res.json();

      if (res.ok) {
        setLayoutFields(data.updates.map((item: UpdatePayload) => item));
        setIsLoading(false);
        message.success('Poprawnie użyto szablonu');
      }
    } catch (err) {
      console.error(err);
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
