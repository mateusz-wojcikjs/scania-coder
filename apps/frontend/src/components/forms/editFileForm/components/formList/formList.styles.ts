import styled from "styled-components";
import { Button, Form } from "antd";

export const FormRow = styled.div`
  display: flex;
  padding: 8px 24px;
  gap: 12px;
  border-left: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
`;

export const FormCell = styled.div`
  max-width: 180px;
  width: 100%;
`;

export const StyledButton = styled(Button)`
  width: 100%;
  margin-top: 12px;
  max-width: 716px;
`;

export const IconWrapper = styled.div`
  max-width: 90px;
`;

export const StyledFormItem = styled(Form.Item)`
  margin-bottom: 0;
  max-width: 180px;
  width: 100%;
  flex: 1 1 100%;
`;