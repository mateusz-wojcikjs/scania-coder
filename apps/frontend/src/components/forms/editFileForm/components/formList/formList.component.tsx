import { FC } from "react";
import { Form, Input, Checkbox } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { TransProps, useTranslation } from "react-i18next";
import { FormHeader } from "../formHeader/formHeader.component";
import { FormListProps } from "./formList.types.ts";
import { FormRow, IconWrapper, StyledButton, StyledFormItem } from "./formList.styles.ts";

const EMPTY_ARRAY_LENGTH: number = 0;
const NO_DUPLICATES: number = 0;

interface FormListItem {
  name?: string;
  newValue?: string;
  shouldBeRemoved?: boolean;
  blockType?: string;
}

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
            {fields.map(({ key, name: fieldIndex, ...restField }) => {
              const listName = name;
              return (
                <FormRow key={key}>
                  <Form.Item
                    shouldUpdate={(prev, cur) => {
                      const prevList = (prev[listName] || []) as FormListItem[];
                      const curList = (cur[listName] || []) as FormListItem[];
                      return prevList.length !== curList.length ||
                        prevList.some((item: FormListItem, idx: number) => item?.name !== curList[idx]?.name);
                    }}
                    noStyle
                  >
                    {({ getFieldValue }) => {
                      const allItems = (getFieldValue(listName) || []) as FormListItem[];
                      return (
                        <StyledFormItem
                          {...restField}
                          name={[fieldIndex, "name"]}
                          rules={[
                            { required: true, message: t("sc.fe.forms.validation.name") },
                            {
                              validator: (_rule, value) => {
                                if (!value) {
                                  return Promise.resolve();
                                }
                                const duplicateCount = allItems.filter(
                                  (item: FormListItem, idx: number) => item?.name === value && idx !== fieldIndex
                                ).length;
                                if (duplicateCount > NO_DUPLICATES) {
                                  return Promise.reject(new Error(t("sc.fe.forms.validation.nameDuplicate")));
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                          dependencies={[listName]}
                        >
                          <Input placeholder={t("sc.fe.forms.inputName")} />
                        </StyledFormItem>
                      );
                    }}
                  </Form.Item>
                  <Form.Item
                    shouldUpdate={(prev, cur) => {
                      const prevValue = prev[listName]?.[fieldIndex]?.shouldBeRemoved;
                      const curValue = cur[listName]?.[fieldIndex]?.shouldBeRemoved;
                      return prevValue !== curValue;
                    }}
                    noStyle
                  >
                    {({ getFieldValue }) => {
                      const shouldBeRemoved = getFieldValue([listName, fieldIndex, "shouldBeRemoved"]);
                      return (
                        <StyledFormItem
                          {...restField}
                          name={[fieldIndex, "newValue"]}
                          rules={[
                            {
                              message: t("sc.fe.forms.validation.value"),
                              required: !shouldBeRemoved && !isCableList,
                            },
                          ]}
                          dependencies={[[fieldIndex, "shouldBeRemoved"]]}
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
                    name={[fieldIndex, "shouldBeRemoved"]}
                    valuePropName="checked"
                  >
                    <Checkbox onChange={(e) => onCheckToRemove(e, fieldIndex)}>
                      {t("sc.fe.steps.edit.labels.checkToRemove")}
                    </Checkbox>
                  </StyledFormItem>
                  {isCableList && (
                    <Form.Item
                      {...restField}
                      name={[fieldIndex, "blockType"]}
                      initialValue="CableList"
                      hidden
                    >
                      <Input />
                    </Form.Item>
                  )}
                  <IconWrapper>
                    <MinusCircleOutlined onClick={() => remove(fieldIndex)} />
                  </IconWrapper>
                </FormRow>
              );
            })}
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