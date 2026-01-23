import { User } from "@scania-coder/types";
import { Table, TableProps } from "antd/lib";
import { TransProps, useTranslation } from "react-i18next";
import { Alert, Popconfirm, Space, Tag } from "antd";
import { Link } from "react-router-dom";
import { CloseCircleFilled, DeleteOutlined, FormOutlined, StopOutlined, SyncOutlined } from "@ant-design/icons";
import { RoutingPath } from "../../../enums";
import { getUserStatus } from "../../../utils";
import { useAuth, useTitle, useUsers } from "../../../hooks";
import { Loader } from "../../../components";
import { UserStatus } from "../../../types";
import { UseAuth, UseUsers } from "../../../interfaces";
import { SemanticColors } from "../../../theme";
import { useMediaQuery } from "react-responsive";
import { Breakpoint } from "../../../enums";

export const UsersList = (): JSX.Element => {
  const { users, isLoading, actionLoading, error, handleDeactivate, handleCancelInvitation, handleResendInvitation, handleDeleteUser }: UseUsers = useUsers();
  const { userData }: UseAuth = useAuth();
  const { t }: TransProps<never> = useTranslation();
  useTitle(t("sc.fe.views.usersList.title"));
  const isMobile: boolean = useMediaQuery({ query: Breakpoint.Mobile });
  const columns: TableProps<User>["columns"] = [
    {
      title: t("sc.fe.table.column.username"),
      key: "username",
      render: (_: unknown, record: User): JSX.Element => {
        const isCurrentUser: boolean = Number(userData?.id) === record.id;

        return (
          <Space>
            <Link to={`${RoutingPath.UsersDetails.replace(":id", record.id.toString())}`}>{record.username}</Link>
            {isCurrentUser && <Tag color="blue">{t("sc.fe.user.currentUser")}</Tag>}
          </Space>
        );
      },
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
      render: (_: unknown, record: User): JSX.Element => {
        const status: UserStatus = getUserStatus(record);
        return (
          <Tag color={status === "invited" ? "blue" : status === "active" ? "green" : "red"}>
            {t(`sc.fe.user.status.${status}`)}
          </Tag>
        );
      },
    },
    {
      title: t("sc.fe.table.column.actions"),
      key: "action",
      render: (_: unknown, record: User): JSX.Element => {
        const status: UserStatus = getUserStatus(record);
        const canDeactivate: boolean = status === "active";
        const canCancelInvitation: boolean = status === "invited";
        const canResendInvitation: boolean = status === "invited";
        const canDeleteUser: boolean = status === "deactivated";
        const isCurrentUser: boolean = Number(userData?.id) === record.id;
        
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
                okButtonProps={{ loading: actionLoading }}
                disabled={isCurrentUser}

              >
                <CloseCircleFilled style={{ color: isCurrentUser ? SemanticColors.disabled : SemanticColors.danger, cursor: isCurrentUser ? "not-allowed" : "pointer" }} />
              </Popconfirm>
            )}
            {canCancelInvitation && (
              <Popconfirm
                title={t("sc.fe.user.cancelInvitationConfirm", { username: record.username })}
                description={t("sc.fe.user.cancelInvitationDescription")}
                onConfirm={() => handleCancelInvitation(record)}
                okText={t("sc.fe.global.yes")}
                cancelText={t("sc.fe.global.no")}
                okButtonProps={{ loading: actionLoading }}
              >
                <StopOutlined style={{ color: SemanticColors.danger }} />
              </Popconfirm>
            )}
            {canResendInvitation && (
              <Popconfirm
                title={t("sc.fe.user.resendInvitationConfirm", { username: record.username })}
                description={t("sc.fe.user.resendInvitationDescription")}
                onConfirm={() => handleResendInvitation(record)}
                okText={t("sc.fe.global.yes")}
                cancelText={t("sc.fe.global.no")}
                okButtonProps={{ loading: actionLoading }}
              >
                <SyncOutlined style={{ color: SemanticColors.primary }} />
              </Popconfirm>
            )}
            {canDeleteUser && (
              <Popconfirm
                title={t("sc.fe.user.deleteUserConfirm", { username: record.username })}
                description={t("sc.fe.user.deleteUserDescription")}
                onConfirm={() => handleDeleteUser(record)}
                okText={t("sc.fe.global.yes")}
                cancelText={t("sc.fe.global.no")}
                okButtonProps={{ loading: actionLoading }}
              >
                <DeleteOutlined style={{ color: SemanticColors.danger }} />
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      {isLoading && <Loader />}
      {users && <Table<User>
        columns={columns}
        rowKey={(record: User): number => record.id}
        dataSource={users}
        // TODO: apply pagination when ready
        pagination={false}
        scroll={{ x: 300 }}
        size={isMobile ? "small" : "middle"}
      />}
      {error && <Alert message={t("sc.fe.alerts.usersListError")} type="error" />}
    </>
  );
};

