import { TransProps, useTranslation } from "react-i18next";
import { Input, Typography } from "antd";
import { VersionCardProps } from "./versionCard.types.ts";
import { ChangeEvent, FC } from "react";
import { Label, StyledCard } from "./versionCard.styled.ts";
const { Text } = Typography;

export const VersionCard: FC<VersionCardProps> = (props): JSX.Element => {
  const { currentFileVersion, newFileVersion, setFileVersion }: VersionCardProps = props;
  const { t }: TransProps<never> = useTranslation();

  return (
    <StyledCard title={t("sc.fe.steps.upload.card.currentFile", { version: currentFileVersion })}>
      <Input
        addonBefore={t("sc.fe.steps.upload.card.majorVersion")}
        value={newFileVersion}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setFileVersion(e.target.value)}
        placeholder={t("sc.fe.steps.upload.card.inputPlaceholder")}
        maxLength={9}
        min={0}
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
