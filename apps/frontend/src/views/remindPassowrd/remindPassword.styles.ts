import styled from "styled-components";
import { Breakpoint } from "../../enums";

export const Wrapper = styled.div`
    padding: 64px;
    background-color: ${({ theme }): string => theme.colors.white};
    border-radius: 16px;
    box-shadow: 6px 7px 9px -5px rgba(229, 229, 229, 0.41);

    @media ${Breakpoint.Mobile} {
        padding: 24px;
    }
`;

export const Heading = styled.h1`
    font-size: 20px;
    margin-bottom: 32px;
    color: ${({ theme }): string => theme.colors.primary};
    text-align: center;
`;
