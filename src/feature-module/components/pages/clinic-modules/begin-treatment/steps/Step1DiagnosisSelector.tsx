import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import DiagnosisSelector from "@/core/components/diagnosisSelector/DiagnosisSelector";
import type { DiagnosisSelection } from "../schema";
import type { Diagnosis } from "@/types/typedefs";

interface Step1DiagnosisSelectorProps {
  diagnoses: Diagnosis[];
  onDiagnosesChange: (diagnoses: DiagnosisSelection[]) => void;
}

export default function Step1DiagnosisSelector({
  diagnoses,
  onDiagnosesChange,
}: Step1DiagnosisSelectorProps) {
  const { watch, setValue } = useFormContext();
  const [selectedDiagnosisIds, setSelectedDiagnosisIds] = useState<string[]>(
    []
  );

  const watchedDiagnoses = watch("diagnoses") || [];

  useEffect(() => {
    // Initialize from form values
    const ids = watchedDiagnoses.map((d: DiagnosisSelection) => d.diagnosisId);
    setSelectedDiagnosisIds(ids);
  }, [watchedDiagnoses]);

  const handleDiagnosisChange = (ids: string[]) => {
    setSelectedDiagnosisIds(ids);

    // Convert selected IDs to DiagnosisSelection format
    const diagnoses: DiagnosisSelection[] = ids.map((id, index) => ({
      diagnosisId: id,
      isPrimary: index === 0, // First selected diagnosis is primary by default
      notesEn: "",
      notesAr: "",
    }));

    setValue("diagnoses", diagnoses);
    onDiagnosesChange(diagnoses);
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Select Initial Diagnoses</h5>
            <p className="text-muted mb-0 mt-1">
              Select one or more diagnoses for this patient. The first selected
              diagnosis will be marked as primary.
            </p>
          </div>
          <div className="card-body">
            <DiagnosisSelector
              diagnoses={diagnoses}
              value={selectedDiagnosisIds}
              onChange={handleDiagnosisChange}
              compact={false}
            />

            {selectedDiagnosisIds.length > 0 && (
              <div className="mt-4">
                <div className="alert alert-info" role="alert">
                  <h6 className="alert-heading">
                    <i className="ti ti-info-circle me-2" />
                    Selected Diagnoses Summary
                  </h6>
                  <p className="mb-2">
                    <strong>Total Selected:</strong>{" "}
                    {selectedDiagnosisIds.length} diagnosis(es)
                  </p>
                  <p className="mb-0">
                    <strong>Primary Diagnosis:</strong> The first selected
                    diagnosis will be marked as primary.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
