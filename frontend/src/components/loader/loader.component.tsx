import { Spin } from "antd";
import { Container } from "./loader.styles.ts";

export const Loader = () => {
  return (
      <Container>
        <Spin />
    </Container>
  )
}
