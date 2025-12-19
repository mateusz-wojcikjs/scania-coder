import { User } from "@scania-coder/types";

export interface UseAuth {
  signIn: (userData: User, token: string, expiration: number) => void;
  signOut: () => void;
  signOutCleanup: () => void;
  isUserLoggedIn: boolean;
  token: string | null;
  expiration: number | null;
  userData: User | null;
}