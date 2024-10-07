import styled, { DefaultTheme, StyledComponent } from "styled-components";
import { ThemeType } from "../../../theme/theme.ts";
import { Logo } from "../../logo/logo.component.tsx";

export const Container: StyledComponent<"div", DefaultTheme, ThemeType> = styled.div`
    height: 100vh;
    width: 100%;
    display: grid;
    grid-template-columns: 256px 1fr;
    grid-template-rows: 90px 1fr;
    margin: 0;
    padding: 0;
`;

export const LogoWrapper: StyledComponent<"div", DefaultTheme, ThemeType> = styled.div`
  position: relative;
  height: 7rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledLogo: StyledComponent<typeof Logo, DefaultTheme, ThemeType> = styled(Logo)`
    max-height: 100%;
    max-width: 12.5rem;
    margin-top: 1rem;
`;

export const Sidebar: StyledComponent<"aside", DefaultTheme, ThemeType>  = styled.aside`
  background-color: #eeeeee;
  grid-row: 1 / 3;
  box-shadow: 10px 0 10px 0 rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
`;

export const Main: StyledComponent<"main", DefaultTheme, ThemeType>  = styled.main`
  grid-row: 1 /-1;
  overflow-y: auto;
`;

export const Content = styled.section`
  padding: 2.4rem;
  margin: 2.4rem;
  min-height: 50rem;
  max-width: 140rem;
  background-color: ${({ theme }) => theme.colors.white};
    border-radius: 16px;
    box-shadow: 5px 0 51px 0 rgba(0, 0, 0, 0.05);
`;
