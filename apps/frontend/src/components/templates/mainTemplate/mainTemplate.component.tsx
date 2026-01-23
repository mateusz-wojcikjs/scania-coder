import { FC, JSX, useEffect } from "react";
import { MainTemplateProps, UseMenuReturnType } from "./mainTemplate.types.ts";
import {
  Container,
  Content,
  Main,
  StyledDrawer,
  StyledLogo,
  TopMenuWrapper,
  Header,
  ProfileButton,
  ProfileName,
  Title,
  ProfileWrapper
} from "./mainTemplate.styled.ts";
import { Button, Menu, Space } from "antd";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Sidebar } from "./components";
import { useMenu } from "./mainTemplate.hooks.tsx";
import { useMediaQuery } from "react-responsive";
import { Breakpoint } from "../../../enums";
import { UseAuth, UseRedirect } from "../../../interfaces/hooks";
import { useAuth, useRedirect } from "../../../hooks";
import { TransProps, useTranslation } from "react-i18next";
import { ROUTE_PATHS } from "../../../constants";

export const MainTemplate: FC<MainTemplateProps> = (props: MainTemplateProps): JSX.Element => {
  const { children, title }: MainTemplateProps = props;
  const { handleDrawer, items, isOpen, handleLogout, selectedKeys, openKeys, onOpenChange }: UseMenuReturnType = useMenu();
  const { t }: TransProps<never> = useTranslation();
  const isMobile: boolean = useMediaQuery({ query: Breakpoint.Mobile });
  const { userData }: UseAuth = useAuth();
  const { redirect }: UseRedirect = useRedirect();

  useEffect((): void => {
    handleDrawer(false);
  }, [isMobile, handleDrawer]);

  return (
    <Container>
      <Header>
        {!!title && <Title>{t(title as never)}</Title>}
        <ProfileWrapper>
          <ProfileName>
            {t("sc.fe.mainTemplate.welcome", { name: userData?.username })}
          </ProfileName>
          <ProfileButton onClick={() => redirect({ targetRoute: ROUTE_PATHS.Profile })}>
            <UserOutlined style={{ color: "white", fontSize: "20px" }} />
          </ProfileButton>
        </ProfileWrapper>
      </Header>
      <TopMenuWrapper>
        <StyledLogo />
        <Button type="primary" onClick={() => handleDrawer(true)}>
          <MenuOutlined />
        </Button>
      </TopMenuWrapper>
      <Sidebar handleLogout={handleLogout}>
        <Menu selectedKeys={selectedKeys} openKeys={openKeys} onOpenChange={onOpenChange} mode="inline" items={items} />
      </Sidebar>
      <Space />
      <Main>
        <Content>
          {children}
        </Content>
      </Main>
      {isMobile && (
        <StyledDrawer onClose={() => handleDrawer(false)} open={isOpen} placement="left">
          <Menu selectedKeys={selectedKeys} openKeys={openKeys} onOpenChange={onOpenChange} mode="inline" items={items} />
        </StyledDrawer>
      )}
    </Container>
  );
};

