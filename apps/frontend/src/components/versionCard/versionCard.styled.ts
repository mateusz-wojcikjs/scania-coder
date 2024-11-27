import { Card } from "antd";
import styled from "styled-components";

export const StyledCard = styled(Card)`
  max-width: 716px;
  width: 100%;
`;

export const Label = styled.div`
    margin-top: 4px;
    display: flex;
    gap: 4px;
`;

export const Description = styled.p`
  font-size: 14px;
  margin-bottom: 4px;
  color: #555;
`;
