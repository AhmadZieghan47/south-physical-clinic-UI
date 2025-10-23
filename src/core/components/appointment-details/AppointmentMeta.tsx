import InfoCard from "./InfoCard";
import { CalendarClock, Clock, Layers, MapPin, DollarSign, Package } from "lucide-react";

interface MetaItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}

function MetaItem({ icon, label, value }: MetaItemProps) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="text-zinc-500">{icon}</div>
      <div className="text-[13px]">
        <div className="text-zinc-500">{label}</div>
        <div className="font-medium text-zinc-800 dark:text-zinc-100">{value}</div>
      </div>
    </div>
  );
}

export default function AppointmentMeta({ t, meta }: { t: (k: string) => string; meta: {
  dateTime?: string;
  duration?: string | null;
  room?: string | null;
  sessionType?: string | null;
  paymentStatus?: string | null;
  packageName?: string | null;
} }) {
  return (
    <InfoCard title={t("appointment.infoTitle")} icon={<Layers size={16} aria-hidden />}> 
      <div className="flex flex-col">
        <MetaItem icon={<CalendarClock size={16} />} label={t("appointment.dateTime")} value={meta.dateTime} />
        <MetaItem icon={<Clock size={16} />} label={t("appointment.duration")} value={meta.duration || undefined} />
        <MetaItem icon={<MapPin size={16} />} label={t("appointment.room")} value={meta.room || undefined} />
        <MetaItem icon={<Layers size={16} />} label={t("appointment.sessionType")} value={meta.sessionType || undefined} />
        <MetaItem icon={<DollarSign size={16} />} label={t("appointment.paymentStatus")} value={meta.paymentStatus || undefined} />
        <MetaItem icon={<Package size={16} />} label={t("appointment.package")} value={meta.packageName || undefined} />
      </div>
    </InfoCard>
  );
}


