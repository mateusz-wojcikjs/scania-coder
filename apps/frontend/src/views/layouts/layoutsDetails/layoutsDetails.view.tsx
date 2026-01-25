import { Layout } from "../../../interfaces";
import { useTitle } from "../../../hooks";
import { TransProps, useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getLayoutDetails } from "../../../api";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Button, Form, Input } from "antd";
import { Loader } from "../../../components";

export const LayoutsDetails = (): JSX.Element => {
  const { id } = useParams();
  const { t }: TransProps<never> = useTranslation();
  const { data, isLoading, error }: UseQueryResult<Layout, Error> = useQuery({ queryKey: ["layout", id], queryFn: () => getLayoutDetails(Number(id)) });
  useTitle(t("sc.fe.views.layoutsDetails.title"));

  console.log(data);
  console.log(isLoading);
  console.log(error);

  return (
    <div>
      {error && <div>Error: {error.message}</div>}
      {isLoading && <Loader />}
      {data && (
        <Form layout="vertical">
          <Form.Item name="name" label={t("sc.fe.views.layoutsDetails.labels.layoutName")} rules={[{ required: true, message: t("sc.fe.views.layoutsDetails.messages.layoutNameRequired") }]}>
            <Input placeholder={t("sc.fe.views.layoutsDetails.labels.layoutName")}  defaultValue={data.name} required />
          </Form.Item>
          {data.updates.map((update) => (
            <Form.Item key={update.name} name={update.name} label={update.name}>
              <Input placeholder={update.name} defaultValue={update.newValue} required />
            </Form.Item>
          ))}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t("sc.fe.views.layoutsDetails.save")}
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};