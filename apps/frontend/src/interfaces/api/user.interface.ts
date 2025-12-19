import { PermissionScopeName, PreferredLanguage, UserStatus } from "enums";
import { User } from "@scania-coder/types";


export interface UserPermissionObject<PermissionId> {
  name: PermissionId;
  value: boolean;
}

export interface UserData extends User {
  role: PermissionScopeName;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isAdmin: boolean;
  status: UserStatus;
  preferredLanguage: PreferredLanguage;
  permissions: UserPermissionObject<PermissionScopeName>[];
}
