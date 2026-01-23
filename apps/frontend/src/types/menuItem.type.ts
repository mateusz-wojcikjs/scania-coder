import { MenuProps } from "antd/lib";
import { UserRole } from "@scania-coder/types";

export type MenuItem = Required<MenuProps>["items"][number] & { permissionScope?: UserRole[] };
