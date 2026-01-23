import { Flex, Form, Input } from "antd";
import { FC, ReactElement } from "react";
import { TransProps, useTranslation } from "react-i18next";
import { Container, StyledAlertError, StyledButton, Heading } from "./loginForm.styles.ts";
import { LoginData } from "@scania-coder/types";
import { useLoginForm } from "./loginForm.hooks.ts";
import { UseLoginFormReturnType } from "./loginForm.types.ts";
import { ROUTE_PATHS } from "../../../constants";
import { CustomLink } from "../../../components";

export const LoginForm: FC = (): ReactElement => {
  const { t }: TransProps<never> = useTranslation();
  const { onFinish, loading, validationMessage }: UseLoginFormReturnType = useLoginForm();

  return (
    <Container>
      <Heading>{t("sc.fe.views.login.title")}</Heading>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        className='custom-form-label'
      >
        <Form.Item<LoginData>
          label={t("sc.fe.forms.email")}
          name="email"
          rules={[{ required: true, message: t("sc.fe.forms.validation.email") }]}
        >
          <Input/>
        </Form.Item>
        <Form.Item<LoginData>
          label={t("sc.fe.forms.password")}
          name="password"
          rules={[{ required: true, message: t("sc.fe.forms.validation.password") }]}
        >
          <Input.Password/>
        </Form.Item>
        {validationMessage && <StyledAlertError message={validationMessage} type="error" showIcon/>}
        <Form.Item>
          <Flex justify="space-between" align="center">
            <StyledButton className="login-button" type="primary" htmlType="submit" loading={loading}>
              {t("sc.fe.forms.login")}
            </StyledButton>
            <CustomLink to={ROUTE_PATHS.ForgotPassword}>{t("sc.fe.views.remindPassword.title")}</CustomLink>
          </Flex>
        </Form.Item>
      </Form>
    </Container>
  );
};
