import { FC } from "react";
import { Form, Input, Checkbox } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { TransProps, useTranslation } from "react-i18next";
import { FormHeader } from "../formHeader/formHeader.component";
import { FormListProps } from "./formList.types.ts";
import { FormRow, IconWrapper, StyledButton, StyledFormItem } from "./formList.styles.ts";

const EMPTY_ARRAY_LENGTH: number = 0;

export const FormList: FC<FormListProps> = (props: FormListProps): JSX.Element => {
  const { name, isCableList = false, onCheckToRemove }: FormListProps = props;
  const { t }: TransProps<never> = useTranslation();
  
  return (
    <>
      <Form.Item
        shouldUpdate={(prev, cur) => prev[name]?.length !== cur[name]?.length}
        noStyle
      >
        {({ getFieldValue }) => {
          const fields = getFieldValue(name) || [];
          return fields.length > EMPTY_ARRAY_LENGTH ? (
            <FormHeader isCableList={isCableList} />
          ) : (
            <div style={{ marginBottom: 16 }}>
              {isCableList ? (
                <span>{t("sc.fe.steps.edit.labels.editCableList")}</span>
              ) : (
                <span>{t("sc.fe.steps.edit.labels.editFPCBlock")}</span>
              )}
            </div>
          );
        }}
      </Form.Item>
      <Form.List name={name}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <FormRow key={key}>
                <StyledFormItem
                  {...restField}
                  name={[name, "name"]}
                  rules={[{ required: true, message: t("sc.fe.forms.validation.name") }]}
                >
                  <Input placeholder={t("sc.fe.forms.inputName")} />
                </StyledFormItem>
                <Form.Item
                  shouldUpdate={(prev, cur) =>
                    prev[name]?.[name]?.shouldBeRemoved !==
                      cur[name]?.[name]?.shouldBeRemoved
                  }
                  noStyle
                >
                  {({ getFieldValue }) => {
                    const shouldBeRemoved = getFieldValue([name, "shouldBeRemoved"]);
                    return (
                      <StyledFormItem
                        {...restField}
                        name={[name, "newValue"]}
                        rules={[{ required: !shouldBeRemoved, message: t("sc.fe.forms.validation.value") }]}
                      >
                        <Input 
                          placeholder={isCableList ? t("sc.fe.steps.edit.labels.newNameValue") : t("sc.fe.forms.inputValue")} 
                          disabled={shouldBeRemoved} 
                        />
                      </StyledFormItem>
                    );
                  }}
                </Form.Item>
                <StyledFormItem
                  {...restField}
                  name={[name, "shouldBeRemoved"]}
                  valuePropName="checked"
                >
                  <Checkbox onChange={(e) => onCheckToRemove(e, name)}>
                    {t("sc.fe.steps.edit.labels.checkToRemove")}
                  </Checkbox>
                </StyledFormItem>
                {isCableList && (
                  <Form.Item
                    {...restField}
                    name={[name, "blockType"]}
                    initialValue="CableList"
                    hidden
                  >
                    <Input />
                  </Form.Item>
                )}
                <IconWrapper>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </IconWrapper>
              </FormRow>
            ))}
            <Form.Item>
              <StyledButton
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
                block
              >
                {isCableList 
                  ? t("sc.fe.steps.edit.labels.addCableListFields")
                  : t("sc.fe.forms.addFields")
                }
              </StyledButton>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
}; 