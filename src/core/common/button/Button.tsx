import React from "react";
import type { ButtonProps } from "./types";

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  styleVariant = "default",
  size = "md",
  rounded = false,
  animation = false,
  block = false,
  loading = false,
  icon,
  iconPosition = "left",
  labelIcon = false,
  children,
  className = "",
  disabled = false,
  type = "button",
  ...rest
}) => {
  // Build className string
  const classes = [
    "btn",
    // Variant and styleVariant
    styleVariant === "default" ? `btn-${variant}` :
    styleVariant === "outline" ? `btn-outline-${variant}` :
    styleVariant === "soft" ? `btn-soft-${variant}` :
    styleVariant === "gradient" ? `btn-${variant} bg-gradient` :
    styleVariant === "gradient2" ? `btn-${variant} bg-${variant}-gradient` : "",
    // Size
    size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "",
    // Modifiers
    rounded ? "rounded-pill" : "",
    animation ? "btn-animation" : "",
    labelIcon ? "btn-label" : "",
    labelIcon && iconPosition === "right" ? "right" : "",
    block ? "d-grid" : "",
    className
  ].filter(Boolean).join(" ");

  // Render icon
  const renderIcon = () => {
    if (loading) {
      return (
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
      );
    }
    if (!icon) return null;

    const iconClasses = labelIcon 
      ? `label-icon align-middle fs-16 ${iconPosition === "left" ? "me-2" : "ms-2"} ${rounded ? "rounded-pill" : ""}`
      : "";
    
    return <span className={iconClasses}>{icon}</span>;
  };

  const content = (
    <>
      {icon && iconPosition === "left" && renderIcon()}
      {animation ? <span>{children}</span> : children}
      {icon && iconPosition === "right" && renderIcon()}
    </>
  );

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...(animation && children && { "data-text": children })}
      {...rest}
    >
      {content}
    </button>
  );
};

export default Button;

