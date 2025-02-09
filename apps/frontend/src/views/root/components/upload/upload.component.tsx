import { Divider, message, Typography, Upload as ANTDUpload } from "antd";
import { RcFile } from "antd/lib/upload";
import { InboxOutlined } from "@ant-design/icons";
import { TransProps, useTranslation } from "react-i18next";
import { useUpload } from "../../../../hooks";
import { useFileEditorContext } from "../../../../contexts";
import { StyledAlert } from "./upload.styled.ts";

const { Dragger } = ANTDUpload;
const { Title } = Typography;

export const Upload: () => JSX.Element = (): JSX.Element => {
  const { t }: TransProps<never> = useTranslation();
  const { customUpload } = useUpload();
  const { file, clearForm, fileList, handleChangeFile } = useFileEditorContext();

  return (
    <>
      <Divider orientation="left">
        <Title level={3}>{t("sc.fe.steps.title.upload")}</Title>
      </Divider>
      <Dragger
        name='file'
        customRequest={customUpload}
        showUploadList
        maxCount={1}
        fileList={fileList}
        beforeUpload={(file: RcFile) => {
          const isXml: boolean = file.type === 'text/xml' || file.name.endsWith('.xml');
          if (!isXml) {
            message.error(t('sc.fe.forms.upload.invalidType'));
          }
          return isXml || ANTDUpload.LIST_IGNORE;
        }}
        onChange={handleChangeFile}
        onRemove={clearForm}
      >
        <p className="ant-upload-drag-icon"><InboxOutlined/></p>
        <p className="ant-upload-text">{t("sc.fe.steps.upload.title")}</p>
        <p className="ant-upload-hint">{t("sc.fe.steps.upload.description")}</p>
      </Dragger>
      {!!file && <StyledAlert message={t("sc.fe.alerts.uploadSuccessful")} type="success" showIcon /> }
    </>
  )
}
