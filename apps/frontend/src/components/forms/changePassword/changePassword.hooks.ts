import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../../api";
import { FormProps } from "antd";
import { ApiError } from "@scania-coder/types";
import { useState } from "react";
import { TransProps, useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { message } from "antd";

interface ChangePasswordData {
  password: string;
  confirmPassword: string;
}

export interface UseChangePasswordFormReturnType {
  onFinish: FormProps<ChangePasswordData>["onFinish"];
  loading: boolean;
}

export const useChangePasswordForm: () => UseChangePasswordFormReturnType = (): UseChangePasswordFormReturnType => {
  const { t }: TransProps<never> = useTranslation();
  const [loading, setLoading] = useState(false);

  const changePasswordMutation = useMutation({
    mutationFn: (password: string) => changePassword(password),
  });

  const onFinish: FormProps<ChangePasswordData>["onFinish"] = async (values: ChangePasswordData): Promise<void> => {
    const { password, confirmPassword }: ChangePasswordData = values;

    if (password !== confirmPassword) {
      message.error(t("sc.fe.forms.validation.passwordMismatch") || "Passwords do not match");
      return;
    }

    setLoading(true);

    changePasswordMutation.mutate(
      password,
      {
        onSuccess: (): void => {
          setLoading(false);
          message.success(t("sc.fe.alerts.password.changeSuccess"));
        },
        onError: (error: Error): void => {
          setLoading(false);
          const axiosError = error as AxiosError<ApiError>;
          const errorMessage = axiosError.response?.data?.error?.message || t("sc.api.errors.ERR_UNKNOWN_ERROR");
          message.error(errorMessage);
        },
      }
    );
  };

  return {
    onFinish,
    loading,
  };
};
