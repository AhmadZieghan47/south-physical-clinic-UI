import RHFFileList from "../../../../core/components/Upload/RHFFileList";

export default function StepAttachments() {
  return (
    <div className="row">
      <div className="col-md-12">
        <RHFFileList
          name="attachments.files"
          label="Attachments (PDF, Images)"
          accept=".pdf,image/*"
        />
      </div>
    </div>
  );
}
