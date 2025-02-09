import { Typography } from "antd";
import { TransProps, useTranslation } from "react-i18next";
import { Container } from "./root.styled.ts";
import { Download, Edit, Upload } from "./components";
import { UseFileEditor } from "interfaces/hooks";
import { Loader } from "../../components";
import { useFileEditor } from "../../hooks";
// TODO: split provider from context file
import { FileEditorProvider } from "../../contexts/fileEditor.context.tsx";
const { Title } = Typography;

export const Root: () => JSX.Element = (): JSX.Element => {
  const { t }: TransProps<never> = useTranslation();
  const fileEditor: UseFileEditor = useFileEditor();

  return (
    <FileEditorProvider value={fileEditor}>
      <Container>
        {fileEditor.isLoading && <Loader />}
        <Title level={1}>{t("sc.fe.views.root.title")}</Title>
        <Upload />
        <Edit />
        <Download />
      </Container>
    </FileEditorProvider>
  );
};
