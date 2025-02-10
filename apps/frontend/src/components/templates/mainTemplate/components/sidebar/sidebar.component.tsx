import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { BottomBox, Container, LogoWrapper, MenuWrapper, StyledLogo } from "./sidebar.styled.ts";
import { TransProps, useTranslation } from "react-i18next";
import { SidebarProps } from "./sidebar.types.ts";
import { FC } from "react";

export const Sidebar: FC<SidebarProps> = (props: SidebarProps): JSX.Element => {
  const { children, handleLogout }: SidebarProps = props;
  const { t }: TransProps<never> = useTranslation();

  return (
    <Container>
      <LogoWrapper>
        <StyledLogo />
      </LogoWrapper>
      <MenuWrapper>
        {children}
      </MenuWrapper>
      <BottomBox>
        <Button onClick={handleLogout} icon={<LogoutOutlined />}>
          {t("sc.fe.global.logOut")}
        </Button>
      </BottomBox>
    </Container>
  );
};
