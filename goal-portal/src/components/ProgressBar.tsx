import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number | null;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, className, showLabel = true }: ProgressBarProps) {
  const pct = value !== null ? Math.min(100, Math.max(0, value)) : 0;
  const color = pct >= 75 ? "bg-green-500" : pct >= 40 ? "bg-blue-500" : "bg-amber-500";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground w-9 text-right">
          {value !== null ? `${Math.round(pct)}%` : "—"}
        </span>
      )}
    </div>
  );
}
