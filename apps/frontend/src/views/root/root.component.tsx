import { Alert, Button, Divider, message, Typography, Upload, UploadFile, Select, Row, Col } from "antd";
import { DownloadOutlined, InboxOutlined, RedoOutlined } from "@ant-design/icons";
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
  FormHeader,
  FormHeaderCell,
  InnerWrapper,
  Label,
  SelectWrapper,
  StyledAlert,
  Wrapper
} from "./root.styled.ts";
import { api } from "../../api.ts";
import { UploadProps } from "antd/es/upload/interface";
import { UploadRequestError } from "rc-upload/lib/interface";

const { Dragger } = Upload;
const { Title } = Typography;

export const Root = () => {
  const { t }: TransProps<never> = useTranslation();
  const { isLoading, file, blobFile, onChange, url, setUrl, setBlobFile, setFile, setFileData, layoutFields, layoutItems, setIsLoading, fileData, fileVersion, setFileVersion, fileList, clearForm, isFieldAdded, setIsFieldAdded, form, setFileList }: UseFileEditor = useFileEditor();


  const customUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;

    try {
      const data = new FormData();
      data.append('file', file as any);

      const response = await api('/api/upload-xml', {
        method: 'POST',
        body: data,
        'Content-Type': 'multipart/form-data'
      });

      onSuccess && onSuccess(response, file);
    } catch (err) {
      const uploadError: UploadRequestError = {
        name: (err as Error).name,
        message: (err as Error).message,
      };

      onError && onError(uploadError);
    }
  };

  return (
    <Container>
      {isLoading && <Loader />}
      <Title level={1}>{t("sc.fe.views.root.title")}</Title>
      <Divider orientation="left">
        <Title level={3}>{t("sc.fe.steps.title.upload")}</Title>
      </Divider>
      <Dragger
        name='file'
        customRequest={customUpload}
        showUploadList
        maxCount={1}
        fileList={fileList}
        beforeUpload={(file) => {
          const isXml = file.type === 'text/xml' || file.name.endsWith('.xml');
          if (!isXml) {
            message.error(t('sc.fe.forms.upload.invalidType'));
          }
          return isXml || Upload.LIST_IGNORE;
        }}
        onChange={(info: UploadChangeParam<UploadFile<XmlFileMetaData>>) => {
          const { fileList: updatedFileList } = info;
          const { status, originFileObj, name, response, error } = info.file;
          setFileList(updatedFileList);
          setBlobFile(originFileObj);
          if (status === "done") {
            message.success(t('sc.fe.forms.upload.success', { fileName: name }));
            setFile(info.file);

            if (response) {
              console.log(response);
              setFileData(response);
              setFileVersion(String(Number(response.majorVersion) + 1));
            }
          } else if (status === "error") {
            const parsedError = JSON.parse(error.message).error;
            console.log(JSON.parse(error.message).error.errorCode);
            message.error(t('sc.fe.forms.upload.error', { fileName: name }));
            message.error(t('sc.api.errors.ERR_INVALID_FILE_STRUCTURE'));
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
            <SelectWrapper>
              <Row><Col><Label>{t('sc.fe.steps.edit.labels.savedLayouts')}</Label></Col></Row>
              <Select
                showSearch
                optionFilterProp="label"
                options={layoutItems}
                placeholder={t('sc.fe.steps.edit.chooseLayout')}
                onChange={onChange}
                disabled={!file}
              />
            </SelectWrapper>
            <VersionCard currentFileVersion={fileData.majorVersion} newFileVersion={fileVersion || fileData.majorVersion} setFileVersion={setFileVersion}/>
            <Box>
              <div>
                {isFieldAdded ? (
                  <FormHeader>
                    <FormHeaderCell style={{ flex: '1 1 100%' }}><Label>{t('sc.fe.steps.edit.labels.name')}</Label></FormHeaderCell>
                    <FormHeaderCell style={{ flex: '1 1 100%' }}><Label>{t('sc.fe.steps.edit.labels.value')}</Label></FormHeaderCell>
                    <FormHeaderCell style={{ flex: '1 1 100%' }}><Label>Usuwanie wiersza</Label></FormHeaderCell>
                    <FormHeaderCell style={{ flex: '0', maxWidth: '90px' }}><Label>Usuń pola</Label></FormHeaderCell>
                  </FormHeader>
                ) : (
                  <Row>
                    <Col span={12}><Label>{t('sc.fe.steps.edit.labels.create')}</Label></Col>
                  </Row>
                )}
                <EditFileForm {...{ blobFile, file, setUrl, layoutFields, setIsLoading, newMajorVersion: fileVersion || fileData.majorVersion, setIsFieldAdded, form, setFile, setFileData }} />
              </div>
            </Box>
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
        icon={<DownloadOutlined />}
        download={file && `modified-${file.name}`}
        disabled={!url}
      >
        {t("sc.fe.steps.download")}
      </Button>
      {url && (
        <Button
          type="default"
          icon={<RedoOutlined />}
          style={{ marginLeft: 8 }}
          onClick={clearForm}
        >
          {t("sc.fe.steps.clearForm")}
        </Button>
      )}
    </Container>
  );
};
