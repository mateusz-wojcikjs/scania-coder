import { matchPath, useLocation } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { UseMenuReturnType } from "./mainTemplate.types.ts";
import { MenuItem, RoutePath } from "../../../types/index.ts";
import { AppstoreOutlined, ProfileOutlined, UnorderedListOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { ROUTE_PATHS } from "../../../constants/index.ts";
import { TransProps, useTranslation } from "react-i18next";
import { UseAuth, UseRedirect, UseRoutingPermission } from "../../../interfaces";
import { useAuth, useRedirect, useRoutingPermission } from "../../../hooks";

export const useMenu = (): UseMenuReturnType => {
  const location = useLocation();
  const { signOut }: UseAuth = useAuth();
  const { redirect }: UseRedirect = useRedirect();
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);
  const { t }: TransProps<never> = useTranslation();
  const { isMenuItemAvailable }: UseRoutingPermission = useRoutingPermission();

  const handleDrawer = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const handleMenuClick = useCallback((path: RoutePath): void => {
    redirect({ targetRoute: path });
    setIsOpen(false);
  }, [redirect, setIsOpen]);

  const getSelectedKey = useCallback(() => {
    const path = location.pathname;
    if (path === ROUTE_PATHS.Root) return ["editor"];
    if (path === ROUTE_PATHS.Layouts) return ["list"];
    if (path === ROUTE_PATHS.Users) return ["users-list"];
    if (path === ROUTE_PATHS.UsersAdd) return ["users-add"];
    if (matchPath(ROUTE_PATHS.UsersDetails, path)?.pathname) return ["users-list"];
    if (path === ROUTE_PATHS.Root) return ["editor"];
  }, [location.pathname]);

  const getOpenKeys = useCallback(() => {
    const path = location.pathname;
    const routeBasedOpenKeys: string[] = [];

    if (path === ROUTE_PATHS.Layouts) {
      routeBasedOpenKeys.push("layouts");
    }
    if (path === ROUTE_PATHS.Users || path === ROUTE_PATHS.UsersAdd || matchPath(ROUTE_PATHS.UsersDetails, path)?.pathname) {
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
      permissionScope: ["admin"],
    },
  ], [handleMenuClick, t]);

  const handleLogout: () => void = useCallback((): void => {
    if (typeof window !== "undefined") {
      signOut();
    }
    redirect({ targetRoute: ROUTE_PATHS.Login });
  }, [redirect, signOut]);

  const filteredItems: MenuItem[] = useMemo(() => items.filter((item: MenuItem) => isMenuItemAvailable(item)), [items, isMenuItemAvailable]);

  return {
    handleLogout,
    items: filteredItems,
    handleDrawer,
    isOpen,
    selectedKeys: getSelectedKey() || [],
    openKeys: getOpenKeys(),
    onOpenChange: handleOpenChange,
  };
};
