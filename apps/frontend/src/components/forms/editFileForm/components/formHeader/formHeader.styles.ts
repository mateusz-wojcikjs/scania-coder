import styled from "styled-components";

export const Header = styled.div`
  border-radius: 8px 8px 0 0;
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  min-height: 56px;
  margin-bottom: -1px;
  padding: 0 6px 0 24px;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 16px;
`;

export const FormHeaderCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Label = styled.span`
  font-size: 14px;
  display: block;
  color: #555;
  margin-bottom: 4px;
`; 