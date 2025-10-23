import { Tag, Tooltip } from "antd";
import { CheckCircle2, XCircle, Clock, CalendarClock, Ban, RefreshCw } from "lucide-react";
import type { ApptStatusT } from "@/types/typedefs";

const map = {
  BOOKED: { color: "processing", Icon: CalendarClock, labelKey: "status.booked" },
  CHECKED_IN: { color: "blue", Icon: Clock, labelKey: "status.checkedIn" },
  COMPLETED: { color: "success", Icon: CheckCircle2, labelKey: "status.completed" },
  CANCELLED: { color: "default", Icon: Ban, labelKey: "status.cancelled" },
  NO_SHOW: { color: "error", Icon: XCircle, labelKey: "status.noShow" },
  RESCHEDULED: { color: "warning", Icon: RefreshCw, labelKey: "status.rescheduled" }
} as const;

export function StatusTag({ status, t, title }: { status: ApptStatusT | "NO_SHOW"; t: (k: string) => string; title?: string }) {
  const conf = map[status as keyof typeof map] || map.BOOKED;
  const Icon = conf.Icon;
  const content = (
    <Tag color={conf.color as any} className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs">
      <Icon size={14} aria-hidden />
      {t(conf.labelKey)}
    </Tag>
  );
  return title ? <Tooltip title={title}>{content}</Tooltip> : content;
}

export default StatusTag;


