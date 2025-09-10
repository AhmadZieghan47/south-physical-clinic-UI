import RHFText from "../../../../core/components/Form/RHFText";
import RHFDate from "../../../../core/components/Form/RHFDate";
import RHFSelect from "../../../../core/components/Form/RHFSelect";
import RHFCheckbox from "../../../../core/components/Form/RHFCheckbox";

const payOpts = [
  { label: "Cash", value: "CASH" },
  { label: "Card", value: "CARD" },
  { label: "Cheque", value: "CHEQUE" },
  { label: "PayPal", value: "PAYPAL" },
];

export default function StepInsurance() {
  return (
    <div className="row">
      <div className="col-md-6">
        <RHFText name="insurance.insurerCompany" label="Insurer Company" />
      </div>
      <div className="col-md-6">
        <RHFText name="insurance.policyNumber" label="Policy Number" />
      </div>

      <div className="col-md-6">
        <RHFText name="insurance.approvalNumber" label="Approval Number" />
      </div>
      <div className="col-md-3">
        <RHFText
          name="insurance.coveragePercent"
          label="Coverage %"
          type="number"
        />
      </div>
      <div className="col-md-3">
        <RHFText name="insurance.copayPercent" label="Copay %" type="number" />
      </div>

      <div className="col-md-6">
        <RHFSelect
          name="insurance.paymentMethod"
          label="Payment Method"
          options={payOpts}
          placeholder="Select"
        />
      </div>
      <div className="col-md-6">
        <RHFText
          name="insurance.sessionType"
          label="Session Type (insured)"
          placeholder="e.g., Normal physio"
        />
      </div>

      <div className="col-md-6">
        <RHFDate name="insurance.visitDate" label="Visit Date" />
      </div>
      <div className="col-md-6">
        <RHFDate name="insurance.expiryDate" label="Insurance Expiry" />
      </div>

      <div className="col-md-6">
        <RHFCheckbox name="insurance.visitConfirmed" label="Visit Confirmed" />
      </div>
    </div>
  );
}
