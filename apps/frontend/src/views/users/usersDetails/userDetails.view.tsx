import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { getUser } from "../../../api/requests";
import { Loader, MainTemplate } from "../../../components";
import { TransProps, useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAuth, useDate, useTitle, useUsers } from "../../../hooks";
import { Button, Descriptions, Divider, message, Select, Space, Tag, Tooltip } from "antd";
import { updateUser } from "../../../api/requests";
import { ApiMutation, UserStatus } from "../../../types";
import { UseAuth, UseDate, UseUsers } from "../../../interfaces";
import { User, UserRole } from "@scania-coder/types";
import { getUserStatus } from "../../../utils";
export const UserDetailsView = (): JSX.Element => {
  const { t }: TransProps<never> = useTranslation();
  const { id } = useParams();
  const { formatDate }: UseDate = useDate();
  const { handleDeleteUser, handleCancelInvitation, handleResendInvitation, handleDeactivate, actionLoading }: UseUsers = useUsers();
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
  const { userData }: UseAuth = useAuth();

  // todo: add empty state and error message
  if (!data) return <div>User not found</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleRoleChange = (value: UserRole) => {
    updateUserMutation.mutate({ role: value });
  };

  const status: UserStatus = getUserStatus(data);
  const isCurrentUser: boolean = Number(userData?.id) === data?.id;
  const canDeactivate: boolean = status === "active";
  const canCancelInvitation: boolean = status === "invited";
  const canResendInvitation: boolean = status === "invited";
  const canDeleteUser: boolean = status === "deactivated";

  return (
    <MainTemplate title={"sc.fe.views.usersDetails.title"}>
      {isLoading && <Loader />}
      {data && (
        <>
          <Descriptions title={t("sc.fe.views.usersDetails.data")}>
            <Descriptions.Item label={t("sc.fe.views.usersDetails.username")}>{data?.username}</Descriptions.Item>
            <Descriptions.Item label={t("sc.fe.views.usersDetails.email")}>{data?.email}</Descriptions.Item>
            <Descriptions.Item label={t("sc.fe.views.usersDetails.role")}>
              <Tooltip title={isCurrentUser ? t("sc.fe.tooltips.currentUserRole") : null}>
                <Select
                  options={[{ label: t("sc.fe.views.usersDetails.admin"), value: "admin" }, { label: t("sc.fe.views.usersDetails.user"), value: "user" }]}
                  value={data.role}
                  onChange={(value) => handleRoleChange(value)}
                  loading={updateUserMutation.isPending}
                  disabled={updateUserMutation.isPending || isCurrentUser}
                  style={{ width: "100%" }}
                />
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label={t("sc.fe.views.usersDetails.status")}>
              <Tag color={status === "invited" ? "blue" : status === "active" ? "green" : "red"}>
                {t(`sc.fe.user.status.${status}`)}
              </Tag></Descriptions.Item>
            <Descriptions.Item label={t("sc.fe.views.usersDetails.createdAt")}>{formatDate(new Date(data?.createdAt))}</Descriptions.Item>
            <Descriptions.Item label={t("sc.fe.views.usersDetails.updatedAt")}>{formatDate(new Date(data?.updatedAt))}</Descriptions.Item>
          </Descriptions>
          <Divider />
          <Space>
            {canDeleteUser && (
              <Button type="primary" onClick={() => handleDeleteUser(data)} loading={actionLoading}>
                {t("sc.fe.user.deleteUser")}
              </Button>
            )}
            {canCancelInvitation && (
              <Button type="primary" onClick={() => handleCancelInvitation(data)} loading={actionLoading}>
                {t("sc.fe.user.cancelInvitation")}
              </Button>
            )}
            {canResendInvitation && (
              <Button type="primary" onClick={() => handleResendInvitation(data)} loading={actionLoading}>
                {t("sc.fe.user.resendInvitation")}
              </Button>
            )}
            {canDeactivate && !isCurrentUser && (
              <Button type="primary" onClick={() => handleDeactivate(data)} loading={actionLoading}>
                {t("sc.fe.user.deactivate")}
              </Button>
            )}
          </Space>
        </>
      )}
    </MainTemplate>
  );
};