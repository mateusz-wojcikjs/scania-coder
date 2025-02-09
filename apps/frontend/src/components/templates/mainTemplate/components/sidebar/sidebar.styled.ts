import styled from "styled-components";
import { Breakpoint } from "../../../../../enums";
import { Logo } from "../../../../logo/logo.component.tsx";

export const Container  = styled.aside`
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
