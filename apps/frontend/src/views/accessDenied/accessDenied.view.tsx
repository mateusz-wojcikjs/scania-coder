import { WebsiteErrorComponent } from "../../components";

export const AccessDeniedView = () => {
  return (
    <WebsiteErrorComponent code={403} info="Nie masz uprawnień do tej strony" />
  );
};