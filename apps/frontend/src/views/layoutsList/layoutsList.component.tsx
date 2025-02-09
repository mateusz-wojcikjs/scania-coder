import { Loader } from "../../components";
import { message, Space, Typography } from "antd";
import { TransProps, useTranslation } from "react-i18next";
import { Popconfirm, Table, TableProps } from "antd/lib";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLayouts, deleteLayout } from "../../api";
import { DeleteOutlined } from "@ant-design/icons";
import { ApiMutation } from "../../types";
import { Layout, LayoutRemove } from "../../interfaces";
const { Title } = Typography;

export const LayoutsList = (): JSX.Element => {
  const { t }: TransProps<never> = useTranslation();
  const queryClient = useQueryClient()
  const { isPending, data: layouts } = useQuery({ queryKey: ['layouts'], queryFn: getLayouts});
  const removeLayout: ApiMutation<LayoutRemove, number> = useMutation({
    mutationFn: deleteLayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['layouts'] })
    },
  });

  const confirm = async (layout: Layout) => {
    removeLayout.mutate(layout.id);
    removeLayout.isSuccess && message.success(t('sc.fe.alerts.layout.remove', { name: layout.name }));
    removeLayout.isError && message.error(t('sc.fe.alerts.layout.removeError'));
  };

  const columns: TableProps<Layout>['columns'] = [
    {
      title: t('sc.fe.table.column.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('sc.fe.table.column.actions'),
      key: 'action',
      render: (_: unknown, record: Layout): JSX.Element => (
        <Space size="middle">
          <Popconfirm
            title={t('sc.fe.popup.layoutRemove', { name: record.name })}
            description={t('sc.fe.popup.removeConfirm')}
            onConfirm={() => confirm(record)}
            okText={t('sc.fe.global.yes')}
            cancelText={t('sc.fe.global.no')}
            okButtonProps={{ loading: removeLayout.isPending }}
          >
            <DeleteOutlined style={{ color: "red" }} />
          </Popconfirm>
        </Space>
      ),
    },
    {
      title: t('sc.fe.table.column.createdAt'),
      key: 'createdAt',
      dataIndex: 'createdAt',
    }
  ];

  return (
    <>
      {isPending && <Loader />}
      <Title level={1}>{t("sc.fe.views.layoutsList.title")}</Title>
      {layouts && <Table<Layout>
          columns={columns}
          dataSource={layouts}
          // TODO: apply pagination when ready
          pagination={false}
      />}
    </>
  )
}
