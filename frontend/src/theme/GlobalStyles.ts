import { createGlobalStyle, DefaultTheme, GlobalStyleComponent } from "styled-components";
import { ThemeType } from "./theme.ts";

export const GlobalStyle: GlobalStyleComponent<ThemeType, DefaultTheme> = createGlobalStyle`
    html {
        box-sizing: border-box;
        font-size: 62.5%;
    }

    body, a, button {
        font-family: 'Poppins', sans-serif;
        background-color: ${({ theme }: ThemeType): string => theme.colors.gray100};
    }

    *, *::after, *::before {
        box-sizing: inherit;
        padding: 0;
        margin: 0;
    }
`;
