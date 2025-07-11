import { ReactNode } from "react";
import { MenuItem } from "../../../types";

export interface MainTemplateProps {
    children: ReactNode;
}

export interface UseMenuReturnType {
    items: MenuItem[];
    handleLogout: () => void;
    isOpen: boolean;
    handleDrawer: (isOpen: boolean) => void;
    selectedKeys: string[];
    openKeys: string[];
    onOpenChange: (keys: string[]) => void;
}
