import { useFormContext } from "react-hook-form";

type Option = { label: string; value: string | number };
type Props = {
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string;
};

export default function RHFSelect({
  name,
  label,
  options,
  placeholder,
}: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  
  // Handle nested field errors (e.g., "personal.gender")
  const getNestedError = (errorObj: any, path: string) => {
    return path.split('.').reduce((obj, key) => obj?.[key], errorObj);
  };
  
  const err = getNestedError(errors, name)?.message as string | undefined;

  return (
    <div className="mb-3">
      {label && <label className="form-label fw-medium">{label}</label>}
      <select
        {...register(name)}
        className={`form-select ${err ? "is-invalid" : ""}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={`${o.value}`} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {err && <div className="invalid-feedback">{err}</div>}
    </div>
  );
}
