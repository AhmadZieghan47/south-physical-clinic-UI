import { Controller, useFormContext } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

type Props = { name: string; label?: string; defaultCountry?: string };
export default function RHFPhone({
  name,
  label,
  defaultCountry = "JO",
}: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const err = (errors as any)[name]?.message as string | undefined;

  return (
    <div className="mb-3">
      {label && <label className="form-label fw-medium">{label}</label>}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <PhoneInput
            {...field}
            className={`d-flex align-items-center form-control ${err ? "is-invalid" : ""}`}
            defaultCountry={defaultCountry as any}
            placeholder='07********'
          />
        )}
      />
      {err && <div className="invalid-feedback d-block">{err}</div>}
    </div>
  );
}
