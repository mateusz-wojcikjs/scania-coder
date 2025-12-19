import { User } from "@scania-coder/types";
import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { getUser } from "../../../api/requests";
import { Loader, MainTemplate } from "../../../components";
import { TransProps, useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useTitle } from "../../../hooks";
import { Descriptions, Divider, message, Select, Typography } from "antd";
import { updateUser } from "../../../api/requests";
import { ApiMutation } from "../../../types";

export const UserDetailsView = (): JSX.Element => {
  const { t }: TransProps<never> = useTranslation();
  const { id } = useParams();
  const { data, isLoading, error }: UseQueryResult<User, Error> = useQuery({ queryKey: ["user", id], queryFn: () => getUser(Number(id)) });
  const queryClient = useQueryClient();
  const updateUserMutation: ApiMutation<User, Partial<User>> = useMutation({
    mutationFn: (updateData: Partial<User>) => updateUser(Number(id), updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      message.success(t("sc.fe.views.usersDetails.update.success"));
    },
    onError: () => {
      message.error(t("sc.fe.views.usersDetails.update.error"));
    },
  });
  useTitle(t("sc.fe.views.usersDetails.title"));

  if (error) return <div>Error: {error.message}</div>;

  const handleRoleChange = (value: string) => {
    updateUserMutation.mutate({ role: value });
  };

  return (
    <MainTemplate>
      <Typography.Title level={1}>{t("sc.fe.views.usersDetails.title")}</Typography.Title>
      <Divider />
      {isLoading && <Loader />}
      {data && <Descriptions title="Dane">
        <Descriptions.Item label="Nazwa użytkownika">{data?.username}</Descriptions.Item>
        <Descriptions.Item label="Email">{data?.email}</Descriptions.Item>
        <Descriptions.Item label="Rola">
          <Select
            options={[{ label: "Admin", value: "admin" }, { label: "User", value: "user" }]}
            value={data?.role}
            onChange={(value) => handleRoleChange(value)}
            loading={updateUserMutation.isPending}
            disabled={updateUserMutation.isPending}
            style={{ width: "100%" }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Status">{data?.status}</Descriptions.Item>
        <Descriptions.Item label="Data utworzenia">{data?.createdAt}</Descriptions.Item>
        <Descriptions.Item label="Data aktualizacji">{data?.updatedAt}</Descriptions.Item>
      </Descriptions>}
    </MainTemplate>
  );
};