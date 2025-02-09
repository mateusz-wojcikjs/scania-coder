import { LayoutItem, UpdatePayload, XmlFileMetaData } from "@scania-coder/types";
import { useState } from "react";
import { Form, message, UploadFile } from "antd";
import { ApiError, UseState } from "../types";
import { UploadChangeParam } from "antd/es/upload";
import { TransProps, useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLayoutDetails, getLayouts } from "../api";
import { QueryKey } from "../enums";
import { Layout, UseFileEditor } from "../interfaces";

export const useFileEditor: () => UseFileEditor = (): UseFileEditor => {
  const [fileData, setFileData]: UseState<XmlFileMetaData | null> = useState<XmlFileMetaData | null>(null);
  const [file, setFile]: UseState<UploadFile<XmlFileMetaData> | undefined> = useState();
  const [blobFile, setBlobFile]: UseState<Blob | undefined> = useState();
  const [isLoading, setIsLoading]: UseState<boolean> = useState(false);
  const [url, setUrl] = useState("");
  const [layoutFields, setLayoutFields]: UseState<UpdatePayload[]> = useState<UpdatePayload[]>([]);
  const [fileVersion, setFileVersion]: UseState<string | null> = useState<string | null>(fileData?.majorVersion ?? '0');
  const [isFieldAdded, setIsFieldAdded] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { t }: TransProps<never> = useTranslation();

  const clearForm = () => {
    setFile(undefined);
    setIsFieldAdded(false);
    setFileData(null);
    setUrl("");
    setFileList([]);
    form.resetFields();
    setLayoutFields([]);
  };

  const { data: layouts } = useQuery({
    queryKey: [QueryKey.Layouts],
    queryFn: getLayouts,
    select: (fetchedData): LayoutItem[] => fetchedData.map((layout: Layout): LayoutItem => ({
      value: layout.id.toString(),
      label: layout.name,
    }))
  });

  const onLayoutChangeMutation = useMutation({
    mutationFn: getLayoutDetails,
    onSuccess: (data) => {
      setLayoutFields(data.updates);
      message.success(t('sc.fe.steps.edit.messages.layoutSuccess'));
    },
    onError: (err: Error): void => {
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
    }
  })

  const handleChangeFile: (info: UploadChangeParam<UploadFile<XmlFileMetaData>>) => void = (info: UploadChangeParam<UploadFile<XmlFileMetaData>>): void => {
    const { fileList: updatedFileList } = info;
    const { status, originFileObj, name, response, error } = info.file;
    setFileList(updatedFileList);
    setBlobFile(originFileObj);
    if (status === "done") {
      message.success(t('sc.fe.forms.upload.success', { fileName: name }));
      setFile(info.file);

      if (response) {
        setFileData(response);
        setFileVersion(String(Number(response.majorVersion) + 1));
      }
    } else if (status === "error") {
      console.log(JSON.parse(error.message).error.errorCode);
      message.error(t('sc.fe.forms.upload.error', { fileName: name }));
      message.error(t('sc.api.errors.ERR_INVALID_FILE_STRUCTURE'));
    }
  }

  return {
    isLoading: onLayoutChangeMutation.isPending || isLoading,
    url,
    file,
    fileData,
    blobFile,
    layouts,
    layoutFields,
    setFileData,
    setFile,
    setUrl,
    setIsLoading,
    fileVersion,
    setFileVersion,
    isFieldAdded,
    fileList,
    clearForm,
    setIsFieldAdded,
    form,
    handleChangeFile,
    onLayoutChangeMutation
  }
}
