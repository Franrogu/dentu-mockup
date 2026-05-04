import type { LucideIcon } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import { cn } from "../../../components/ui/utils";
import { getClinicColor } from "../../../constants/clinics";
import { paymentStatusMeta, visitStatusMeta } from "../visit-utils";
import type { PaymentStatus, VisitMockClinic, VisitStatus } from "../visits.mock";

export function VisitStatusBadge({ status }: { status: VisitStatus }) {
  const meta = visitStatusMeta[status];

  return (
    <Badge variant="outline" className={cn("rounded-full px-2.5 py-1 text-xs", meta.className)}>
      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", meta.dotClassName)} />
      {meta.label}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const meta = paymentStatusMeta[status];

  return (
    <Badge variant="outline" className={cn("rounded-full px-2.5 py-1 text-xs", meta.className)}>
      {meta.label}
    </Badge>
  );
}

export function VisitClinicBadge({ clinic }: { clinic: VisitMockClinic }) {
  const colors = getClinicColor(clinic.colorKey);

  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-2.5 py-1 text-xs", colors.bg, colors.text, colors.border)}
    >
      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", colors.dot)} />
      {clinic.name}
    </Badge>
  );
}

export function SummaryMetricCard({
  title,
  value,
  icon: Icon,
  accentClassName,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accentClassName: string;
}) {
  return (
    <Card className="rounded-2xl border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", accentClassName)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
}

const odontogramRows = [
  ["18", "17", "16", "15", "14", "13", "12", "11"],
  ["41", "42", "43", "44", "45", "46", "47", "48"],
];

export function MiniOdontogramPreview({
  highlightedTeeth = [],
  label,
  compact = false,
}: {
  highlightedTeeth?: string[];
  label?: string;
  compact?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-3">
        {odontogramRows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-8 gap-1">
            {row.map((tooth) => {
              const isHighlighted = highlightedTeeth.includes(tooth);

              return (
                <div
                  key={tooth}
                  className={cn(
                    "flex items-center justify-center rounded-md border text-[10px] font-medium",
                    compact ? "h-6" : "h-7",
                    isHighlighted
                      ? "border-teal-200 bg-teal-50 text-[#0F5F6D]"
                      : "border-gray-200 bg-gray-50 text-gray-400",
                  )}
                >
                  {tooth}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {label ? <p className="text-xs text-gray-500">{label}</p> : null}
    </div>
  );
}
