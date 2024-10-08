import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    html {
        box-sizing: border-box;
        font-size: 62.5%;
    }

    body, a, button {
        font-family: 'Poppins', sans-serif;
        background-color: ${({ theme }): string => theme.colors.gray100};
    }

    *, *::after, *::before {
        box-sizing: inherit;
        padding: 0;
        margin: 0;
    }
`;
