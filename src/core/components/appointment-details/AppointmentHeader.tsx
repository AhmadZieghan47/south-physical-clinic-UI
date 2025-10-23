import { CalendarClock, Phone, MessageCircle, Edit, XCircle, Printer, Share2, CheckCircle2, Activity } from "lucide-react";
import StatusTag from "./StatusTag";
import { Tooltip } from "antd";

interface HeaderProps {
  t: (k: string) => string;
  idLabel?: string;
  dateTimeLabel?: string;
  status: any;
  onClose?: () => void;
}

export default function AppointmentHeader({ t, idLabel, dateTimeLabel, status }: HeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b">
      <div className="flex items-center gap-3 p-4">
        <div className="flex-1 min-w-0">
          <div className="text-xl font-semibold truncate">{t("appointment.detailsTitle")}</div>
          {idLabel && <div className="text-sm text-zinc-500 truncate">{idLabel}</div>}
        </div>
        {dateTimeLabel && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs">
            <CalendarClock size={16} />
            <span className="font-medium">{dateTimeLabel}</span>
          </div>
        )}
        <div className="flex items-center gap-2 ms-auto">
          <StatusTag status={status} t={t} />
          <div className="hidden sm:flex items-center gap-1 ms-2">
            {[
              { I: CalendarClock, label: "Reschedule" },
              { I: CheckCircle2, label: "Check-in" },
              { I: Activity, label: "Start session" },
              { I: Phone, label: "Call" },
              { I: MessageCircle, label: "Message" },
              { I: Edit, label: "Edit" },
              { I: XCircle, label: "Cancel" },
              { I: Printer, label: "Print" },
              { I: Share2, label: "Share" }
            ].map(({ I, label }, idx) => (
              <Tooltip title={t(`actions.${label.toLowerCase().replace(/\s+/g, "")}`)} key={idx}>
                <button type="button" className="inline-flex items-center justify-center w-8 h-8 rounded-md transition hover:ring-1 hover:ring-zinc-200">
                  <I size={16} aria-hidden />
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


