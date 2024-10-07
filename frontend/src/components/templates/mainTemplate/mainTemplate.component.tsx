import { FC, JSX } from "react";
import { MainTemplateProps } from "./mainTemplate.types.ts";
import { Container, Content, LogoWrapper, Main, Sidebar, StyledLogo } from "./mainTemplate.styled.ts";
import { Space } from "antd";

export const MainTemplate: FC<MainTemplateProps> = (props: MainTemplateProps): JSX.Element => {
  const { children }: MainTemplateProps = props;

  return (
    <Container>
      <Sidebar>
        <LogoWrapper>
          <StyledLogo />
        </LogoWrapper>
      </Sidebar>
      <Space />
      <Main>
        <Content>
          {children}
        </Content>
      </Main>
    </Container>
  );
};

