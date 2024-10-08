import { FC, JSX } from "react";
import { Container, LoginWrapper, StyledLogo } from "./loginTemplate.styled.ts";
import { LoginTemplateProps } from "./loginTemplate.types.ts";

export const LoginTemplate: FC<LoginTemplateProps> = (props: LoginTemplateProps): JSX.Element => {
  const { children }: LoginTemplateProps = props;

  return (
    <Container>
      <StyledLogo />
      <LoginWrapper>{children}</LoginWrapper>
    </Container>
  );
};

