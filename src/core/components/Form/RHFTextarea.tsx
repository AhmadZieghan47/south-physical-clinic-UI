import { useFormContext } from "react-hook-form";
type Props = {
  name: string;
  label?: string;
  rows?: number;
  placeholder?: string;
};
export default function RHFTextarea({
  name,
  label,
  rows = 4,
  placeholder,
}: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const err = (errors as any)[name]?.message as string | undefined;
  return (
    <div className="mb-3">
      {label && <label className="form-label fw-medium">{label}</label>}
      <textarea
        {...register(name)}
        className={`form-control ${err ? "is-invalid" : ""}`}
        rows={rows}
        placeholder={placeholder}
      />
      {err && <div className="invalid-feedback">{err}</div>}
    </div>
  );
}
