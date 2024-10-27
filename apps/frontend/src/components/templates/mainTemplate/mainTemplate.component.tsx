import { FC, JSX } from "react";
import { MainTemplateProps } from "./mainTemplate.types.ts";
import {
  BottomBox,
  Container,
  Content,
  LogoWrapper,
  Main,
  MenuWrapper,
  Sidebar,
  StyledLogo
} from "./mainTemplate.styled.ts";
import { Button, Menu, Space } from "antd";
import {
  AppstoreOutlined,
  LogoutOutlined,
  MailOutlined,
  ProfileOutlined,
  SettingOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { MenuProps } from "antd/lib";

type MenuItem = Required<MenuProps>['items'][number];

export const MainTemplate: FC<MainTemplateProps> = (props: MainTemplateProps): JSX.Element => {
  const { children }: MainTemplateProps = props;
  const navigate = useNavigate();

  const items: MenuItem[] = [
    {
      key: 'editor',
      label: 'Edytor plików',
      icon: <ProfileOutlined />,
      onClick: () => navigate('/'),
    },
    {
      key: 'layouts',
      label: 'Konfiguracje',
      icon: <AppstoreOutlined />,
      children: [
        { key: 'list', label: 'Lista Konfiguracji', icon: <UnorderedListOutlined />, onClick: () => navigate('/lista'), },
      ],
    },
  ];

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
        <MenuWrapper>
          <Menu
            defaultSelectedKeys={['editor']}
            mode="inline"
            items={items}
          />
        </MenuWrapper>
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

