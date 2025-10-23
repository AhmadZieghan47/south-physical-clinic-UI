import { useState } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  options: string[];
  allowAddNew?: boolean;
};

export default function RHFMultiSelect({
  name,
  label,
  // placeholder = "Select options...",
  options,
  allowAddNew = true,
}: Props) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [newOption, setNewOption] = useState("");
  const [showAddNew, setShowAddNew] = useState(false);

  const selectedValues = watch(name) || [];

  // Handle nested field errors (e.g., "medical.medicalHistory")
  const getNestedError = (errorObj: any, path: string) => {
    return path.split(".").reduce((obj, key) => obj?.[key], errorObj);
  };

  const err = getNestedError(errors, name)?.message as string | undefined;

  const handleAddNew = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      // const updatedOptions = [...options, newOption.trim()];
      setValue(name, [...selectedValues, newOption.trim()]);
      setNewOption("");
      setShowAddNew(false);
    }
  };

  const handleToggleOption = (option: string) => {
    const isSelected = selectedValues.includes(option);
    if (isSelected) {
      setValue(
        name,
        selectedValues.filter((v: string) => v !== option)
      );
    } else {
      setValue(name, [...selectedValues, option]);
    }
  };

  const handleRemoveOption = (option: string) => {
    setValue(
      name,
      selectedValues.filter((v: string) => v !== option)
    );
  };

  return (
    <div className="mb-3">
      {label && <label className="form-label fw-medium">{label}</label>}

      {/* Selected items display */}
      {selectedValues.length > 0 && (
        <div className="mb-2">
          <div className="d-flex flex-wrap gap-1">
            {selectedValues.map((value: string) => (
              <span
                key={value}
                className="badge bg-primary d-flex align-items-center gap-1"
              >
                {value}
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  style={{ fontSize: "0.7em" }}
                  onClick={() => handleRemoveOption(value)}
                />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Options list */}
      <div
        className="d-flex flex-wrap gap-3 border-bottom rounded p-2 pb-4"
        style={{ overflowY: "auto" }}
      >
        {options.map((option) => (
          <div key={option} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`${name}-${option}`}
              checked={selectedValues.includes(option)}
              onChange={() => handleToggleOption(option)}
            />
            <label className="form-check-label" htmlFor={`${name}-${option}`}>
              {option}
            </label>
          </div>
        ))}

        {/* Add new option */}
        {allowAddNew && (
          <div className="w-100">
            <div className="w-auto">
              {!showAddNew ? (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setShowAddNew(true)}
                >
                  + Add New
                </button>
              ) : (
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Enter new option..."
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddNew()}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    onClick={handleAddNew}
                    disabled={!newOption.trim()}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-light"
                    onClick={() => {
                      setShowAddNew(false);
                      setNewOption("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden input for form validation */}
      <input type="hidden" {...register(name)} />

      {err && <div className="invalid-feedback d-block">{err}</div>}
    </div>
  );
}
