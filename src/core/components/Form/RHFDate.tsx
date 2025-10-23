import { Controller, useFormContext } from "react-hook-form";
import { DatePicker } from "antd";
import dayjs from "dayjs";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  format?: string;
};
export default function RHFDate({
  name,
  label,
  placeholder = "YYYY-MM-DD",
  format = "YYYY-MM-DD",
}: Props) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  
  // Handle nested field errors (e.g., "personal.dob")
  const getNestedError = (errorObj: any, path: string) => {
    return path.split('.').reduce((obj, key) => obj?.[key], errorObj);
  };
  
  const err = getNestedError(errors, name)?.message as string | undefined;

  return (
    <div className="mb-3">
      {label && <label className="form-label fw-medium">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field: { value } }) => (
          <DatePicker
            value={value ? dayjs(value, "YYYY-MM-DD") : null}
            format={format}
            className={`form-control ${err ? "is-invalid" : ""}`}
            placeholder={placeholder}
            onChange={(d) => setValue(name, d ? d.format("YYYY-MM-DD") : "")}
            suffixIcon={null}
          />
        )}
      />
      {err && <div className="invalid-feedback d-block">{err}</div>}
    </div>
  );
}
