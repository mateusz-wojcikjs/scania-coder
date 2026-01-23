import { StyledLink } from "./customLink.styles";
import { FC, ReactElement } from "react";
import { CustomLinkProps } from "./customLink.types";

export const CustomLink: FC<CustomLinkProps> = (props: CustomLinkProps): ReactElement => {
  const { to, children }: CustomLinkProps = props;
  
  return (
    <StyledLink to={to}>
      {children}
    </StyledLink>
  );
};