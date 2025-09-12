import DataTable from "./DataTable";
import type { Column } from "./DataTable";
import type {
  BigIntStr,
  ISODate,
  ISODateTime,
  PlanStatusT,
  PlanTypeT,
  PriceBasisT,
} from "@/types/typedefs";

export interface PlanRow {
  id?: string;
  patientId: string;
  planType: PlanTypeT;
  packageCode: string | null;
  priceBasis: PriceBasisT;
  primaryTherapistId: BigIntStr;
  startDate: ISODate;
  status: PlanStatusT;
  totalSessions: number | null;
  remainingSessions: number;
  targetFreqPerWeek: number; // 1..5
  referringDoctorId: BigIntStr;
  insuranceReferralAuth: string | null;
  freqAdvisory2w: boolean;
  initialDxTextEn: string | null;
  initialDxTextAr: string | null;
  initialDxFileId: BigIntStr | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

const statusClass = (s: string) => {
  const k = s.toLowerCase();
  if (k.includes("discharged")) return { soft: "danger", text: "danger" };
  return { soft: "info", text: "info" };
};

const columns: Column<PlanRow>[] = [
  {
    key: "planType",
    header: "Plan Type",
    accessor: (r) => r.planType,
  },
  {
    key: "remainingSessions",
    header: "Remaining Sessions",
    accessor: (r) => r.remainingSessions,
  },
  {
    key: "status",
    header: "Status",
    render: (r) => {
      const cls = statusClass(r.status);
      return (
        <span
          className={`badge fs-13 badge-soft-${cls.soft} rounded text-${cls.text} fw-medium`}
        >
          {r.status}
        </span>
      );
    },
  },
  // {
  //   key: "actions",
  //   header: "",
  //   thClassName: "text-end",
  //   tdClassName: "action-item text-end",
  //   render: (_r) => (
  //     <div className="dropdown">
  //       <button
  //         className="btn p-0 border-0 bg-transparent"
  //         data-bs-toggle="dropdown"
  //       >
  //         <i className="ti ti-dots-vertical" />
  //       </button>
  //       <ul className="dropdown-menu p-2">
  //         <li>
  //           <button className="dropdown-item">View</button>
  //         </li>
  //         <li>
  //           <button className="dropdown-item text-danger">Delete</button>
  //         </li>
  //       </ul>
  //     </div>
  //   ),
  // },
];

export function PlansTable({
  rows,
  loading,
}: {
  rows: PlanRow[];
  loading?: boolean;
}) {
  return (
    <DataTable
      columns={columns}
      data={rows}
      loading={loading}
      emptyMessage="No plans found."
      // Optional paging:
      // page={1} pageSize={10} total={42} onPageChange={(p)=>...}
    />
  );
}
