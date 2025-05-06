import styled from "styled-components";

export const Box = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap-reverse;
`;

export const Description = styled.p`
  font-size: 14px;
  margin-bottom: 16px;
  color: #555;
`;

export const Wrapper = styled.div``;

export const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SelectWrapper = styled.div`
  .ant-select {
    width: 250px;
  }
`;

export const Label = styled.span`
  font-size: 14px;
  display: block;
  color: #555;
  margin-bottom: 4px;
`;
