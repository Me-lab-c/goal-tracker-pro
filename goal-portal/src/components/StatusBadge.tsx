import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "approval" | "goal";
  className?: string;
}

const approvalColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  submitted: "bg-blue-50 text-blue-700 border-blue-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const goalColors: Record<string, string> = {
  not_started: "bg-gray-100 text-gray-600 border-gray-200",
  on_track: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
};

const labels: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
  not_started: "Not Started",
  on_track: "On Track",
  completed: "Completed",
};

export function StatusBadge({ status, variant = "approval", className }: StatusBadgeProps) {
  const colors = variant === "approval" ? approvalColors : goalColors;
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
      colors[status] ?? "bg-gray-100 text-gray-600 border-gray-200",
      className
    )}>
      {labels[status] ?? status}
    </span>
  );
}
