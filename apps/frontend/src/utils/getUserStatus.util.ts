import { User } from "@scania-coder/types";
import { UserStatus } from "../types";


export const getUserStatus: (user: User) => UserStatus = (user: User): UserStatus => {
  if (user.isInvited) {
    return "invited";
  }
  if (user.isActive) {
    return "active";
  }
  return "deactivated";
};