import { Badge } from "../../../components/ui/badge";
import { appointmentStatusMeta } from "../bookingUtils";
import type { AppointmentStatus } from "../bookingTypes";

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  const meta = appointmentStatusMeta[status];

  return (
    <Badge variant="outline" className={`rounded-full border text-xs ${meta.badgeClassName}`}>
      {meta.label}
    </Badge>
  );
}
