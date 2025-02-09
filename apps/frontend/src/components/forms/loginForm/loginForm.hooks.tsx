import { NavigateFunction, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../../api";
import { FormProps } from "antd";
import { ApiError, LoginData, LoginResponse } from "@scania-coder/types";
import { useState } from "react";
import { UseLoginFormReturnType } from "./loginForm.types.ts";
import { TransProps, useTranslation } from "react-i18next";
import { ApiMutation, UseState } from "../../../types";
import { AxiosError } from "axios";

export const useLoginForm: () => UseLoginFormReturnType = (): UseLoginFormReturnType => {
  const { t }: TransProps<never> = useTranslation();
  const navigate: NavigateFunction  = useNavigate();
  const [loading, setLoading]: UseState<boolean> = useState(false);
  const [validationMessage, setValidationMessage]: UseState<string> = useState("");

  const loginMutation: ApiMutation<LoginResponse, LoginData> = useMutation({
    mutationFn: login,
  });

  const onFinish: FormProps<LoginData>["onFinish"] = async (values: LoginData): Promise<void> => {
    const { email, password }: LoginData = values;
    setLoading(true);

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data: LoginResponse): void => {
          localStorage.setItem("authJwtToken", JSON.stringify({ token: data.authJwtToken }));
          setLoading(false);
          navigate("/");
        },
        onError: (error: AxiosError<ApiError>): void => {
          const statusCode = error.response?.data?.error.statusCode;
          if (statusCode === 401) {
            setValidationMessage(t('sc.api.errors.ERR_INVALID_CREDENTIALS'))
          }
          setLoading(false);
        },
      }
    );
  };

  return {
    onFinish,
    loading,
    validationMessage,
  }
}
