import { Loader } from "../../components";
import { message, Space, Typography } from "antd";
import { TransProps, useTranslation } from "react-i18next";
import { Popconfirm, Table, TableProps } from "antd/lib";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteLayout, getLayouts } from "../../api.ts";
import { DeleteOutlined } from "@ant-design/icons";
import { Layout } from "../../types/layout.type.ts";
const { Title } = Typography;

export const LayoutsList = () => {
  const { t }: TransProps<never> = useTranslation();
  const queryClient = useQueryClient()
  const { isPending, data: layouts } = useQuery({ queryKey: ['layouts'], queryFn: getLayouts});
  const removeLayout = useMutation({
    mutationFn: deleteLayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['layouts'] })
    },
  });

  const confirm = async (layout: Layout) => {
    removeLayout.mutate(layout.id);
    removeLayout.isSuccess && message.success(`Konfiguracja ${layout.name} została usunięta`);
    removeLayout.isError && message.error(`Błąd podczas usuwania konfiguracji.`);
  };

  const columns: TableProps<Layout>['columns'] = [
    {
      title: 'Nazwa',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Akcje',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title={`Usuń konfigurację ${record.name}`}
            description="Czy na pewno chcesz usunąć?"
            onConfirm={() => confirm(record)}
            okText="Tak"
            cancelText="Nie"
            okButtonProps={{ loading: removeLayout.isPending }}
          >
            <DeleteOutlined style={{ color: "red" }} />
          </Popconfirm>
        </Space>
      ),
    },
    {
      title: 'Data utworzenia',
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
