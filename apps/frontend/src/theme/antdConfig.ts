import { ThemeConfig } from "antd";
import { theme } from "./theme";

export const customTheme: ThemeConfig = {
  token: {
    colorPrimary: theme.colors.primary,
    colorPrimaryHover: theme.colors.primary100,
  },
};
