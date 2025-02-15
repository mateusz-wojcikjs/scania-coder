import { Form, Input } from "antd";
import { ReactElement } from "react";
import { TransProps, useTranslation } from "react-i18next";
import { Container, StyledAlertError, StyledButton } from "./loginForm.styled.ts";
import { LoginData } from "@scania-coder/types";
import { useLoginForm } from "./loginForm.hooks.tsx";
import { UseLoginFormReturnType } from "./loginForm.types.ts";

export const LoginForm: () => ReactElement = (): ReactElement => {
  const { t }: TransProps<never> = useTranslation();
  const { onFinish, loading, validationMessage }: UseLoginFormReturnType = useLoginForm();

  return (
    <Container>
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
          <Input />
        </Form.Item>
        <Form.Item<LoginData>
          label={t("sc.fe.forms.password")}
          name="password"
          rules={[{ required: true, message: t("sc.fe.forms.validation.password") }]}
        >
          <Input.Password />
        </Form.Item>
        {validationMessage && <StyledAlertError message={validationMessage} type="error" showIcon />}
        <Form.Item>
          <StyledButton className="login-button" type="primary" htmlType="submit" loading={loading}>
            {t("sc.fe.forms.login")}
          </StyledButton>
        </Form.Item>
      </Form>
    </Container>
  );
};
