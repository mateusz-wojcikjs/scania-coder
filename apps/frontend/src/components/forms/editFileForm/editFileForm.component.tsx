import { Button, Checkbox, Form, Input } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { FC, useEffect, useState } from "react";
import { TransProps, useTranslation } from "react-i18next";
import { EditFileFormProps } from "./editFileForm.types.ts";
import { UpdatePayload } from "@scania-coder/types";
import { FormRow } from "./editFileForm.styles.ts";

export const EditFileForm: FC<EditFileFormProps> = (props: EditFileFormProps): JSX.Element => {
  const { blobFile, file, setUrl, layoutFields, setIsLoading, newMajorVersion, setIsFieldAdded }: EditFileFormProps = props;
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const { t }: TransProps<never> = useTranslation();
  const [form] = Form.useForm();

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
    formData.append("newMajorVersion", newMajorVersion)
    if (blobFile) {
      formData.append("file", blobFile);
    }

    try {
      const token = localStorage.getItem('authJwtToken');
      const editXmlResponse = await fetch("/api/edit-xml", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`
        }
      });

      if (editXmlResponse.ok) {
        const xmlText = await editXmlResponse.text();
        const blob = new Blob([xmlText], { type: "application/xml" });
        setUrl(window.URL.createObjectURL(blob));
        setIsLoading(false);
      } else {
        console.error("Failed to modify XML file");
        setIsLoading(false);
      }

      if (isCheckboxChecked && values.layoutName) {
        const layoutPayload = {
          layoutName: values.layoutName,
          updates: values.updates
        };

        const layoutResponse = await fetch("/api/layouts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(token).token}`
          },
          body: JSON.stringify(layoutPayload),
        });
        setIsLoading(false);

        if (!layoutResponse.ok) {
          console.error("Failed to save layout configuration");
          setIsLoading(false);
        }
      }

    } catch (error) {
      console.error("An error occurred while submitting the form:", error);
      setIsLoading(false);
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
        {(fields, { add, remove }) => {
          setIsFieldAdded(!!fields.length);
          return (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <FormRow key={key}>
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    rules={[
                      { required: true, message: t("sc.fe.forms.validation.name") },
                    ]}
                    style={{
                      marginBottom: 0,
                      maxWidth: "180px",
                      width: "100%",
                      flex: "1 1 100%",
                    }}
                  >
                    <Input placeholder={t("sc.fe.forms.inputName")} />
                  </Form.Item>

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
                        <Form.Item
                          {...restField}
                          name={[name, "newValue"]}
                          rules={[
                            {
                              required: !shouldBeRemoved,
                              message: t("sc.fe.forms.validation.value"),
                            },
                          ]}
                          style={{
                            marginBottom: 0,
                            maxWidth: "180px",
                            width: "100%",
                            flex: "1 1 100%",
                          }}
                        >
                          <Input
                            placeholder={t("sc.fe.forms.inputValue")}
                            disabled={shouldBeRemoved}
                          />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "shouldBeRemoved"]}
                    valuePropName="checked"
                    style={{
                      marginBottom: 0,
                      maxWidth: "180px",
                      width: "100%",
                      flex: "1 1 100%",
                    }}
                  >
                    <Checkbox
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        if (isChecked) {
                          form.setFields([
                            {
                              name: ["updates", name, "newValue"],
                              value: undefined,
                            },
                          ]);
                        }
                      }}
                    >
                      Oznacz do usunięcia
                    </Checkbox>
                  </Form.Item>
                  <div style={{ width: "90px" }}>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                </FormRow>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  style={{ width: "100%", marginTop: "12px", maxWidth: "716px" }}
                >
                  {t("sc.fe.forms.addFields")}
                </Button>
              </Form.Item>
            </>
          );
        }}
      </Form.List>
      <Form.Item>
        <Checkbox
          onChange={(e) => setIsCheckboxChecked(e.target.checked)}
        >{t("sc.fe.forms.saveConfig")}
        </Checkbox>
      </Form.Item>
      {isCheckboxChecked && (
        <Form.Item
          name="layoutName"
          label='Nazwa konfiguracji'
          rules={[{ required: true, message: "Nazwa jest wymagana lub odznacz, że chcesz zapisać konfigurację" }]}
        >
          <Input placeholder='Nazwa konfiguracji' />
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
