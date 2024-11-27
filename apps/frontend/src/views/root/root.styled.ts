import styled from "styled-components";
import { Alert } from "antd";

export const Container = styled.div`
  position: relative;
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

export const Box = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap-reverse;
`;

export const SelectWrapper = styled.div`
  .ant-select {
    width: 250px;
  }
`;

export const StyledAlert = styled(Alert)`
  margin-top: 8px;
`;

export const Label = styled.span`
  font-size: 14px;
  display: block;
  color: #555;
  margin-bottom: 4px;
`;

export const FormHeader = styled.div`
    border-radius: 8px 8px 0 0;
    border: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    min-height: 56px;
    margin-bottom: -1px;
    padding: 0 24px;
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    font-size: 16px;
    gap: 12px;
`;

export const FormHeaderCell = styled.div`
  max-width: 180px;
  width: 180px;
  min-width: 90px;
`;
