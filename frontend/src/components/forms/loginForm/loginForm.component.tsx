import { Form, FormProps, Input } from "antd";
import { TransProps, useTranslation } from "react-i18next";
import { Container, StyledAlertError, StyledButton } from "./loginForm.styled.ts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type FieldType = {
    email?: string;
    password?: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
export const LoginForm = () => {
  const { t }: TransProps<never> = useTranslation();
  const [loading, setLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);
    console.log("Success:", values);
    const { email, password }: FieldType = values;
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        setValidationMessage(error.error.errorCode);
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("authJwtToken", JSON.stringify({ token: data.authJwtToken }));
      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);
      console.log(err.message);
    }
  };

  return (
    <Container>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        className='custom-form-label'
      >
        <Form.Item<FieldType>
          label={t("sc.fe.forms.email")}
          name="email"
          rules={[{ required: true, message: t("sc.fe.forms.validation.email") }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
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
