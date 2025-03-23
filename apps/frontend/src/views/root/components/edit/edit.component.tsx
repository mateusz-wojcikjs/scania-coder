import { useFileEditorContext } from "../../../../contexts";
import { useTranslation } from "react-i18next";
import { Alert, Col, Divider, Row, Select, Typography } from "antd";
import { EditFileForm, VersionCard } from "../../../../components";
import {
  Box,
  Description,
  FormHeader,
  FormHeaderCell,
  InnerWrapper,
  Label,
  SelectWrapper,
  Wrapper
} from "./edit.styled.ts";
const { Title } = Typography;

export const Edit: () => JSX.Element = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    file,
    fileData,
    layouts,
    setFileVersion,
    fileVersion,
    form,
    isFieldAdded,
    setIsFieldAdded,
    blobFile,
    setFile,
    setFileData,
    setUrl,
    layoutFields,
    setIsLoading,
    url,
    onLayoutChangeMutation,
  } = useFileEditorContext();

  return (
    <>
      <Divider orientation="left">
        <Title level={3}>{t("sc.fe.steps.title.edit")}</Title>
      </Divider>
      <Wrapper>
        {!!fileData && <Description>{t("sc.fe.steps.edit.description")}</Description>}
        {!!fileData && (
          <InnerWrapper>
            <SelectWrapper>
              <Row>
                <Col>
                  <Label>{t("sc.fe.steps.edit.labels.savedLayouts")}</Label>
                </Col>
              </Row>
              <Select
                showSearch
                optionFilterProp="label"
                options={layouts}
                placeholder={t("sc.fe.steps.edit.chooseLayout")}
                onChange={(id: number) => onLayoutChangeMutation.mutate(id)}
                disabled={!file}
              />
            </SelectWrapper>
            <VersionCard
              currentFileVersion={fileData.majorVersion}
              newFileVersion={fileVersion || fileData.majorVersion}
              setFileVersion={setFileVersion}
            />
            <Box>
              <div>
                {isFieldAdded ? (
                  <FormHeader>
                    <FormHeaderCell style={{ flex: "1 1 100%" }}>
                      <Label>{t("sc.fe.steps.edit.labels.name")}</Label>
                    </FormHeaderCell>
                    <FormHeaderCell style={{ flex: "1 1 100%" }}>
                      <Label>{t("sc.fe.steps.edit.labels.value")}</Label>
                    </FormHeaderCell>
                    <FormHeaderCell style={{ flex: "1 1 100%" }}>
                      <Label>{t("sc.fe.steps.edit.labels.removeRow")}</Label>
                    </FormHeaderCell>
                    <FormHeaderCell style={{ flex: "0", maxWidth: "90px" }}>
                      <Label>{t("sc.fe.steps.edit.labels.removeFields")}</Label>
                    </FormHeaderCell>
                  </FormHeader>
                ) : (
                  <Row>
                    <Col span={12}>
                      <Label>{t("sc.fe.steps.edit.labels.create")}</Label>
                    </Col>
                  </Row>
                )}
                <EditFileForm
                  {...{
                    blobFile,
                    file,
                    setUrl,
                    layoutFields,
                    setIsLoading,
                    newMajorVersion: fileVersion || fileData.majorVersion,
                    setIsFieldAdded,
                    form,
                    setFile,
                    setFileData,
                  }}
                />
              </div>
            </Box>
          </InnerWrapper>
        )}
      </Wrapper>
      {url && <Alert message={t("sc.fe.alerts.editSuccessful")} type="success" showIcon />}
    </>
  );
};
