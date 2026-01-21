import { Button, Form, Input, message, Select, Space, Typography } from "antd";
import { useMutation } from "@tanstack/react-query";
import { addUser } from "../../../api/requests";
import { TransProps, useTranslation } from "react-i18next";
import { useTitle } from "../../../hooks";
import { AddUserFormValues } from "./usersAdd.types";
import { ApiMutation } from "../../../types";

export const UsersAdd = (): JSX.Element => { 
  const [form] = Form.useForm();
  const { t }: TransProps<never> = useTranslation();
  useTitle(t("sc.fe.views.usersAdd.title"));
  const addUserMutation: ApiMutation<void, AddUserFormValues> = useMutation({
    mutationFn: addUser,
    onSuccess: (_, variables: AddUserFormValues) => {
      message.success(t("sc.fe.views.usersAdd.success", { email: variables.email }));
    },
    onError: () => {
      message.error(t("sc.fe.views.usersAdd.error"));
    },
  });

  const onFinish = (values: AddUserFormValues): void => {
    addUserMutation.mutate(values);
    form.resetFields();
  };

  return (
    <>
      <Space direction="vertical" size="middle">
        <Typography.Text>{t("sc.fe.views.usersAdd.description")}</Typography.Text>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="username" label={t("sc.fe.forms.inputName")} rules={[{ required: true, message: t("sc.fe.forms.validation.name") }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label={t("sc.fe.forms.email")} rules={[{ required: true, message: t("sc.fe.forms.validation.email") }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label={t("sc.fe.views.usersAdd.form.role")} rules={[{ required: true, message: t("sc.fe.forms.validation.role") }]}>
            <Select>
              <Select.Option value="user">{t("sc.fe.views.usersAdd.role.user")}</Select.Option>
              <Select.Option value="admin">{t("sc.fe.views.usersAdd.role.admin")}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={addUserMutation.isPending}>{t("sc.fe.views.usersAdd.button")}</Button>
          </Form.Item>
        </Form>
      </Space>
    </>
  );
};

