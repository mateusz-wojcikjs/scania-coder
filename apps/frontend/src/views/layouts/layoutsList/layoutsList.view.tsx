import { Loader } from "../../../components";
import { message, Space } from "antd";
import { TransProps, useTranslation } from "react-i18next";
import { Popconfirm, Table, TableProps } from "antd/lib";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLayouts, deleteLayout } from "../../../api";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { ApiMutation } from "../../../types";
import { Layout, LayoutRemove, UseDate } from "../../../interfaces";
import { useTitle, useDate } from "../../../hooks";
import { useMediaQuery } from "react-responsive";
import { Breakpoint, RoutingPath } from "../../../enums";
import { Link } from "react-router-dom";

export const LayoutsList = (): JSX.Element => {
  const { t }: TransProps<never> = useTranslation();
  const queryClient = useQueryClient();
  const { formatDate }: UseDate = useDate();
  useTitle(t("sc.fe.views.layoutsList.title"));
  const isMobile: boolean = useMediaQuery({ query: Breakpoint.Mobile });
  const { isPending, data: layouts } = useQuery({ queryKey: ["layouts"], queryFn: getLayouts });
  const removeLayout: ApiMutation<LayoutRemove, number> = useMutation({
    mutationFn: deleteLayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["layouts"] });
    },
  });

  const confirm = async (layout: Layout) => {
    try {
      await removeLayout.mutateAsync(layout.id);
      message.success(t("sc.fe.alerts.layout.remove", { name: layout.name }));
    } catch (error) {
      console.error(error);
      message.error(t("sc.fe.alerts.layout.removeError"));
    }
  };

  const columns: TableProps<Layout>["columns"] = [
    {
      title: t("sc.fe.table.column.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("sc.fe.table.column.actions"),
      key: "action",
      render: (_: unknown, record: Layout): JSX.Element => (
        <Space size="middle">
          <Link to={`${RoutingPath.LayoutsDetails.replace(":id", record.id.toString())}`}>
            <FormOutlined />
          </Link>
          <Popconfirm
            title={t("sc.fe.popup.layoutRemove", { name: record.name })}
            description={t("sc.fe.popup.removeConfirm")}
            onConfirm={() => confirm(record)}
            okText={t("sc.fe.global.yes")}
            cancelText={t("sc.fe.global.no")}
            okButtonProps={{ loading: removeLayout.isPending }}
          >
            <DeleteOutlined style={{ color: "red" }} />
          </Popconfirm>
        </Space>
      ),
    },
    {
      title: t("sc.fe.table.column.createdAt"),
      key: "createdAt",
      dataIndex: "createdAt",
      render: (_: unknown, record: Layout) => formatDate(record.createdAt)
    }
  ];

  return (
    <>
      {isPending && <Loader />}
      {layouts && (
        <Table<Layout>
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={layouts}
          // TODO: apply pagination when ready
          pagination={false}
          scroll={{ x: 300 }}
          size={isMobile ? "small" : "middle"}
        />
      )}
    </>
  );
};
