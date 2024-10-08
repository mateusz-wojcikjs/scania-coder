import styled from "styled-components";
import { Alert, Button } from "antd";

export const Container = styled.div`
    padding: 64px;
    background-color: ${({ theme }): string => theme.colors.white};
    border-radius: 16px;
    box-shadow: 6px 7px 9px -5px rgba(229, 229, 229, 0.41);
`;

export const StyledButton = styled(Button)`
    background-color: ${({ theme }): string => theme.colors.primary};
    padding: 16px 24px;
`;

export const StyledAlertError = styled(Alert)`
    margin-bottom: 24px;
    color: ${({ theme }): string => theme.colors.red500};
    font-weight: 600;
`;
