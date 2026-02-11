import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon, description, trend, className }: StatCardProps) => {
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {icon && <span className="text-primary">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-foreground">{value}</span>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium",
              trend.positive ? "text-success" : "text-destructive"
            )}
          >
            {trend.positive ? "+" : ""}{trend.value}
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default StatCard;
