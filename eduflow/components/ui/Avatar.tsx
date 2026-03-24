import * as React from "react";
import clsx from "clsx";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  initials?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ initials = "EF", className, ...rest }) => {
  return (
    <div
      className={clsx("avatar-root", className)}
      aria-hidden="true"
      {...rest}
    >
      <span className="avatar-initials">{initials}</span>
    </div>
  );
};

