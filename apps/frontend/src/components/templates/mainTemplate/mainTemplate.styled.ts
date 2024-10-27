import styled from "styled-components";
import { Logo } from "../../logo/logo.component.tsx";
import { Breakpoint } from "../../../enums";

export const Container = styled.div`
    height: 100vh;
    width: 100%;
    display: grid;
    grid-template-columns: 256px 1fr;
    grid-template-rows: 90px 1fr;
    margin: 0;
    padding: 0;
`;

export const LogoWrapper = styled.div`
  position: relative;
  height: 7rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
  padding-bottom: 16px;
`;

export const StyledLogo= styled(Logo)`
    max-height: 100%;
    max-width: 12.5rem;
    margin-top: 1rem;
`;

export const Sidebar  = styled.aside`
  background-color: #eeeeee;
  grid-row: 1 / 3;
  box-shadow: 10px 0 10px 0 rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
    
  @media ${Breakpoint.Mobile} {
      display: none;
  }
`;

export const Main  = styled.main`
  grid-row: 1 /-1;
  overflow-y: auto;

  @media ${Breakpoint.Mobile} {
      grid-column: 1 /-1;
  }
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

export const BottomBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    border-top: 1px solid ${({ theme }) => theme.colors.gray300};
    margin-bottom: 32px;
    padding-top: 32px;
`;

export const MenuWrapper = styled.nav`
  height: 100%;
`;
