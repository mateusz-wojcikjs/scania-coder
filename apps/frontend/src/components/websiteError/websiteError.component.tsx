import { RoutingPath } from "../../enums";
import { Code, Info, Container } from "./websiteError.styled";
import { WebsiteErrorComponentProps } from "./websiteError.types";
import { FC } from "react";
import { useRedirect, useTitle } from "../../hooks";
import { Button } from "antd";
import { TransProps, useTranslation } from "react-i18next";


export const WebsiteErrorComponent: FC<WebsiteErrorComponentProps> = (props: WebsiteErrorComponentProps) => {
  const { code, info, className }: WebsiteErrorComponentProps = props;
  const { redirect } = useRedirect();
  const { t }: TransProps<never> = useTranslation();
  useTitle(t("sc.fe.views.websiteError.title"));
  return (
    <Container className={className}>
      <Code>{code}</Code>
      <Info>{info}</Info>
      <Button type="primary" onClick={() => redirect({ targetRoute: RoutingPath.Root })}>{t("sc.fe.views.websiteError.button")}</Button>
    </Container>
  );
};