import RHFText from "../../../../core/components/Form/RHFText";
import RHFPhone from "../../../../core/components/Form/RHFPhone";
import RHFDate from "../../../../core/components/Form/RHFDate";
import RHFSelect from "../../../../core/components/Form/RHFSelect";

const genderOpts = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];

export default function StepPersonal() {
  return (
    <div className="row">
      <div className="col-md-6">
        <RHFText name="personal.firstName" label="First Name *" />
      </div>
      <div className="col-md-6">
        <RHFText name="personal.lastName" label="Last Name *" />
      </div>
      <div className="col-md-6">
        <RHFPhone name="personal.phone" label="Phone Number *" />
      </div>
      <div className="col-md-6">
        <RHFDate name="personal.dob" label="DOB *" />
      </div>
      <div className="col-md-6">
        <RHFSelect
          name="personal.gender"
          label="Gender *"
          options={genderOpts}
          placeholder="Select"
        />
      </div>
      <div className="col-md-6">
        <RHFText name="personal.nationalId" label="National ID" />
      </div>
    </div>
  );
}
