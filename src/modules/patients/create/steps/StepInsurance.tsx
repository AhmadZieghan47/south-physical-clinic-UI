import RHFText from "../../../../core/components/Form/RHFText";
import RHFDate from "../../../../core/components/Form/RHFDate";
import RHFSelect from "../../../../core/components/Form/RHFSelect";
import { useFormContext } from "react-hook-form";
import { insurerOptions } from "../../../../lib/constants";

export default function StepInsurance() {
  const methods = useFormContext();

  return (
    <div className="row">
      <div className="col-md-6">
        <RHFSelect
          name="insurance.insurerCompany"
          label="Insurer Company"
          options={insurerOptions}
          placeholder="Select insurer"
        />
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label fw-medium">Coverage</label>
          <div className="input-group">
            <input
              max={100}
              type="number"
              className="form-control"
              placeholder="Enter coverage percentage"
              {...methods.register("insurance.coveragePercent")}
            />
            <span className="input-group-text">%</span>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <RHFText name="insurance.policyNumber" label="Policy Number" />
      </div>

      <div className="col-md-6">
        <RHFText name="insurance.approvalNumber" label="Approval Number" />
      </div>
      <div className="col-md-6">
        <RHFDate name="insurance.expiryDate" label="Insurance Expiry" />
      </div>
    </div>
  );
}
