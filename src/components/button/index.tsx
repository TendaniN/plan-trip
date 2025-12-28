import {
  Button as MantineButton,
  type ButtonProps as BaseButtonProps,
} from "@mantine/core";

import { createStyles } from "@mantine/emotion";

type ButtonSize = "sm" | "md" | "lg";
type ButtonColor = "green-4" | "blue-3" | "purple-3" | "secondary-2";

export interface ButtonProps extends BaseButtonProps {
  size?: ButtonSize;
  color?: ButtonColor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: any;
  to?: string;
}

const useStyles = createStyles(
  (theme, { size, color }: { size: ButtonSize; color: ButtonColor }) => {
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
        backgroundColor: `var(--mantine-color-${color})`,
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
          backgroundColor: `var(--mantine-color-${color})`,
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
  }
);

export const Button = ({
  size = "md",
  color = "secondary-2",
  children,
  ...props
}: ButtonProps) => {
  const { classes } = useStyles({ size, color });

  return (
    <MantineButton classNames={classes} size={size} {...props}>
      {children}
    </MantineButton>
  );
};
