import { useMutation } from "@tanstack/react-query";
import { login } from "../../../api";
import { FormProps } from "antd";
import { ApiError, LoginData, LoginResponse } from "@scania-coder/types";
import { useState } from "react";
import { UseLoginFormReturnType } from "./loginForm.types.ts";
import { TransProps, useTranslation } from "react-i18next";
import { ApiMutation, UseState } from "../../../types";
import { AxiosError } from "axios";
import { useAuth, useRedirect } from "../../../hooks";
import { UseAuth, UseRedirect } from "../../../interfaces";
import { RoutingPath } from "../../../enums";
import { TOKEN_EXPIRATION_TIME } from "../../../constants";

export const useLoginForm: () => UseLoginFormReturnType = (): UseLoginFormReturnType => {
  const UNAUTHORIZED_STATUS_CODE: number = 401;
  const { t }: TransProps<never> = useTranslation();
  const { redirect }: UseRedirect = useRedirect();
  const [loading, setLoading]: UseState<boolean> = useState(false);
  const [validationMessage, setValidationMessage]: UseState<string> = useState("");
  const { signIn }: UseAuth = useAuth();

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
          signIn(data.user, data.authJwtToken, Date.now() + TOKEN_EXPIRATION_TIME);
          setLoading(false);
          redirect({ targetRoute: RoutingPath.Root });
        },
        onError: (error: AxiosError<ApiError>): void => {
          const statusCode = error.response?.data?.error.statusCode;
          switch (statusCode) {
          case UNAUTHORIZED_STATUS_CODE:
            setValidationMessage(t("sc.api.errors.ERR_INVALID_CREDENTIALS"));
            break;
          default:
            setValidationMessage(t("sc.api.errors.ERR_UNKNOWN_ERROR"));
            break;
          }
          if (statusCode === UNAUTHORIZED_STATUS_CODE) {
            setValidationMessage(t("sc.api.errors.ERR_INVALID_CREDENTIALS"));
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
  };
};
