import { Link } from "react-router";
import type { Column } from "./DataTable";
import DataTable from "./DataTable";

export type PaymentRow = {
  id: string;
  description: string;
  paidDate: string;
  method: string;
  amount: number;
  status: "Completed" | "Pending" | string;
};

const payStatusClass = (s: string) => {
  const k = s.toLowerCase();
  if (k.includes("pending"))   return { soft: "info", text: "info", border: "border-info" };
  if (k.includes("complete"))  return { soft: "success", text: "success", border: "border-success" };
  return { soft: "secondary", text: "body", border: "border-secondary" };
};

const paymentColumns: Column<PaymentRow>[] = [
  {
    key: "tx",
    header: "Transaction ID",
    noSort: true,
    render: (r) => <Link to="#">#{r.id}</Link>,
  },
  { key: "desc", header: "Description", accessor: (r) => <span className="text-dark">{r.description}</span> },
  { key: "date", header: "Paid Date", accessor: (r) => <span className="text-dark">{r.paidDate}</span> },
  { key: "method", header: "Payment Method", accessor: (r) => <span className="text-dark">{r.method}</span> },
  { key: "amount", header: "Amount", accessor: (r) => <span className="text-dark">{r.amount}</span> },
  {
    key: "status",
    header: "Status",
    render: (r) => {
      const cls = payStatusClass(r.status);
      return (
        <span className={`badge fs-13 badge-soft-${cls.soft} rounded text-${cls.text} fw-medium border ${cls.border}`}>
          {r.status}
        </span>
      );
    },
  },
];

export function PaymentsTable({
  rows,
  loading,
}: {
  rows: PaymentRow[];
  loading?: boolean;
}) {
  return (
    <DataTable
      columns={paymentColumns}
      data={rows}
      loading={loading}
      emptyMessage="No payments found."
    />
  );
}
