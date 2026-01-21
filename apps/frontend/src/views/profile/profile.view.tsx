import { Button, Descriptions, message, Popconfirm, Tabs } from "antd";
import { TransProps, useTranslation } from "react-i18next";
import { UseAuth, UseRedirect } from "../../interfaces";
import { useAuth, useTitle, useRedirect } from "../../hooks";
import { ChangePasswordForm } from "../../components";
import { deactivateAccount } from "../../api/requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiMutation } from "../../types";
import { RoutingPath } from "../../enums";

export const ProfileView = (): JSX.Element => {
  const { t }: TransProps<never> = useTranslation();
  const { userData }: UseAuth = useAuth();
  const queryClient = useQueryClient();
  const { redirect }: UseRedirect = useRedirect();
  useTitle(t("sc.fe.views.profile.title"));

  const deactivateAccountMutation: ApiMutation<void, void> = useMutation({
    mutationFn: deactivateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
    onError: () => {
      message.error(t("sc.fe.views.profile.deactivateAccountError"));
    },
  });

  const handleDeactivateAccount = async () => {
    await deactivateAccountMutation.mutateAsync();
    message.success(t("sc.fe.views.profile.deactivateAccountSuccess"));
    redirect({ targetRoute: RoutingPath.Login });
  };

  const items = [
    {
      key: "1",
      label: t("sc.fe.views.profile.userData"),
      children: (
        <Descriptions title={t("sc.fe.views.profile.data")}>
          <Descriptions.Item label={t("sc.fe.views.profile.username")}>{userData?.username}</Descriptions.Item>
          <Descriptions.Item label={t("sc.fe.views.profile.email")}>{userData?.email}</Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: "2",   
      label: t("sc.fe.views.profile.changePassword"),
      children: <ChangePasswordForm />,
    },
    {
      key: "3",
      label: t("sc.fe.views.profile.deactivateAccount"),
      children: (
        <Popconfirm title={t("sc.fe.views.profile.deactivateAccountConfirm")} onConfirm={() => handleDeactivateAccount()} okText={t("sc.fe.global.yes")} cancelText={t("sc.fe.global.no")}>
          <Button type="primary" loading={deactivateAccountMutation.isPending}>{t("sc.fe.views.profile.deactivateAccount")}</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Tabs defaultActiveKey="1" items={items}  />
    </>
  );
};