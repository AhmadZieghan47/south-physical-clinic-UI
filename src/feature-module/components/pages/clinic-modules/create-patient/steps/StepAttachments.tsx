import RHFFileList from "@/core/components/Upload/RHFFileList";

export default function StepAttachments() {
  return (
    <div className="step-content">
      <div className="mb-4">
        <h5 className="fw-bold text-dark mb-2">Attachments</h5>
        <p className="text-muted mb-0">
          Upload any relevant documents or images for this patient (optional).
        </p>
      </div>
      <div className="row">
        <div className="col-md-12">
          <RHFFileList
            name="attachments.files"
            label="Attachments (PDF, Images)"
            accept=".pdf,image/*"
          />
        </div>
      </div>
    </div>
  );
}
