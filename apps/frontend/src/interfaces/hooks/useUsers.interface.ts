import { User } from "@scania-coder/types";

export interface UseUsers {
  users: User[];
  isLoading: boolean;
  actionLoading: boolean;
  error: Error | null;
  handleDeactivate: (user: User) => void;
  handleCancelInvitation: (user: User) => Promise<void>;
  handleResendInvitation: (user: User) => Promise<void>;
  handleDeleteUser: (user: User) => Promise<void>;
}