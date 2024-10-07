import styled, { DefaultTheme, StyledComponent } from "styled-components";
import { ThemeType } from "../../../theme/theme.ts";
import { Alert, Button } from "antd";

export const Container = styled.div`
    padding: 64px;
    background-color: ${({ theme }: ThemeType): string => theme.colors.white};
    border-radius: 16px;
    box-shadow: 6px 7px 9px -5px rgba(229, 229, 229, 0.41);
`;

export const StyledButton: StyledComponent<typeof Button, DefaultTheme> = styled<typeof Button>(Button)`
    background-color: ${({ theme }: ThemeType): string => theme.colors.primary};
    padding: 16px 24px;
`;

export const StyledAlertError: StyledComponent<typeof Alert, DefaultTheme> = styled<typeof Alert>(Alert)`
    margin-bottom: 24px;
    color: ${({ theme }: ThemeType): string => theme.colors.red500};
    font-weight: 600;
`;
