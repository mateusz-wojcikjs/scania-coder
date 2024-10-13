import { Alert, Button, Divider, message, Typography, Upload, UploadFile, Select, Row, Col } from "antd";
import { DownloadOutlined, InboxOutlined } from "@ant-design/icons";
import { TransProps, useTranslation } from "react-i18next";
import { UploadChangeParam } from "antd/es/upload";
import { XmlFileMetaData } from "@scania-coder/types";
import { EditFileForm, Loader, VersionCard } from "../../components";
import { UseFileEditor } from "../../interfaces/hooks";
import { useFileEditor } from "../../hooks";
import {
  Box,
  Container,
  Description,
  InnerWrapper,
  Label,
  SelectWrapper,
  StyledAlert,
  Wrapper
} from "./root.styled.ts";
import { useState } from "react";

const { Dragger } = Upload;
const { Title } = Typography;

export const Root = () => {
  const { t }: TransProps<never> = useTranslation();
  const [isFieldAdded, setIsFieldAdded] = useState(false);
  const { isLoading, file, blobFile, onChange, url, setUrl, setBlobFile, setFile, setFileData, layoutFields, layoutItems, setIsLoading, fileData, fileVersion, setFileVersion }: UseFileEditor = useFileEditor();

  return (
    <Container>
      {isLoading && <Loader />}
      <Title level={1}>{t("sc.fe.views.root.title")}</Title>
      <Divider orientation="left">
        <Title level={3}>{t("sc.fe.steps.title.upload")}</Title>
      </Divider>
      <Dragger
        name='file'
        action='/api/upload-xml'
        showUploadList
        onChange={(info: UploadChangeParam<UploadFile<XmlFileMetaData>>) => {
          const { status, originFileObj, name, response } = info.file;
          setBlobFile(originFileObj);
          if (status === "done") {
            message.success(t('sc.fe.forms.upload.success', { fileName: name }));
            setFile(info.file);

            if (response) {
              setFileData(response);
              setFileVersion(String(Number(response.majorVersion) + 1));
            }
          } else if (status === "error") {
            message.error(t('sc.fe.forms.upload.error', { fileName: name }));
          }
        }}
        onRemove={() => setFile(undefined)}
      >
        <p className="ant-upload-drag-icon"><InboxOutlined/></p>
        <p className="ant-upload-text">{t("sc.fe.steps.upload.title")}</p>
        <p className="ant-upload-hint">{t("sc.fe.steps.upload.description")}</p>
      </Dragger>
      {!!file && <StyledAlert message={t("sc.fe.alerts.uploadSuccessful")} type="success" showIcon/> }
      <Divider orientation="left">
        <Title level={3}>{t("sc.fe.steps.title.edit")}</Title>
      </Divider>
      <Wrapper>
        {!!fileData && (<Description>{t("sc.fe.steps.edit.description")}</Description>)}
        {!!fileData && (
          <InnerWrapper>
            <Box>
              <div>
                {isFieldAdded ? (
                  <Row>
                    <Col span={12}><Label>{t('sc.fe.steps.edit.labels.name')}</Label></Col>
                    <Col><Label>{t('sc.fe.steps.edit.labels.value')}</Label></Col>
                  </Row>
                ) : (
                  <Row>
                    <Col span={12}><Label>{t('sc.fe.steps.edit.labels.create')}</Label></Col>
                  </Row>
                )}
                <EditFileForm {...{ blobFile, file, setUrl, layoutFields, setIsLoading, newMajorVersion: fileVersion || fileData.majorVersion, setIsFieldAdded }} />
              </div>
              <SelectWrapper>
                <Row><Col><Label>{t('sc.fe.steps.edit.labels.savedLayouts')}</Label></Col></Row>
                <Select
                  options={layoutItems}
                  placeholder={t('sc.fe.steps.edit.chooseLayout')}
                  onChange={onChange}
                  disabled={!file}
                />
              </SelectWrapper>
            </Box>
            <VersionCard currentFileVersion={fileData.majorVersion} newFileVersion={fileVersion || fileData.majorVersion} setFileVersion={setFileVersion}/>
          </InnerWrapper>
        )}
      </Wrapper>
      {!!url && <Alert message={t('sc.fe.alerts.editSuccessful')} type="success" showIcon/>}
      <Divider orientation="left">
        <Title level={3}>{t("sc.fe.steps.title.download")}</Title>
      </Divider>
      <Button
        type="primary"
        href={url}
        icon={<DownloadOutlined/>}
        download={file && `modified-${file.name}`}
        disabled={!url}
      >
        {t("sc.fe.steps.download")}
      </Button>
    </Container>
  );
};
