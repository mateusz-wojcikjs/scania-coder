import { useNavigate, useLocation } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { UseMenuReturnType } from "./mainTemplate.types.ts";
import { MenuItem, RoutePath } from "../../../types";
import { AppstoreOutlined, ProfileOutlined, UnorderedListOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { ROUTE_PATHS } from "../../../constants";
import { TransProps, useTranslation } from "react-i18next";

export const useMenu = (): UseMenuReturnType => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);
  const { t }: TransProps<never> = useTranslation();

  const handleDrawer = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const handleMenuClick = useCallback((path: RoutePath): void => {
    navigate(path);
    setIsOpen(false);
  }, [navigate, setIsOpen]);

  const getSelectedKey = useCallback(() => {
    const path = location.pathname;
    if (path === ROUTE_PATHS.Root) return ["editor"];
    if (path === ROUTE_PATHS.Layouts) return ["list"];
    if (path === ROUTE_PATHS.Users) return ["users-list"];
    if (path === ROUTE_PATHS.UsersAdd) return ["users-add"];
    return ["editor"];
  }, [location.pathname]);

  const getOpenKeys = useCallback(() => {
    const path = location.pathname;
    const routeBasedOpenKeys: string[] = [];

    if (path === ROUTE_PATHS.Layouts) {
      routeBasedOpenKeys.push("layouts");
    }
    if (path === ROUTE_PATHS.Users || path === ROUTE_PATHS.UsersAdd) {
      routeBasedOpenKeys.push("users");
    }
    return [...new Set([...routeBasedOpenKeys, ...openSubMenus])];
  }, [location.pathname, openSubMenus]);

  const handleOpenChange = useCallback((keys: string[]) => {
    setOpenSubMenus(keys);
  }, []);

  const items: MenuItem[] = useMemo(() => [
    {
      key: "editor",
      label: t("sc.fe.menu.editor"),
      icon: <ProfileOutlined />,
      onClick: () => handleMenuClick(ROUTE_PATHS.Root),
    },
    {
      key: "layouts",
      label: t("sc.fe.menu.layouts.main"),
      icon: <AppstoreOutlined />,
      children: [
        { key: "list", label: t("sc.fe.menu.layouts.list"), icon: <UnorderedListOutlined />, onClick: () => handleMenuClick(ROUTE_PATHS.Layouts), },
      ],
    },
    {
      key: "users",
      label: t("sc.fe.menu.users.main"),
      icon: <UserOutlined />,
      children: [
        { key: "users-list", label: t("sc.fe.menu.users.list"), icon: <UnorderedListOutlined />, onClick: () => handleMenuClick(ROUTE_PATHS.Users), },
        { key: "users-add", label: t("sc.fe.menu.users.add"), icon: <UserAddOutlined />, onClick: () => handleMenuClick(ROUTE_PATHS.UsersAdd), },
      ],
    },
  ], [handleMenuClick, t]);

  const handleLogout: () => void = useCallback((): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authJwtToken");
    }
    handleMenuClick(ROUTE_PATHS.Login);
  }, [handleMenuClick]);

  return {
    handleLogout,
    items,
    handleDrawer,
    isOpen,
    selectedKeys: getSelectedKey(),
    openKeys: getOpenKeys(),
    onOpenChange: handleOpenChange,
  };
};
