import styled, { DefaultTheme, StyledComponent } from "styled-components";
import { ThemeType } from "../../../theme/theme.ts";
import { Logo } from "../../logo/logo.component.tsx";

export const Container: StyledComponent<"div", DefaultTheme, ThemeType> = styled.div`
    display: grid;
    grid-template-columns: 1fr minmax(min-content, 53.5rem) 1fr;
    grid-template-rows: 33vh 1fr;
    min-height: 100vh;
    justify-items: center;

    .custom-form-label {
        .ant-form-item-label {
            margin-left: 12.5%;

            label {
                color: ${({ theme }) => theme.colors.black};
                font-size: ${({ theme }) => theme.fontSize.l};
                font-weight: 600;
                letter-spacing: 0.09em;
            }
        }
    }
`;

export const LoginWrapper: StyledComponent<"div", DefaultTheme, ThemeType> = styled.div`
  width: 100%;
  grid-column: 2;
`;

export const StyledLogo: StyledComponent<typeof Logo, DefaultTheme, ThemeType> = styled(Logo)`
  margin-top: 50px;
  align-self: center;
  grid-column: 2;
`;
