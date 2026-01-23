import { UserRole } from "@scania-coder/types";

export interface AddUserFormValues {
  username: string;
  email: string;
  role: UserRole;
}