import { PreferredLanguage, UserStatus } from "enums";
import { User, UserRole } from "@scania-coder/types";


export interface UserPermissionObject<PermissionId> {
  name: PermissionId;
  value: boolean;
}

export interface UserData extends User {
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  status: UserStatus;
  preferredLanguage: PreferredLanguage;
  permissions: UserPermissionObject<UserRole>[];
}
