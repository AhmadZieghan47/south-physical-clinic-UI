import RHFTextarea from "../../../../core/components/Form/RHFTextarea";
import RHFCheckbox from "../../../../core/components/Form/RHFCheckbox";
import RHFText from "../../../../core/components/Form/RHFText";

export default function StepMedical() {
  return (
    <div className="row">
      <div className="col-md-6">
        <RHFText
          name="medical.diagnoses.0"
          label="Primary Diagnosis"
          placeholder="e.g., Low back pain"
        />
      </div>
      <div className="col-md-6">
        <RHFText
          name="medical.allergies.0"
          label="Allergy (optional)"
          placeholder="e.g., Penicillin"
        />
      </div>

      <div className="col-md-12">
        <RHFTextarea name="medical.medicalHistory" label="Medical History" />
      </div>
      <div className="col-md-12">
        <RHFTextarea
          name="medical.currentMedications"
          label="Current Medications"
        />
      </div>
      <div className="col-md-12">
        <RHFTextarea
          name="medical.orthopedicImplants"
          label="Orthopedic Implants"
        />
      </div>

      <div className="col-md-6">
        <RHFCheckbox name="medical.extraCare" label="Extra Care" />
      </div>
      <div className="col-md-6">
        <RHFCheckbox name="medical.hasInsurance" label="Has Insurance" />
      </div>
    </div>
  );
}
