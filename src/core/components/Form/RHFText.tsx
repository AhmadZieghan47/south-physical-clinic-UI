import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
};

export default function RHFText({
  name,
  label,
  placeholder,
  type = "text",
}: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  
  // Handle nested field errors (e.g., "personal.firstName")
  const getNestedError = (errorObj: any, path: string) => {
    return path.split('.').reduce((obj, key) => obj?.[key], errorObj);
  };
  
  const err = getNestedError(errors, name)?.message as string | undefined;

  return (
    <div className="mb-3">
      {label && <label className="form-label fw-medium">{label}</label>}
      <input
        {...register(name)}
        type={type}
        className={`form-control ${err ? "is-invalid" : ""}`}
        placeholder={placeholder}
      />
      {err && <div className="invalid-feedback">{err}</div>}
    </div>
  );
}
