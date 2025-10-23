import React, { useMemo, useState } from "react";
import { X, Filter } from "lucide-react";
import type { Diagnosis } from "@/types/typedefs";

export type CategoryKey =
  | "Shoulder"
  | "Elbow"
  | "Wrist & Fingers"
  | "Cervical"
  | "Lumbar"
  | "Hip"
  | "Knee"
  | "Foot"
  | "Pediatric"
  | "Neurological";

export type DiagnosisSelectorProps = {
  /** Controlled value of selected diagnosis IDs */
  value?: string[];
  /** Callback on selection change */
  onChange?: (ids: string[]) => void;
  /** Optional: compact mode */
  compact?: boolean;
  diagnoses?: Diagnosis[];
};

const categories: CategoryKey[] = [
  "Shoulder",
  "Elbow",
  "Wrist & Fingers",
  "Cervical",
  "Lumbar",
  "Hip",
  "Knee",
  "Foot",
  "Pediatric",
  "Neurological",
];

/** Component */
const DiagnosisSelector: React.FC<DiagnosisSelectorProps> = ({
  value,
  onChange,
  compact,
  diagnoses = [],
}) => {
  const [selected, setSelected] = useState<string[]>(value ?? []);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<CategoryKey>("Shoulder");

  // Keep controlled in sync
  React.useEffect(() => {
    if (value) setSelected(value);
  }, [value]);

  const handleChange = (ids: string[]) => {
    setSelected(ids);
    onChange?.(ids);
  };

  const filteredDiagnoses = useMemo(() => {
    const q = query.toLowerCase();
    return diagnoses.filter(
      (d: Diagnosis) =>
        d.category === activeTab &&
        (!query.trim() ||
          d.nameEn.toLowerCase().includes(q) ||
          d.nameAr.toLowerCase().includes(q))
    );
  }, [query, activeTab]);

  const addById = (id: string) => {
    if (!id) return;
    if (!diagnoses.find((d: Diagnosis) => d.id === id)) return;
    if (selected.includes(id)) return;
    handleChange([...selected, id]);
    setQuery("");
  };

  const removeId = (id: string) =>
    handleChange(selected.filter((x) => x !== id));

  const selectedChips = (
    <div className="d-flex flex-wrap gap-2">
      {selected.map((id) => {
        const d = diagnoses.find((d: Diagnosis) => d.id === id);
        if (!d) return null;
        return (
          <span
            key={id}
            className="badge badge-soft-primary d-flex align-items-center gap-2 px-3 py-2"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.preventDefault();
              removeId(id);
            }}
            title={`Click to remove ${d.nameEn}`}
          >
            <span className="fw-medium fs-12 text-center">{d.nameEn}</span>
            <X style={{ width: "14px", height: "14px" }} />
          </span>
        );
      })}
    </div>
  );

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {/* Search */}
      <div className="d-flex flex-column gap-2">
        <div className="input-group">
          <span className="input-group-text">
            <Filter style={{ width: "16px", height: "16px" }} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search diagnosis (EN/AR)…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setQuery("")}
            >
              <X style={{ width: "14px", height: "14px" }} />
            </button>
          )}
        </div>

        {selected.length > 0 && (
          <div>
            <div className="text-muted small mb-1">Selected</div>
            {selectedChips}
          </div>
        )}
      </div>

      <hr className="my-3" />

      {/* Category Tabs */}
      <div className="mb-3">
        <ul className="nav nav-tabs" role="tablist">
          {categories.map((cat) => {
            const count = diagnoses.filter(
              (d: Diagnosis) =>
                d.category === cat &&
                (!query.trim() ||
                  d.nameEn.toLowerCase().includes(query.toLowerCase()) ||
                  d.nameAr.toLowerCase().includes(query.toLowerCase()))
            ).length;

            return (
              <li key={cat} className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === cat ? "active" : ""}`}
                  onClick={() => setActiveTab(cat)}
                  type="button"
                  role="tab"
                >
                  {cat}
                  {count > 0 && (
                    <span className="badge badge-soft-primary ms-2">
                      {count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <div className="tab-pane fade show active">
          {filteredDiagnoses.length === 0 ? (
            <div className="text-center py-4">
              <div className="alert alert-info" role="alert">
                <i className="ti ti-info-circle me-2" />
                No diagnoses found matching your criteria.
              </div>
            </div>
          ) : (
            <div className="list-group">
              {filteredDiagnoses.map((d: Diagnosis) => {
                const isSelected = selected.includes(d.id);
                return (
                  <div
                    key={d.id}
                    className={`list-group-item list-group-item-action ${
                      isSelected ? "active" : ""
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        removeId(d.id);
                      } else {
                        addById(d.id);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-start">
                      <div className="form-check me-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            if (isSelected) {
                              removeId(d.id);
                            } else {
                              addById(d.id);
                            }
                          }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6
                              className={`mb-1 fw-medium ${
                                isSelected ? "text-white" : ""
                              }`}
                            >
                              {d.nameEn}
                            </h6>
                            <p
                              className={`small mb-1 ${
                                isSelected ? "text-white-50" : "text-muted"
                              }`}
                            >
                              {d.nameAr}
                            </p>
                            <small
                              className={`${
                                isSelected ? "text-white-50" : "text-muted"
                              }`}
                            >
                              Category: {d.category}
                            </small>
                          </div>
                          {isSelected && (
                            <span className="badge bg-light text-primary">
                              Selected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosisSelector;
