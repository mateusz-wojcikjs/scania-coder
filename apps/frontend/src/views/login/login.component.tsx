import { useAuth, useTitle } from "../../hooks";
import { LoginForm, LoginTemplate } from "../../components";
import { UseAuth } from "../../interfaces";
import { RoutingPath } from "../../enums";
import { Navigate } from "react-router-dom";
import { TransProps, useTranslation } from "react-i18next";

export const Login: () => JSX.Element = (): JSX.Element => {
  const { t }: TransProps<never> = useTranslation();
  const { isUserLoggedIn }: UseAuth = useAuth();
  useTitle(t("sc.fe.views.login.title"));

  if (isUserLoggedIn) {
    return <Navigate to={RoutingPath.Root} />;
  }

  return (
    <LoginTemplate>
      <LoginForm />
    </LoginTemplate>
  );
};
