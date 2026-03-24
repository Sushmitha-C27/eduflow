import * as React from "react";
import clsx from "clsx";

type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonSize = "sm" | "md";

interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: false;
}

interface AsChildButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild: true;
  children: React.ReactElement;
}

type Props = BaseButtonProps | AsChildButtonProps;

export const Button: React.FC<Props> = ({
  variant = "solid",
  size = "md",
  asChild,
  className,
  children,
  ...rest
}) => {
  const classes = clsx(
    "fade-border",
    "button-reset",
    getVariantClass(variant),
    getSizeClass(size),
    className
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: clsx((children as React.ReactElement<any>).props.className, classes),
      ...rest,
    });
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};

function getVariantClass(variant: ButtonVariant) {
  switch (variant) {
    case "outline":
      return "btn-outline";
    case "ghost":
      return "btn-ghost";
    case "solid":
    default:
      return "btn-solid";
  }
}

function getSizeClass(size: ButtonSize) {
  switch (size) {
    case "sm":
      return "btn-sm";
    case "md":
    default:
      return "btn-md";
  }
}

