import { MenuProps } from "antd/lib";
import { PermissionScopeName } from "../enums";

export type MenuItem = Required<MenuProps>["items"][number] & { permissionScope?: PermissionScopeName[] };
