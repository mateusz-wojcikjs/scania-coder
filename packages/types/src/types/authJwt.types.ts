export interface AuthJwt {
  userId: number;
  email: string;
  isAdmin: boolean;
  tokenVersion: number;
}