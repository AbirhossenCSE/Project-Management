import { findMember } from "@/data/mock";
import { cn } from "@/lib/utils";

export function MemberAvatar({ id, size = 28, className }: { id: string; size?: number; className?: string }) {
  const m = findMember(id);
  return (
    <div
      className={cn(
        "rounded-full grid place-items-center text-[10px] font-semibold text-white ring-2 ring-background shrink-0",
        className,
      )}
      style={{ width: size, height: size, background: m.color, fontSize: size * 0.36 }}
      title={m.name}
    >
      {m.initials}
    </div>
  );
}

export function AvatarGroup({ ids, max = 4, size = 26 }: { ids: string[]; max?: number; size?: number }) {
  const shown = ids.slice(0, max);
  const extra = ids.length - shown.length;
  return (
    <div className="flex -space-x-2">
      {shown.map((id) => (
        <MemberAvatar key={id} id={id} size={size} />
      ))}
      {extra > 0 && (
        <div
          className="rounded-full grid place-items-center text-[10px] font-semibold bg-muted text-muted-foreground ring-2 ring-background"
          style={{ width: size, height: size, fontSize: size * 0.36 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}