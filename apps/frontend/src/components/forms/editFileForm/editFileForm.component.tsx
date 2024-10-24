import { Button, Checkbox, Form, Input, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { FC, useEffect, useState } from "react";
import { TransProps, useTranslation } from "react-i18next";
import { EditFileFormProps } from "./editFileForm.types.ts";
import { UpdatePayload } from "@scania-coder/types";

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
          newValue: update.newValue
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
      const editXmlResponse = await fetch("/api/edit-xml", {
        method: "POST",
        body: formData,
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
                <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    rules={[{ required: true, message: t("sc.fe.forms.validation.name") }]}
                    style={{ marginBottom: 0, width: '180px' }}
                  >
                    <Input placeholder={t("sc.fe.forms.inputName")}/>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "newValue"]}
                    rules={[{ required: true, message: t("sc.fe.forms.validation.value") }]}
                    style={{ marginBottom: 0, width: '180px' }}
                  >
                    <Input placeholder={t("sc.fe.forms.inputValue")} style={{ marginBottom: 0 }}/>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)}/>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>} style={{ width: "368px"}}>
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
