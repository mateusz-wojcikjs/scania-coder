import { Button, Form, Input } from "antd";
import { TransProps, useTranslation } from "react-i18next";
import { useChangePasswordForm } from "./changePassword.hooks";

interface ChangePasswordData {
    password: string;
    confirmPassword: string;
}

export const ChangePasswordForm = (): JSX.Element => {
  const { t }: TransProps<never> = useTranslation();
  const { onFinish, loading } = useChangePasswordForm();
    
  return (
    <Form
      name="changePassword"
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item<ChangePasswordData>
        label={t("sc.fe.forms.newPassword")}
        name="password"
        rules={[{ required: true, message: t("sc.fe.forms.validation.password") }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item<ChangePasswordData>
        label={t("sc.fe.forms.confirmPassword")}
        name="confirmPassword"
        rules={[{ required: true, message: t("sc.fe.forms.validation.confirmPassword") }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {t("sc.fe.forms.changePassword.submit")}
        </Button>
      </Form.Item>
    </Form>
  );
};