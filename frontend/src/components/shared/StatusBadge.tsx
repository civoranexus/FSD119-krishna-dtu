import { cn } from "@/lib/utils";

type Status = "scheduled" | "confirmed" | "cancelled" | "completed" | "pending";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "status-pending" },
  pending: { label: "Pending", className: "status-pending" },
  confirmed: { label: "Confirmed", className: "status-confirmed" },
  cancelled: { label: "Cancelled", className: "status-cancelled" },
  completed: { label: "Completed", className: "status-completed" },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span className={cn("status-badge", config.className, className)}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
