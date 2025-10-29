export interface AuthContextState {
  user: unknown | null; // TODO: Replace with User type
  isAuthenticated: boolean;
  token: string | null;
  expiration: number | null;
}
