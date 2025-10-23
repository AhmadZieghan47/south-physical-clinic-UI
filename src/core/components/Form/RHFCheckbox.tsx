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
  const { register, formState: { errors } } = useFormContext();
  
  // Handle nested field errors (e.g., "medical.hasInsurance")
  const getNestedError = (errorObj: any, path: string) => {
    return path.split('.').reduce((obj, key) => obj?.[key], errorObj);
  };
  
  const err = getNestedError(errors, name)?.message as string | undefined;
  const classes = (variant: "default" | "switch", className: string) => {
    if (variant === "switch") {
      return `form-switch ${className}`;
    }
    return `form-check ${className}`;
  };

  return (
    <div className="mb-3">
      <div className={`form-check ${classes(variant, className)}`}>
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
      {err && <div className="invalid-feedback d-block">{err}</div>}
    </div>
  );
}
