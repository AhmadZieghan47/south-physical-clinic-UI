import { Link } from "react-router";
import type { Column } from "./DataTable";
import DataTable from "./DataTable";
import type { FileBlob } from "@/types/typedefs";

export type FileRow = FileBlob & {
  fileTypeLabel?: string;
  sizeLabel?: string;
  downloadUrl?: string;
};

const getFileTypeIcon = (mimeType: string): string => {
  if (mimeType.includes("pdf")) return "ti ti-file-type-pdf";
  if (mimeType.includes("image")) return "ti ti-photo";
  if (mimeType.includes("word") || mimeType.includes("document"))
    return "ti ti-file-type-doc";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
    return "ti ti-file-type-xls";
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation"))
    return "ti ti-file-type-ppt";
  if (mimeType.includes("text")) return "ti ti-file-text";
  if (mimeType.includes("zip") || mimeType.includes("rar"))
    return "ti ti-file-zip";
  return "ti ti-file";
};

const getFileTypeLabel = (mimeType: string): string => {
  if (mimeType.includes("pdf")) return "PDF Document";
  if (mimeType.includes("image/jpeg") || mimeType.includes("image/jpg"))
    return "JPEG Image";
  if (mimeType.includes("image/png")) return "PNG Image";
  if (mimeType.includes("image/gif")) return "GIF Image";
  if (mimeType.includes("image/svg")) return "SVG Image";
  if (mimeType.includes("word")) return "Word Document";
  if (mimeType.includes("excel")) return "Excel Spreadsheet";
  if (mimeType.includes("powerpoint")) return "PowerPoint Presentation";
  if (mimeType.includes("text")) return "Text Document";
  if (mimeType.includes("zip")) return "ZIP Archive";
  if (mimeType.includes("rar")) return "RAR Archive";
  return mimeType;
};

const formatFileSize = (sizeBytes: number): string => {
  if (sizeBytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(sizeBytes) / Math.log(k));

  return parseFloat((sizeBytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const fileColumns: Column<FileRow>[] = [
  {
    key: "file",
    header: "File",
    noSort: true,
    render: (r: FileRow) => (
      <div className="d-flex align-items-center">
        <div className="me-2">
          <i
            className={`${getFileTypeIcon(r.mimeType)} fs-20 text-primary`}
          ></i>
        </div>
        <div>
          <h6 className="fs-14 mb-1 text-truncate">
            <Link to={r.downloadUrl || "#"} className="fw-semibold text-dark">
              {r.labelEn || r.labelAr || `File_${r.id}`}
            </Link>
          </h6>
          <p className="mb-0 fs-13 text-muted">
            {r.fileTypeLabel || getFileTypeLabel(r.mimeType)}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "size",
    header: "Size",
    accessor: (r: FileRow) => (
      <span className="text-dark">
        {r.sizeLabel || formatFileSize(r.sizeBytes)}
      </span>
    ),
  },
  {
    key: "uploaded",
    header: "Uploaded",
    accessor: (r: FileRow) => (
      <span className="text-dark">{formatDate(r.createdAt)}</span>
    ),
  },
  {
    key: "actions",
    header: "",
    thClassName: "text-end",
    tdClassName: "action-item text-end",
    render: (r: FileRow) => (
      <div className="dropdown">
        <button
          className="btn p-0 border-0 bg-transparent"
          data-bs-toggle="dropdown"
        >
          <i className="ti ti-dots-vertical" />
        </button>
        <ul className="dropdown-menu p-2">
          <li>
            <Link
              to={r.downloadUrl || "#"}
              className="dropdown-item d-flex align-items-center"
              download
            >
              <i className="ti ti-download me-2"></i>
              Download
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="dropdown-item d-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#view_file_modal"
            >
              <i className="ti ti-eye me-2"></i>
              View
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="dropdown-item d-flex align-items-center text-danger"
              data-bs-toggle="modal"
              data-bs-target="#delete_file_modal"
            >
              <i className="ti ti-trash me-2"></i>
              Delete
            </Link>
          </li>
        </ul>
      </div>
    ),
  },
];

export function FilesTable({
  rows,
  loading,
}: {
  rows: FileRow[];
  loading?: boolean;
}) {
  return (
    <DataTable
      columns={fileColumns}
      data={rows}
      loading={loading}
      emptyMessage="No files found."
      className="file-table-d-contents"
    />
  );
}
