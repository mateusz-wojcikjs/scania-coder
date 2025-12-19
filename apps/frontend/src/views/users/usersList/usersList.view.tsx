import { Loader } from "../../../components";
import { useQuery, UseQueryResult, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, deactivateUser } from "../../../api";
import { PaginatedUsersResponse } from "@scania-coder/types";
import { Table, TableProps } from "antd/lib";
import { TransProps, useTranslation } from "react-i18next";
import { message, Popconfirm, Space } from "antd";
import { useTitle } from "../../../hooks";
import { ApiMutation } from "../../../types";
import { Link } from "react-router-dom";
import { FormOutlined } from "@ant-design/icons";
import { RoutingPath } from "../../../enums";

type UserListItem = PaginatedUsersResponse["users"][number];

type UserStatus = "invited" | "active" | "deactivated";

const getUserStatus = (user: UserListItem): UserStatus => {
  if (user.isInvited) {
    return "invited";
  }
  if (user.isActive) {
    return "active";
  }
  return "deactivated";
};

export const UsersList = (): JSX.Element => {
  const { isPending, data, error }: UseQueryResult<PaginatedUsersResponse, Error> = useQuery({ queryKey: ["users"], queryFn: getUsers });
  const { t }: TransProps<never> = useTranslation();
  const queryClient = useQueryClient();
  useTitle(t("sc.fe.views.usersList.title"));

  const deactivateUserMutation: ApiMutation<void, number> = useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      message.error(t("sc.fe.user.deactivateError"));
    },
  });

  const handleDeactivate = async (user: UserListItem) => {
    try {
      await deactivateUserMutation.mutateAsync(user.id);
      message.success(t("sc.fe.user.deactivateSuccess", { username: user.username }));
    } catch (error) {
      console.error(error);
    }
  };

  const columns: TableProps<UserListItem>["columns"] = [
    {
      title: t("sc.fe.table.column.username"),
      dataIndex: "username",
      key: "username",
    },
    {
      title: t("sc.fe.table.column.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("sc.fe.table.column.role"),
      dataIndex: "role",
      key: "role",
    },
    {
      title: t("sc.fe.table.column.status"),
      key: "status",
      render: (_: unknown, record: UserListItem): string => {
        const status = getUserStatus(record);
        return t(`sc.fe.user.status.${status}`);
      },
    },
    {
      title: t("sc.fe.table.column.actions"),
      key: "action",
      render: (_: unknown, record: UserListItem): JSX.Element => {
        const status = getUserStatus(record);
        const canDeactivate = status === "active";
        
        return (
          <Space size="middle">
            <Link to={`${RoutingPath.UsersDetails.replace(":id", record.id.toString())}`}>
              <FormOutlined />
            </Link>
            {canDeactivate && (
              <Popconfirm
                title={t("sc.fe.user.deactivateConfirm", { username: record.username })}
                description={t("sc.fe.popup.removeConfirm")}
                onConfirm={() => handleDeactivate(record)}
                okText={t("sc.fe.global.yes")}
                cancelText={t("sc.fe.global.no")}
                okButtonProps={{ loading: deactivateUserMutation.isPending }}
              >
                <a style={{ color: "red" }}>{t("sc.fe.user.deactivate")}</a>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      {isPending && <Loader />}
      {data && <Table<UserListItem>
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data.users}
        // TODO: apply pagination when ready
        pagination={false}
      />}
      {error && <div>{error.message}</div>}
    </>
  );
};

