import { Button, Checkbox, Form, Input, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { FC, useEffect, useState } from "react";
import { TransProps, useTranslation } from "react-i18next";
import { EditFileFormProps } from "./editFileForm.types.ts";
import { UpdatePayload } from "@scania-coder/types";
import { FormRow, IconWrapper, StyledButton, StyledFormItem } from "./editFileForm.styles.ts";
import { LayoutItemData } from "../../../types";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useFileEditor } from "../../../hooks";

export const EditFileForm: FC<EditFileFormProps> = (props: EditFileFormProps): JSX.Element => {
  const { editXmlMutation, saveLayoutMutation, onCheckToRemove } = useFileEditor();
  const { blobFile, file, setUrl, layoutFields, setIsLoading, newMajorVersion, setIsFieldAdded, form }: EditFileFormProps = props;
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [layoutError, setLayoutError] = useState<string | null>(null);
  const { t }: TransProps<never> = useTranslation();

  useEffect(() => {
    if (layoutFields.length) {
      form.setFieldsValue({
        updates: layoutFields.map((update: UpdatePayload): UpdatePayload => ({
          name: update.name,
          newValue: update.newValue,
          shouldBeRemoved: update.shouldBeRemoved,
        }))
      });
    }
  }, [form, layoutFields]);

  const onFinish = async (values: any) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("updates", JSON.stringify(values.updates));
    formData.append("newMajorVersion", newMajorVersion);
    if (blobFile) {
      formData.append("file", blobFile);
    }

    if (isCheckboxChecked && values.layoutName) {
      const layoutPayload: LayoutItemData = {
        layoutName: values.layoutName,
        updates: values.updates
      };

      saveLayoutMutation.mutate(layoutPayload, {
        onSuccess: () => {
          editXmlMutation.mutate(formData, {
            onSuccess: (blob: Blob) => {
              handleEditSuccess(blob);
            }
          });
        },
        onError: (err) => {
          const errorKey = `sc.api.errors.${err.response?.data?.error?.errorCode}`;
          message.error(t(errorKey, "sc.api.errors.UNKNOWN_ERROR"));
          setLayoutError(t('sc.fe.forms.validation.changeName'));
          setIsLoading(false);
        }
      });
    } else {
      editXmlMutation.mutate(formData, {
        onSuccess: (blob: Blob) => {
          handleEditSuccess(blob);
        },
        onError: () => {
          message.error(t('sc.fe.steps.edit.error'));
          setIsLoading(false);
        }
      });
    }
  };

  const handleEditSuccess = (blob: Blob) => {
    const url = window.URL.createObjectURL(blob);
    setUrl(url);
    setIsLoading(false);
    message.success(t("sc.fe.alerts.editSuccessfulName", { name: file?.name }));
  };

  const handleLayoutNameChange = () => {
    if (layoutError) {
      setLayoutError(null);
    }
  };

  return (
    <Form
      name="dynamic_form_nest_item"
      onFinish={onFinish}
      autoComplete="off"
      disabled={!file}
      form={form}
    >
      <Form.List name="updates">
        {(fields, { add, remove }): JSX.Element => {
          setIsFieldAdded(!!fields.length);
          return (
            <>
              {fields.map(({ key, name, ...restField }): JSX.Element => (
                <FormRow key={key}>
                  <StyledFormItem
                    {...restField}
                    name={[name, "name"]}
                    rules={[ { required: true, message: t("sc.fe.forms.validation.name") } ]}
                  >
                    <Input placeholder={t("sc.fe.forms.inputName")} />
                  </StyledFormItem>
                  <Form.Item
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.updates?.[name]?.shouldBeRemoved !==
                      currentValues.updates?.[name]?.shouldBeRemoved
                    }
                    noStyle
                  >
                    {({ getFieldValue }) => {
                      const shouldBeRemoved = getFieldValue(["updates", name, "shouldBeRemoved"]);
                      return (
                        <StyledFormItem
                          {...restField}
                          name={[name, "newValue"]}
                          rules={[ { required: !shouldBeRemoved,message: t("sc.fe.forms.validation.value") } ]}
                        >
                          <Input placeholder={t("sc.fe.forms.inputValue")} disabled={shouldBeRemoved} />
                        </StyledFormItem>
                      );
                    }}
                  </Form.Item>
                  <StyledFormItem {...restField} name={[name, "shouldBeRemoved"]} valuePropName="checked">
                    <Checkbox onChange={(e: CheckboxChangeEvent): void => onCheckToRemove(e, name)}>
                      {t("sc.fe.steps.edit.labels.checkToRemove")}
                    </Checkbox>
                  </StyledFormItem>
                  <IconWrapper>
                    <MinusCircleOutlined onClick={(): void => remove(name)} />
                  </IconWrapper>
                </FormRow>
              ))}
              <Form.Item>
                <StyledButton type="dashed" onClick={(): void => add()} icon={<PlusOutlined />}>
                  {t("sc.fe.forms.addFields")}
                </StyledButton>
              </Form.Item>
            </>
          );
        }}
      </Form.List>
      <Form.Item>
        <Checkbox onChange={(e: CheckboxChangeEvent): void => setIsCheckboxChecked(e.target.checked)}>
          {t("sc.fe.forms.saveConfig")}
        </Checkbox>
      </Form.Item>
      {isCheckboxChecked && (
        <Form.Item
          name="layoutName"
          label={t("sc.fe.steps.edit.labels.layoutName")}
          rules={[{ required: true, message: t("sc.fe.steps.edit.messages.layoutNameRequired") }]}
          validateStatus={layoutError ? "error" : ""}
          help={layoutError}
        >
          <Input placeholder={t("sc.fe.steps.edit.labels.layoutName")} onChange={handleLayoutNameChange} />
        </Form.Item>
      )}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {t("sc.fe.forms.submit")}
        </Button>
      </Form.Item>
    </Form>
  );
};
