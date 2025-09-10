import { useFormContext } from "react-hook-form";
type Props = { name: string; label: string };
export default function RHFCheckbox({ name, label }: Props) {
  const { register } = useFormContext();
  return (
    <div className="form-check mb-2">
      <input
        type="checkbox"
        className="form-check-input"
        id={name}
        {...register(name)}
      />
      <label className="form-check-label" htmlFor={name}>
        {label}
      </label>
    </div>
  );
}
