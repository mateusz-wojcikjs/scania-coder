import { FC, JSX } from "react";
import { Container, LoginWrapper, LogoWrapper } from "./loginTemplate.styled.ts";
import { LoginTemplateProps } from "./loginTemplate.types.ts";
import { CustomLink, Logo } from "../../../components";
import { ROUTE_PATHS } from "../../../constants";

export const LoginTemplate: FC<LoginTemplateProps> = (props: LoginTemplateProps): JSX.Element => {
  const { children, withLoginLink }: LoginTemplateProps = props;

  return (
    <Container>
      <LogoWrapper>
        {withLoginLink ? (
          <CustomLink to={ROUTE_PATHS.Login}>
            <Logo />
          </CustomLink>
        ) : (
          <Logo />
        )}
      </LogoWrapper>
      <LoginWrapper>{children}</LoginWrapper>
    </Container>
  );
};

