import { Button, Checkbox, Form, Input, message } from "antd";
import { AxiosError } from "axios";
import { FC, useState } from "react";
import { TransProps, useTranslation } from "react-i18next";
import { EditFileFormProps } from "./editFileForm.types.ts";
import { UpdatePayload } from "@scania-coder/types";
import { LayoutItemData } from "../../../types";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useFileEditorContext, useSyncLayoutFieldsToForm } from "../../../hooks";
import { LayoutUpdatesFormFields } from "./components";

interface FormValues {
  updates: UpdatePayload[];
  cableList: UpdatePayload[];
  layoutName: string;
}

export const EditFileForm: FC<EditFileFormProps> = (props: EditFileFormProps): JSX.Element => {
  const { editXmlMutation, saveLayoutMutation, onCheckToRemove } = useFileEditorContext();
  const { blobFile, file, setUrl, layoutFields, setIsLoading, newMajorVersion, form }: EditFileFormProps = props;
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [layoutError, setLayoutError] = useState<string | null>(null);
  const { t }: TransProps<never> = useTranslation();

  useSyncLayoutFieldsToForm(form, layoutFields);

  const onFinish = async (values: FormValues): Promise<void> => {
    setIsLoading(true);
    const allUpdates: UpdatePayload[] = [
      ...(values.updates || []),
      ...(values.cableList || []),
    ];

    const formData = new FormData();
    formData.append("updates", JSON.stringify(allUpdates));
    formData.append("newMajorVersion", newMajorVersion);
    if (blobFile) {
      formData.append("file", blobFile);
    }

    if (isCheckboxChecked && values.layoutName) {
      const layoutPayload: LayoutItemData = {
        layoutName: values.layoutName,
        updates: allUpdates
      };

      saveLayoutMutation.mutate(layoutPayload, {
        onSuccess: (): void => {
          editXmlMutation.mutate(formData, {
            onSuccess: (blob: Blob): void => {
              handleEditSuccess(blob);
            }
          });
        },
        onError: (err: AxiosError<{ error?: { errorCode?: string } }>) => {
          const errorKey = `sc.api.errors.${err.response?.data?.error?.errorCode}`;
          message.error(t(errorKey, "sc.api.errors.UNKNOWN_ERROR"));
          setLayoutError(t("sc.fe.forms.validation.changeName"));
          setIsLoading(false);
        }
      });
    } else {
      editXmlMutation.mutate(formData, {
        onSuccess: (blob: Blob) => {
          handleEditSuccess(blob);
        },
        onError: () => {
          message.error(t("sc.fe.steps.edit.error"));
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
      <LayoutUpdatesFormFields onCheckToRemove={onCheckToRemove} />
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
