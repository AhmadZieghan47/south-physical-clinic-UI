import clipboardCopy from "clipboard-copy";
import InfoCard from "./InfoCard";

interface Person {
  name: string;
  phone?: string;
  roleLabel?: string;
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts[1]?.[0] || "";
  return (first + last).toUpperCase() || name.slice(0, 2).toUpperCase();
}

function PersonRow({ person }: { person: Person }) {
  const initials = initialsOf(person.name || "?");
  return (
    <div className="rounded-xl border p-3 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800">
      <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-semibold">
        {initials}
      </div>
      <div className="min-w-0">
        <div className="font-medium truncate">{person.name}</div>
        {person.phone && <div className="text-xs text-zinc-500 truncate">{person.phone}</div>}
        {person.roleLabel && <div className="text-xs text-zinc-500 truncate">{person.roleLabel}</div>}
      </div>
      {person.phone && (
        <button
          type="button"
          className="ms-auto text-xs underline decoration-dotted"
          aria-label="Copy phone"
          onClick={() => clipboardCopy(person.phone!)}
        >
          Copy
        </button>
      )}
    </div>
  );
}

export default function PeopleCard({ title, people }: { title: string; people: Person[] }) {
  return (
    <InfoCard title={title}>
      <div className="flex flex-col gap-2">
        {people.length === 0 ? (
          <div className="text-zinc-500 text-sm">No people</div>
        ) : (
          people.map((p, i) => <PersonRow key={i} person={p} />)
        )}
      </div>
    </InfoCard>
  );
}


