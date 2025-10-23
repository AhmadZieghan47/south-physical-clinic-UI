import { Link } from "react-router";
import type { Column } from "./DataTable";
import DataTable from "./DataTable";
import type { Payment, PaymentMethod } from "@/types/typedefs";

export type PaymentRow = Payment & {
  description?: string;
  methodLabel?: string;
  statusLabel?: string;
};

const getPaymentMethodLabel = (method: PaymentMethod): string => {
  switch (method) {
    case "CASH":
      return "Cash";
    case "CARD":
      return "Card";
    case "INSURANCE":
      return "Insurance";
    default:
      return method;
  }
};

const getPaymentStatusLabel = (paidAt: string): string => {
  // Since Payment interface doesn't have a status field, we'll determine it based on paidAt
  // If paidAt exists, it's completed; otherwise, it might be pending
  return paidAt ? "Completed" : "Pending";
};

const payStatusClass = (status: string) => {
  const k = status.toLowerCase();
  if (k.includes("pending"))
    return { soft: "info", text: "info", border: "border-info" };
  if (k.includes("complete"))
    return { soft: "success", text: "success", border: "border-success" };
  return { soft: "secondary", text: "body", border: "border-secondary" };
};

const formatPaymentDate = (paidAt: string): string => {
  if (!paidAt) return "Pending";

  const date = new Date(paidAt);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatAmount = (amount: string): string => {
  // Convert string amount to number and format as currency
  const numAmount = parseFloat(amount);
  return `JOD ${numAmount.toFixed(2)}`;
};

const paymentColumns: Column<PaymentRow>[] = [
  {
    key: "tx",
    header: "Transaction ID",
    noSort: true,
    render: (r) => <Link to="#">#{r.id}</Link>,
  },
  {
    key: "desc",
    header: "Description",
    accessor: (r) => (
      <span className="text-dark">
        {r.description ||
          `Payment for ${r.planId ? "Treatment Plan" : "Appointment"}`}
      </span>
    ),
  },
  {
    key: "date",
    header: "Paid Date",
    accessor: (r) => (
      <span className="text-dark">{formatPaymentDate(r.paidAt)}</span>
    ),
  },
  {
    key: "method",
    header: "Payment Method",
    accessor: (r) => (
      <span className="text-dark">
        {r.methodLabel || getPaymentMethodLabel(r.method)}
      </span>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    accessor: (r) => (
      <span className="text-dark">{formatAmount(r.amountJd)}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (r) => {
      const status = r.statusLabel || getPaymentStatusLabel(r.paidAt);
      const cls = payStatusClass(status);
      return (
        <span
          className={`badge fs-13 badge-soft-${cls.soft} rounded text-${cls.text} fw-medium border ${cls.border}`}
        >
          {status}
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
