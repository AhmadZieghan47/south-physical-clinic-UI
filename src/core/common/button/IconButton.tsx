import React from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import Button from "./Button";
import type { IconButtonProps } from "./types";

const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  ariaLabel,
  iconColor,
  iconSize = 16,
  className = "",
  ...rest
}) => {
  return (
    <Button
      className={`btn-icon ${className}`}
      icon={<DynamicIcon name={iconName as any} color={iconColor} size={iconSize} />}
      aria-label={ariaLabel}
      {...rest}
    >
      {/* Icon buttons have no text children */}
    </Button>
  );
};

export default IconButton;

