import { useFormContext } from "react-hook-form";
import type { FullPayload } from "../schema";

export default function StepReview() {
  const { getValues } = useFormContext<FullPayload>();
  const v = getValues();

  return (
    <div className="row g-3">
      <div className="col-12">
        <h6 className="fw-bold">Personal</h6>
        <pre className="bg-light p-3 rounded small">
          {JSON.stringify(v.personal, null, 2)}
        </pre>
      </div>
      <div className="col-12">
        <h6 className="fw-bold">Medical</h6>
        <pre className="bg-light p-3 rounded small">
          {JSON.stringify(v.medical, null, 2)}
        </pre>
      </div>
      <div className="col-12">
        <h6 className="fw-bold">Insurance</h6>
        <pre className="bg-light p-3 rounded small">
          {JSON.stringify(v.insurance, null, 2)}
        </pre>
      </div>
      <div className="col-12">
        <h6 className="fw-bold">Treatment Plan</h6>
        <pre className="bg-light p-3 rounded small">
          {JSON.stringify(v.plan, null, 2)}
        </pre>
      </div>
    </div>
  );
}
