import { useTranslation } from "react-i18next";
import { useFileEditorContext } from "../../../../contexts";
import { Button, Divider, Typography } from "antd";
import { DownloadOutlined, RedoOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const Download: () => JSX.Element = (): JSX.Element => {
  const { t } = useTranslation();
  const { file, url, clearForm } = useFileEditorContext();

  return (
    <>
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
    </>
  );
};
