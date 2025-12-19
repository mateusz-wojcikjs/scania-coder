import { ReactElement } from "react";
import { CustomLink, LoginTemplate } from "../../components";
import { useTitle } from "../../hooks";
import { TransProps, useTranslation } from "react-i18next";
import { Button, Form, Input, Alert, Flex } from "antd";
import { RemindPasswordData } from "@scania-coder/types";
import { useRemindPasswordForm } from "./remindPassword.hooks";
import { Heading, Wrapper } from "./remindPassword.styles";
import { ROUTE_PATHS } from "../../constants";

export const RemindPassword: () => ReactElement = (): ReactElement => {
  const { t }: TransProps<never> = useTranslation();
  useTitle(t("sc.fe.views.remindPassword.title"));
  const { onFinish, loading, successMessage } = useRemindPasswordForm();

  return (
    <LoginTemplate withLoginLink>
      <Wrapper>
        <Heading>{t("sc.fe.views.remindPassword.helperText")}</Heading>
        <Form
          name="remindPassword"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item<RemindPasswordData>
            label={t("sc.fe.forms.email")}
            name="email"
            rules={[{ required: true, message: t("sc.fe.forms.validation.email") }, { type: "email", message: t("sc.fe.forms.validation.email") }]}
          >
            <Input />
          </Form.Item>
          {successMessage && <Alert message={successMessage} type="success" showIcon style={{ marginBottom: 16 }} />}
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Button type="primary" htmlType="submit" loading={loading}>
                {t("sc.fe.forms.send")}
              </Button>
              <CustomLink to={ROUTE_PATHS.Login}>{t("sc.fe.views.remindPassword.button")}</CustomLink>
            </Flex>
          </Form.Item>
        </Form>
      </Wrapper>
    </LoginTemplate>
  );
};
