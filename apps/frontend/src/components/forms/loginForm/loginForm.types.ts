import { LoginData } from "@scania-coder/types";

export interface UseLoginFormReturnType {
  onFinish: (values: LoginData) => void;
  loading: boolean;
  validationMessage: string;
}
