import { FC, JSX } from "react";
import { MainTemplateProps } from "./mainTemplate.types.ts";
import { BottomBox, Container, Content, LogoWrapper, Main, Sidebar, StyledLogo } from "./mainTemplate.styled.ts";
import { Button, Space } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export const MainTemplate: FC<MainTemplateProps> = (props: MainTemplateProps): JSX.Element => {
  const { children }: MainTemplateProps = props;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authJwtToken");
    navigate("/login");
  };

  return (
    <Container>
      <Sidebar>
        <LogoWrapper>
          <StyledLogo />
        </LogoWrapper>
        <BottomBox>
          <Button onClick={handleLogout} icon={<LogoutOutlined />}>
            Wyloguj się
          </Button>
        </BottomBox>
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

