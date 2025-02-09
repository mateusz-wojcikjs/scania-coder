import styled from "styled-components";
import { Logo } from "../../logo/logo.component.tsx";
import { Breakpoint } from "../../../enums";
import { Drawer } from "antd";

export const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: 256px 1fr;
  grid-template-rows: 90px 1fr;
  margin: 0;
  padding: 0;
`;

export const StyledLogo= styled(Logo)`
  max-height: 100%;
  max-width: 12.5rem;
  margin-top: 1rem;
`;

export const Main  = styled.main`
  grid-row: 1 /-1;
  overflow-y: auto;

  @media ${Breakpoint.Mobile} {
    grid-column: 1 /-1;
    grid-row: 2 /-1;
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

  @media ${Breakpoint.Mobile} {
    padding: 1rem;
    margin: 0 1rem;
  } 
`;

export const TopMenuWrapper = styled.div`
  display: none;
  grid-column: 1 /-1;
  grid-row: 1;
  background-color: #fff;
  height: 75px;
  padding: 10px 2.4rem;
  justify-content: space-between;
  align-items: center;
    
  @media ${Breakpoint.Mobile} {
    display: flex;
  }
`;

export const StyledDrawer: typeof Drawer= styled(Drawer)`
  display: none;
  
  @media ${Breakpoint.Mobile} {
    display: block;
  }
    
  .ant-drawer-body {
    padding: 0;
  }
`
