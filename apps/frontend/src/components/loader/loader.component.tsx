import { Spin } from "antd";
import { Container } from "./loader.styles.ts";
import { FC, ReactElement } from "react";

export const Loader: FC = (): ReactElement => {
  return (
    <Container>
      <Spin />
    </Container>
  );
};
