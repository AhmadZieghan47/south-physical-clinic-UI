import { FileText } from "lucide-react";

export default function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-zinc-500 text-sm">
      <FileText size={16} aria-hidden />
      <span>{text}</span>
    </div>
  );
}


