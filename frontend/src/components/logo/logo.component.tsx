import { FC, JSX } from "react";
import { LogoProps } from "./logo.types.ts";
import { LogoStyled } from "./logo.styled.ts";

export const Logo: FC<LogoProps> = (props: LogoProps): JSX.Element => {
  const { className }: LogoProps = props;
  const Logo: string = "/logo.png";

  return (
    <LogoStyled src={Logo} className={className} />
  );
};
