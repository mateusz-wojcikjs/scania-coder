import { TransProps, useTranslation } from "react-i18next";
import { Container } from "./root.styled.ts";
import { Download, Edit, Upload } from "./components";
import { UseFileEditor } from "interfaces/hooks";
import { Loader } from "../../components";
import { useFileEditor, useTitle } from "../../hooks";
// TODO: split provider from context file
import { FileEditorProvider } from "../../contexts/fileEditor.context.tsx";

export const Root: () => JSX.Element = (): JSX.Element => {
  const { t }: TransProps<never> = useTranslation();
  useTitle(t("sc.fe.views.root.title"));
  const fileEditor: UseFileEditor = useFileEditor();

  return (
    <FileEditorProvider value={fileEditor}>
      <Container>
        {fileEditor.isLoading && <Loader />}
        <Upload />
        <Edit />
        <Download />
      </Container>
    </FileEditorProvider>
  );
};
