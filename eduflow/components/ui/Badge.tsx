import * as React from "react";
import clsx from "clsx";

type BadgeVariant = "solid" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "solid",
  className,
  ...rest
}) => {
  return (
    <span
      className={clsx(
        "pill",
        variant === "solid" ? "badge-solid" : "badge-outline",
        className
      )}
      {...rest}
    />
  );
};

