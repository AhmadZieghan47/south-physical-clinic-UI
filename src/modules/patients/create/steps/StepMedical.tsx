import RHFCheckbox from "../../../../core/components/Form/RHFCheckbox";
import RHFText from "../../../../core/components/Form/RHFText";
import RHFMultiSelect from "../../../../core/components/Form/RHFMultiSelect";
import {
  implantedDevicesOptions,
  medicalHistoryOptions,
} from "../../../../lib/constants";

export default function StepMedical() {
  return (
    <div className="row">
      <div className="col-md">
        <RHFText
          name="medical.diagnoses.0"
          label="Primary Diagnosis"
          placeholder="Low back pain + Disc herniation + ..."
        />
      </div>
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
  );
}
