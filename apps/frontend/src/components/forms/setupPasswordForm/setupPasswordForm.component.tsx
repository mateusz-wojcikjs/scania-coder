import { Container, StyledButton, Heading } from "./setupPasswordForm.styles";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { Form, Input } from "antd";
import { setupPassword } from "../../../api";
import { TransProps, useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FormData } from "./setupPasswordForm.types";

export const SetupPasswordForm = () => {
  const { t }: TransProps<never> = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const setupPasswordMutation = useMutation({
    mutationFn: setupPassword,
    onSuccess: (data) => {
      message.success(t("sc.fe.alerts.password.setupSuccess"));
      // Auto-login after successful password setup
      localStorage.setItem("authJwtToken", JSON.stringify({ token: data.authJwtToken }));
      navigate("/");
    },
    onError: () => {
      message.error(t("sc.fe.alerts.password.setupError"));
    },
  });

  const onFinish = (values: FormData) => {
    if (values.password !== values.confirmPassword) {
      message.error(t("sc.fe.forms.validation.passwordMismatch"));
      return;
    }

    if (!token) {
      message.error(t("sc.fe.alerts.password.invalidToken"));
      return;
    }

    setupPasswordMutation.mutate({ token, password: values.password });
  };

  return (
    <Container>
      <Heading>{t("sc.fe.views.setupPassword.title")}</Heading>
      <Form
        name="setupPassword"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label={t("sc.fe.forms.newPassword")}
          name="password"
          rules={[
            { required: true, message: t("sc.fe.forms.validation.password") },
            { min: 8, message: t("sc.fe.forms.validation.passwordLength") }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label={t("sc.fe.forms.confirmPassword")}
          name="confirmPassword"
          rules={[
            { required: true, message: t("sc.fe.forms.validation.confirmPassword") }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <StyledButton
            type="primary"
            htmlType="submit"
            loading={setupPasswordMutation.isPending}
          >
            {t("sc.fe.forms.setupPassword")}
          </StyledButton>
        </Form.Item>
      </Form>
    </Container>
  );
};
