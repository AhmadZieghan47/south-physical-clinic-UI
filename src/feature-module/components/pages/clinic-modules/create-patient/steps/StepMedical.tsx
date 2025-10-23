import RHFCheckbox from "@/core/components/Form/RHFCheckbox";
import RHFMultiSelect from "@/core/components/Form/RHFMultiSelect";
import {
  implantedDevicesOptions,
  medicalHistoryOptions,
} from "@/lib/constants";

export default function StepMedical() {
  return (
    <div className="step-content">
      <div className="mb-4">
        <h5 className="fw-bold text-dark mb-2">Medical Information</h5>
        <p className="text-muted mb-0">
          Please provide the patient's medical history and any relevant medical information.
        </p>
      </div>
      <div className="row">
        <div className="col-md-12">
          <RHFMultiSelect
            name="medical.medicalHistory"
            label="Medical History"
            options={medicalHistoryOptions}
            allowAddNew={true}
          />
        </div>
        <div className="col-md-12">
          <RHFMultiSelect
            name="medical.orthopedicImplants"
            label="Orthopedic Implants"
            options={implantedDevicesOptions}
            allowAddNew={true}
          />
        </div>

        <div className="col-xl-6">
          <RHFCheckbox
            className="important-switch"
            name="medical.extraCare"
            label="Extra Care"
            variant="switch"
          />
        </div>
      </div>
    </div>
  );
}
