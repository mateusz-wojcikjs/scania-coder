import { Container, StyledButton, Heading } from "./setupPasswordForm.styles";
import { useMutation } from "@tanstack/react-query";
import { message, Form, Input } from "antd";
import { setupPassword } from "../../../api";
import { TransProps, useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { FormData } from "./setupPasswordForm.types";
import { useTitle, useAuth, useRedirect } from "../../../hooks";
import { UseAuth, UseRedirect } from "../../../interfaces";
import { RoutingPath } from "../../../enums";
import { TOKEN_EXPIRATION_TIME } from "../../../constants";
import { AxiosError } from "axios";
import { ApiError } from "@scania-coder/types";

export const SetupPasswordForm = () => {
  const { t }: TransProps<never> = useTranslation();
  const { redirect }: UseRedirect = useRedirect();
  const [searchParams] = useSearchParams();
  const { signIn }: UseAuth = useAuth();
  const token = searchParams.get("token");
  useTitle(t("sc.fe.views.setupPassword.title"));

  const setupPasswordMutation = useMutation({
    mutationFn: setupPassword,
    onSuccess: (data) => {
      message.success(t("sc.fe.alerts.password.setupSuccess"));
      signIn(data.user, data.authJwtToken, Date.now() + TOKEN_EXPIRATION_TIME);
      redirect({ targetRoute: RoutingPath.Root });
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorCode = error.response?.data?.error?.errorCode;
      
      if (errorCode === "ERR_USER_DEACTIVATED") {
        message.error(t("sc.fe.alerts.password.userDeactivated"));
      } else if (errorCode === "ERR_TOKEN_EXPIRED") {
        message.error(t("sc.fe.alerts.password.tokenExpired"));
      } else if (errorCode === "ERR_INVALID_TOKEN") {
        message.error(t("sc.fe.alerts.password.invalidToken"));
      } else {
        message.error(t("sc.fe.alerts.password.setupError"));
      }
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
