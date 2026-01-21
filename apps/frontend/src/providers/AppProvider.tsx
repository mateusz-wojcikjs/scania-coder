import { I18nextProvider } from "react-i18next";
import i18n from "../i18n.ts";
import { ThemeProvider } from "styled-components";
import { theme, GlobalStyle, customTheme } from "../theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { FC, PropsWithChildren } from "react";
import { AuthContextProvider } from "./authContextProvider.component.tsx";

export const AppProvider: FC<PropsWithChildren> = ({ children }): JSX.Element => {
  const queryClient: QueryClient = new QueryClient();

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>
            <ConfigProvider theme={customTheme}>
              {children}
            </ConfigProvider>
          </AuthContextProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
};
