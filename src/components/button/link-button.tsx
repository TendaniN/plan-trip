import { Link } from "react-router-dom";

import { Button, type ButtonProps } from ".";

interface LinkButtonProps extends ButtonProps {
  to: string;
}

export const LinkButton = ({ to, ...props }: LinkButtonProps) => {
  return <Button component={Link} to={to} {...props} />;
};
