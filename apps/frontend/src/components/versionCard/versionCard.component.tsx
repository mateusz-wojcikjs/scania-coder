import { TransProps, useTranslation } from "react-i18next";
import { Typography } from "antd";
import { VersionCardProps } from "./versionCard.types.ts";
import { FC } from "react";
import { Description, Label, StyledCard } from "./versionCard.styled.ts";
import { InputNumber, Tooltip } from "antd/lib";
import { InfoCircleOutlined } from "@ant-design/icons";
import { theme } from "../../theme/theme.ts";
const { Text } = Typography;

export const VersionCard: FC<VersionCardProps> = (props: VersionCardProps): JSX.Element => {
  const { currentFileVersion, newFileVersion, setFileVersion }: VersionCardProps = props;
  const { t }: TransProps<never> = useTranslation();

  return (
    <StyledCard
      title={t("sc.fe.steps.upload.card.currentFile", { version: currentFileVersion })}
      extra={
        <Tooltip title={t("sc.fe.steps.upload.card.tooltip")}>
          <InfoCircleOutlined style={{ color: theme.colors.primary }} />
        </Tooltip>
      }
    >
      <Description>{t("sc.fe.steps.upload.card.label")}</Description>
      <InputNumber
        addonBefore={t("sc.fe.steps.upload.card.majorVersion")}
        value={newFileVersion}
        onChange={(value: string | null): void => setFileVersion(value)}
        placeholder={t("sc.fe.steps.upload.card.inputPlaceholder")}
        maxLength={9}
        min='0'
        style={{ width: "100%" }}
      />
      <Label>
        {t("sc.fe.steps.upload.card.change")}
        {Number(currentFileVersion) === Number(newFileVersion)
          ? (
            <> {t("sc.fe.steps.upload.card.noChange")}</>
          ) : (
            <>
              <Text type="danger">{currentFileVersion}</Text>
              <span>&#8594;</span>
              <Text type="success">{newFileVersion}</Text>
            </>
          )
        }
      </Label>
    </StyledCard>
  );
};
