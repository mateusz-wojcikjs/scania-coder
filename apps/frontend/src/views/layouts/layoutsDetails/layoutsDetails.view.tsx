import { Layout } from "../../../interfaces";
import { useTitle } from "../../../hooks";
import { TransProps, useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getLayoutDetails } from "../../../api";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Loader, LayoutEditForm } from "../../../components";

export const LayoutsDetails = (): JSX.Element => {
  const { id } = useParams();
  const { t }: TransProps<never> = useTranslation();
  const layoutId = Number(id);

  const { data, isLoading, error }: UseQueryResult<Layout, Error> = useQuery({
    queryKey: ["layout", id],
    queryFn: () => getLayoutDetails(layoutId),
    enabled: !Number.isNaN(layoutId),
  });

  useTitle(t("sc.fe.views.layoutsDetails.title"));

  if (Number.isNaN(layoutId)) {
    return <div>{t("sc.fe.views.layoutsDetails.messages.invalidId")}</div>;
  }

  return (
    <div>
      {error && <div>Error: {error.message}</div>}
      {isLoading && <Loader />}
      {data && id && <LayoutEditForm key={data.id} layout={data} layoutId={layoutId} layoutRouteId={id} />}
    </div>
  );
};
