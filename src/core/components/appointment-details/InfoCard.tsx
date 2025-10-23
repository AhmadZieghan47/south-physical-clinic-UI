import type { PropsWithChildren } from "react";

interface InfoCardProps extends PropsWithChildren {
  title: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function InfoCard({ title, icon, className, children }: InfoCardProps) {
  return (
    <div className={`rounded-2xl border bg-white/80 dark:bg-zinc-900/80 shadow-sm hover:shadow-md transition p-5 ${className || ""}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{title}</div>
      </div>
      <div className="text-[13px] text-zinc-600 dark:text-zinc-300">
        {children}
      </div>
    </div>
  );
}


