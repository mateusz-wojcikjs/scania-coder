import { FC, JSX, useEffect } from "react";
import { MainTemplateProps, UseMenuReturnType } from "./mainTemplate.types.ts";
import {
  Container,
  Content,
  Main,
  StyledDrawer,
  StyledLogo,
  TopMenuWrapper
} from "./mainTemplate.styled.ts";
import { Button, Menu, Space } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Sidebar } from "./components";
import { useMenu } from "./mainTemplate.hooks.tsx";
import { useMediaQuery } from "react-responsive";
import { Breakpoint } from "../../../enums";

export const MainTemplate: FC<MainTemplateProps> = (props: MainTemplateProps): JSX.Element => {
  const { children }: MainTemplateProps = props;
  const { handleDrawer, items, isOpen, handleLogout }:UseMenuReturnType =  useMenu();
  const isMobile: boolean = useMediaQuery({ query: Breakpoint.Mobile });

  useEffect(() => {
    handleDrawer(false);
  }, [isMobile]);

  return (
    <Container>
      <TopMenuWrapper>
        <StyledLogo />
        <Button type="primary" onClick={() => handleDrawer(true)}>
          <MenuOutlined />
        </Button>
      </TopMenuWrapper>
      <Sidebar handleLogout={handleLogout}>
        <Menu defaultSelectedKeys={['editor']} mode="inline" items={items} />
      </Sidebar>
      <Space />
      <Main>
        <Content>
          {children}
        </Content>
      </Main>
      {isMobile && (
        <StyledDrawer onClose={() => handleDrawer(false)} open={isOpen} placement="left">
          <Menu defaultSelectedKeys={['editor']} mode="inline" items={items} />
        </StyledDrawer>
      )}
    </Container>
  );
};

