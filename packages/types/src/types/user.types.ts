import { UserRole } from "./userRole.types";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isInvited: boolean;
  createdAt: string;
  updatedAt: string;
}