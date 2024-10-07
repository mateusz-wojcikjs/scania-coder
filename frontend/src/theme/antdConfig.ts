import { ThemeConfig } from "antd";
import { theme } from "./theme.ts";

export const customTheme: ThemeConfig = {
  token: {
    colorPrimary: theme.colors.primary,
    colorPrimaryHover: theme.colors.primary100,
  },
};
