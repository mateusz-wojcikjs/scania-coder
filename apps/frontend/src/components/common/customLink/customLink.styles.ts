import styled from "styled-components";
import { Link } from "react-router-dom";

export const StyledLink = styled(Link)`
    color: ${({ theme }): string => theme.colors.primary};
    text-decoration: underline;
    background-color: transparent;
`;
