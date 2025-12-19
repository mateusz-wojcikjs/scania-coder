import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 100px;
`;

export const Code = styled.h1`
  font-size: 8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Info = styled.p`
  font-size: 1.6rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.primary};
`;