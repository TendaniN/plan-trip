import {
  Button as MantineButton,
  type ButtonProps as BaseButtonProps,
} from "@mantine/core";

import { createStyles } from "@mantine/emotion";

type ButtonSize = "sm" | "md" | "lg";
type ButtonColor = "green.4" | "blue.3" | "purple.3" | "secondary.2" | "red.6";

export interface ButtonProps extends BaseButtonProps {
  size?: ButtonSize;
  color?: ButtonColor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: any;
  to?: string;
  type?: "button" | "reset" | "submit";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const useStyles = createStyles((theme, { size }: { size: ButtonSize }) => {
  const sizes = {
    sm: {
      height: 36,
      padding: "0 14px",
      fontSize: theme.fontSizes.sm,
    },
    md: {
      height: 44,
      padding: "0 18px",
      fontSize: theme.fontSizes.md,
    },
    lg: {
      height: 52,
      padding: "0 22px",
      fontSize: theme.fontSizes.lg,
    },
  };

  return {
    root: {
      border: "2px solid #000",
      color: "#000",
      borderRadius: 12,
      fontFamily: "Inter, system-ui, sans-serif",
      fontWeight: 500,
      ...sizes[size],

      "&:disabled": {
        opacity: 0.5,
      },
      ":hover": {
        color: "#000",
      },

      "& span": {
        display: "flex",
        gap: "0.5rem",
      },
    },

    inner: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
  };
});

export const Button = ({
  size = "md",
  color = "secondary.2",
  children,
  type = "button",
  ...props
}: ButtonProps) => {
  const { classes } = useStyles({ size });

  return (
    <MantineButton
      type={type}
      classNames={classes}
      bg={color}
      size={size}
      {...props}
    >
      {children}
    </MantineButton>
  );
};
