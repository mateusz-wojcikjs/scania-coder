import { Descriptions, Tabs } from "antd";
import { TransProps, useTranslation } from "react-i18next";
import { UseAuth } from "../../interfaces";
import { useAuth } from "../../hooks";
import { ChangePasswordForm } from "../../components";

export const ProfileView = (): JSX.Element => {
  const { t }: TransProps<never> = useTranslation();
  const { userData }: UseAuth = useAuth();
  console.log(userData);

  const items = [
    {
      key: "1",
      label: t("sc.fe.views.profile.userData"),
      children: <Descriptions title={t("sc.fe.views.profile.data")}>
        <Descriptions.Item label={t("sc.fe.views.profile.username")}>{userData?.name}</Descriptions.Item>
        <Descriptions.Item label={t("sc.fe.views.profile.email")}>{userData?.email}</Descriptions.Item>
      </Descriptions>,
    },
    {
      key: "2",   
      label: t("sc.fe.views.profile.changePassword"),
      children: <ChangePasswordForm />,
    },
  ];

  return (
    <>
      <Tabs defaultActiveKey="1" items={items}  />
    </>
  );
};