import { useEffect, useState } from "react";
import { Alert, Button, Divider, message, Typography, Upload, UploadFile, Select, Flex } from "antd";
import { DownloadOutlined, InboxOutlined } from "@ant-design/icons";
import { TransProps, useTranslation } from "react-i18next";
import { UseState } from "../types";
import { UploadChangeParam } from "antd/es/upload";
import { EditFileForm, Loader } from "../components";


const { Dragger } = Upload;

const Root = () => {
  const { t }: TransProps<never> = useTranslation();
  const [file, setFile]: UseState<UploadFile<File> | undefined> = useState();
  const [blobFile, setBlobFile]: UseState<Blob | undefined> = useState();
  const [isLoading, setIsLoading]: UseState<boolean> = useState(false);
  const [url, setUrl] = useState("");
  const [layoutFields, setLayoutFields] = useState([]);
  const [layoutItems, setLayoutItems] = useState([]);

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
        setLayoutFields(data.updates.map((item: any) => item));
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {isLoading && <Loader />}
      <Typography.Title level={1}>Dashboard</Typography.Title>

      <Divider orientation="left"><Typography.Title level={3}>{t("sc.fe.views.root.steps.title.upload")}</Typography.Title></Divider>
      <Dragger
        name='file'
        action='/api/upload-xml'
        showUploadList
        onChange={(info: UploadChangeParam<UploadFile<File>>) => {
          setBlobFile(info.file.originFileObj);
          const { status } = info.file;
          if (status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);
            setFile(info.file);
          } else if (status === "error") {
            message.error(`${info.file.name} file upload failed.`);
          }
        }}
        onRemove={() => setFile(undefined)}
        onDrop={(e) => {
          console.log("Dropped files", e.dataTransfer.files);
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined/>
        </p>
        <p className="ant-upload-text">{t("sc.fe.views.root.steps.upload.title")}</p>
        <p className="ant-upload-hint">
          {t("sc.fe.views.root.steps.upload.description")}
        </p>
      </Dragger>
      {!!file && <Alert message="Poprawnie załadowano plik XML." type="success" showIcon />}
      <Divider orientation="left"><Typography.Title level={3}>{t("sc.fe.views.root.steps.title.edit")}</Typography.Title></Divider>
      <p style={{ fontSize: "14px", marginBottom: 12, color: "#666" }}>Edytuj plik XML dodając pola w parach NAME - VALUE i uzupełnij je. Możesz też użyć, którejś z gotowych konfiguracji pliku. Następnie klikniij przycisk "Nadpisz dane".</p>
      <Flex gap="middle" wrap>
        <EditFileForm { ...{ blobFile, file, setUrl, layoutFields, setIsLoading }} />
        <Select
          options={layoutItems}
          placeholder="Wybierz istniejącą konfigurację"
          onChange={onChange}
          disabled={!file}
          style={{ minWidth: "250px" }}
        />
      </Flex>
      {!!url && <Alert message="Poprawnie edytowano plik XML." type="success" showIcon />}
      <Divider orientation="left">
        <Typography.Title level={3}>{t("sc.fe.views.root.steps.title.download")}</Typography.Title>
      </Divider>
      <Button type="primary" href={url} icon={<DownloadOutlined />} download={file && `modified-${file.name}`} disabled={!url}>
        {t("sc.fe.views.root.steps.download")}
      </Button>
    </div>
  );
};

export default Root;
