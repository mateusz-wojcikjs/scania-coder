import { FC, useMemo } from "react";
import { TransProps, useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { AxiosError } from "axios";
import { UpdatePayload } from "@scania-coder/types";
import { useSyncLayoutFieldsToForm, createOnCheckToRemoveHandler } from "../../../hooks";
import { updateLayout } from "../../../api";
import { LayoutUpdatesFormFields } from "../editFileForm/components";
import { LayoutEditFormPayload, LayoutEditFormProps, LayoutEditFormValues } from "./layoutEditForm.interface";
import { Layout } from "../../../interfaces";

export const LayoutEditForm: FC<LayoutEditFormProps> = (props: LayoutEditFormProps): JSX.Element => {
  const { layout, layoutId, layoutRouteId }: LayoutEditFormProps = props;
  const { t }: TransProps<never> = useTranslation();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<LayoutEditFormValues>();

  useSyncLayoutFieldsToForm(form, layout.updates, layout.name);

  const onCheckToRemove = useMemo(() => createOnCheckToRemoveHandler(form), [form]);

  const updateMutation = useMutation({
    mutationFn: (payload: LayoutEditFormPayload): Promise<Layout> => updateLayout(layoutId, payload),
    onSuccess: () => {
      message.success(t("sc.fe.views.layoutsDetails.messages.saveSuccess"));
      queryClient.invalidateQueries({ queryKey: ["layout", layoutRouteId] });
      queryClient.invalidateQueries({ queryKey: ["layouts"] });
    },
    onError: (err: AxiosError<{ error?: { errorCode?: string } }>) => {
      const code = err.response?.data?.error?.errorCode;
      const errorKey = code ? `sc.api.errors.${code}` : "sc.api.errors.UNKNOWN_ERROR";
      message.error(t(errorKey, "sc.api.errors.UNKNOWN_ERROR"));
    },
  });

  const onFinish = (values: LayoutEditFormValues): void => {
    const allUpdates: UpdatePayload[] = [...(values.updates || []), ...(values.cableList || [])];
    updateMutation.mutate({
      name: values.layoutName,
      updates: allUpdates,
    });
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      disabled={updateMutation.isPending}
    >
      <Form.Item
        name="layoutName"
        label={t("sc.fe.views.layoutsDetails.labels.layoutName")}
        rules={[{ required: true, message: t("sc.fe.views.layoutsDetails.messages.layoutNameRequired") }]}
      >
        <Input placeholder={t("sc.fe.views.layoutsDetails.labels.layoutName")} />
      </Form.Item>
      <LayoutUpdatesFormFields onCheckToRemove={onCheckToRemove} />
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
          {t("sc.fe.views.layoutsDetails.save")}
        </Button>
      </Form.Item>
    </Form>
  );
};
