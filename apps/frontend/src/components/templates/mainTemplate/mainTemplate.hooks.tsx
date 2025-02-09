import { useNavigate } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { UseMenuReturnType } from "./mainTemplate.types.ts";
import { MenuItem, RoutePath } from "../../../types";
import { AppstoreOutlined, ProfileOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { ROUTE_PATHS } from "../../../constants";
import { TransProps, useTranslation } from "react-i18next";

export const useMenu = (): UseMenuReturnType => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { t }: TransProps<never> = useTranslation();

  const handleDrawer = (isOpen: boolean) => {
    setIsOpen(isOpen);
  }

  const handleMenuClick = (path: RoutePath) => {
    navigate(path);
    setIsOpen(false);
  }

  const items: MenuItem[] = useMemo(() => [
    {
      key: 'editor',
      label: t('sc.fe.menu.editor'),
      icon: <ProfileOutlined />,
      onClick: () => handleMenuClick(ROUTE_PATHS.Root),
    },
    {
      key: 'layouts',
      label: t('sc.fe.menu.layouts.main'),
      icon: <AppstoreOutlined />,
      children: [
        { key: 'list', label: t('sc.fe.menu.layouts.list'), icon: <UnorderedListOutlined />, onClick: () => handleMenuClick(ROUTE_PATHS.Layouts), },
      ],
    },
  ], [handleMenuClick]);

  const handleLogout = () => useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authJwtToken");
    }

    handleMenuClick(ROUTE_PATHS.Login);
  }, []);

  return {
    handleLogout, items, handleDrawer, isOpen,
  }
}
