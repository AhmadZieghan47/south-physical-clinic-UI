import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
  variant?: "default" | "switch";
  className?: string;
};

export default function RHFCheckbox({
  name,
  label,
  variant = "default",
  className = "",
}: Props) {
  const { register } = useFormContext();
  const classes = (variant: "default" | "switch", className: string) => {
    if (variant === "switch") {
      return `form-switch ${className}`;
    }
    return `form-check ${className}`;
  };

  return (
    <div className={`form-check mb-2 ${classes(variant, className)}`}>
      <input
        type="checkbox"
        className="form-check-input"
        id={name}
        {...register(name)}
      />
      <label className="form-check-label text-dark" htmlFor={name}>
        {label}
      </label>
    </div>
  );
}
