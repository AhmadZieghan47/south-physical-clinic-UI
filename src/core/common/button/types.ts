import React from "react";

export type ButtonVariant = 
  | "primary" 
  | "secondary" 
  | "success" 
  | "danger" 
  | "warning" 
  | "info" 
  | "light" 
  | "dark" 
  | "white";

export type ButtonStyle = 
  | "default"      // btn-{variant}
  | "outline"      // btn-outline-{variant}
  | "soft"         // btn-soft-{variant}
  | "gradient"     // bg-gradient or bg-{variant}-gradient
  | "gradient2";   // bg-{variant}-gradient with btn-effect

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  styleVariant?: ButtonStyle;
  size?: ButtonSize;
  rounded?: boolean;          // rounded-pill
  animation?: boolean;        // btn-animation
  block?: boolean;            // d-grid (full width)
  loading?: boolean;          // show spinner
  icon?: React.ReactNode;     // icon element
  iconPosition?: "left" | "right";
  labelIcon?: boolean;        // btn-label style
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface IconButtonProps extends Omit<ButtonProps, "children" | "icon"> {
  iconName: string;           // Required: Lucide icon name (e.g., "camera", "trash", "edit")
  ariaLabel: string;          // Required for accessibility
  iconColor?: string;         // Optional: Icon color (e.g., "red", "#ff0000")
  iconSize?: number;          // Optional: Icon size in pixels (default: 16)
}

