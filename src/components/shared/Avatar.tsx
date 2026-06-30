import { cn } from "@/lib/utils";

export type AvatarMember = {
  _id?: string;
  id?: string;
  name: string;
  avatar?: string;
};

const palette = [
  "oklch(0.62 0.2 268)",
  "oklch(0.64 0.18 215)",
  "oklch(0.66 0.16 155)",
  "oklch(0.68 0.2 295)",
  "oklch(0.7 0.18 75)",
  "oklch(0.58 0.22 24)",
];

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getDisplayInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getColorSeed(member: AvatarMember | string): string {
  if (typeof member === "string") return member;
  return member._id ?? member.id ?? member.name;
}

function getMemberName(member?: AvatarMember | null): string {
  if (!member) return "Unknown";
  return member.name || "Unknown";
}

function resolveAvatarMember(memberOrId?: AvatarMember | string | null): AvatarMember | null {
  if (!memberOrId) return null;
  if (typeof memberOrId === "string") {
    return { id: memberOrId, name: memberOrId };
  }
  return memberOrId;
}

export function MemberAvatar({
  member,
  id,
  size = 28,
  className,
}: {
  member?: AvatarMember | null;
  id?: string;
  size?: number;
  className?: string;
}) {
  const resolved = resolveAvatarMember(member ?? id ?? null);
  const name = getMemberName(resolved);
  const initials = getDisplayInitials(name);
  const background = palette[hashString(getColorSeed(resolved ?? name)) % palette.length];

  return (
    <div
      className={cn(
        "rounded-full grid place-items-center text-[10px] font-semibold text-white ring-2 ring-background shrink-0 overflow-hidden",
        className,
      )}
      style={{ width: size, height: size, background, fontSize: size * 0.36 }}
      title={name}
    >
      {resolved?.avatar ? (
        <img src={resolved.avatar} alt={name} className="size-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

export function AvatarGroup({
  members,
  ids,
  max = 4,
  size = 26,
}: {
  members?: Array<AvatarMember | null | undefined>;
  ids?: string[];
  max?: number;
  size?: number;
}) {
  const resolvedMembers = (members ?? ids?.map((value) => ({ id: value, name: value })) ?? [])
    .filter((member): member is AvatarMember => !!member)
    .filter((member, index, array) => {
      const key = member._id ?? member.id ?? member.name;
      return array.findIndex((other) => (other._id ?? other.id ?? other.name) === key) === index;
    });

  const shown = resolvedMembers.slice(0, max);
  const extra = resolvedMembers.length - shown.length;

  return (
    <div className="flex -space-x-2">
      {shown.map((member, index) => (
        <MemberAvatar key={member._id ?? member.id ?? `${member.name}-${index}`} member={member} size={size} />
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
