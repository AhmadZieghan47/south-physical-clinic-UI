import { useFormContext } from "react-hook-form";
import React from "react";

type FileItem = { name: string; size: number; type: string; file: File };

type Props = { name: string; label?: string; accept?: string };
export default function RHFFileList({ name, label, accept }: Props) {
  const { setValue, watch, formState: { errors } } = useFormContext();
  const files: FileItem[] = watch(name) ?? [];
  
  // Handle nested field errors (e.g., "attachments.files")
  const getNestedError = (errorObj: any, path: string) => {
    return path.split('.').reduce((obj, key) => obj?.[key], errorObj);
  };
  
  const err = getNestedError(errors, name)?.message as string | undefined;

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []).map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      file: f,
    }));
    setValue(name, [...files, ...picked]);
  };

  const remove = (i: number) =>
    setValue(
      name,
      files.filter((_, idx) => idx !== i)
    );

  return (
    <div className="mb-3">
      {label && <label className="form-label fw-medium">{label}</label>}
      <input
        type="file"
        multiple
        accept={accept}
        className={`form-control ${err ? "is-invalid" : ""}`}
        onChange={onPick}
      />
      {!!files.length && (
        <ul className="list-group mt-2">
          {files.map((f, i) => (
            <li
              key={i}
              className="list-group-item d-flex justify-content-between"
            >
              <span>{f.name}</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => remove(i)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      {err && <div className="invalid-feedback d-block">{err}</div>}
    </div>
  );
}
