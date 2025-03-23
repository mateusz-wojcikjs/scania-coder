export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  authJwtToken: string;
  user: {
    email: string;
    name: string;
    isAdmin: boolean;
  }
}
