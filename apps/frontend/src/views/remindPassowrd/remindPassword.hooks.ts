import { useMutation } from "@tanstack/react-query";
import { remindPassword } from "../../api";
import { FormProps } from "antd";
import { ApiError, RemindPasswordData } from "@scania-coder/types";
import { useState } from "react";
import { TransProps, useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { message } from "antd";

export interface UseRemindPasswordFormReturnType {
  onFinish: FormProps<RemindPasswordData>["onFinish"];
  loading: boolean;
  successMessage: string;
}

export const useRemindPasswordForm: () => UseRemindPasswordFormReturnType = (): UseRemindPasswordFormReturnType => {
  const { t }: TransProps<never> = useTranslation();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const remindPasswordMutation = useMutation({
    mutationFn: remindPassword,
  });

  const onFinish: FormProps<RemindPasswordData>["onFinish"] = async (values: RemindPasswordData): Promise<void> => {
    const { email }: RemindPasswordData = values;
    setLoading(true);
    setSuccessMessage("");

    remindPasswordMutation.mutate(
      { email },
      {
        onSuccess: (): void => {
          setLoading(false);
          setSuccessMessage(t("sc.fe.views.remindPassword.successMessage") || "If the email exists, a password reset link has been sent.");
          message.success(t("sc.fe.views.remindPassword.successMessage") || "If the email exists, a password reset link has been sent.");
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
    successMessage,
  };
};

