import { FC } from "react";
import { Tooltip } from "antd/lib";
import { InfoCircleOutlined } from "@ant-design/icons";
import { TransProps, useTranslation } from "react-i18next";
import { theme } from "../../../../../theme/theme.ts";
import { FormHeaderProps } from "./formHeader.types.ts";
import { Header, FormHeaderCell, Label } from "./formHeader.styles.ts";

export const FormHeader: FC<FormHeaderProps> = (props: FormHeaderProps): JSX.Element => {
  const { isCableList }: FormHeaderProps = props;
  const { t }: TransProps<never> = useTranslation();

  if (isCableList) {
    return (
      <Header>
        <FormHeaderCell style={{ flex: 1 }}>
          <Label>{t("sc.fe.steps.edit.labels.value")}</Label>
        </FormHeaderCell>
        <FormHeaderCell style={{ flex: 1 }}>
          <Label>{t("sc.fe.steps.edit.labels.newValue")}</Label>
          <Tooltip title={t("sc.fe.steps.edit.tooltips.newValue")}>
            <InfoCircleOutlined style={{ color: theme.colors.primary }} />
          </Tooltip>
        </FormHeaderCell>
        <FormHeaderCell style={{ flex: 1 }}>
          <Label>{t("sc.fe.steps.edit.labels.removeRow")}</Label>
        </FormHeaderCell>
        <FormHeaderCell style={{ width: 90 }}>
          <Label>{t("sc.fe.steps.edit.labels.removeFields")}</Label>
        </FormHeaderCell>
      </Header>
    );
  }

  return (
    <Header>
      <FormHeaderCell style={{ flex: 1 }}>
        <Label>{t("sc.fe.steps.edit.labels.name")}</Label>
      </FormHeaderCell>
      <FormHeaderCell style={{ flex: 1 }}>
        <Label>{t("sc.fe.steps.edit.labels.value")}</Label>
      </FormHeaderCell>
      <FormHeaderCell style={{ flex: 1 }}>
        <Label>{t("sc.fe.steps.edit.labels.removeRow")}</Label>
      </FormHeaderCell>
      <FormHeaderCell style={{ width: 90 }}>
        <Label>{t("sc.fe.steps.edit.labels.removeFields")}</Label>
      </FormHeaderCell>
    </Header>
  );
}; 