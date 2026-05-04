import { getClinicColor, type ClinicColorKey } from "../constants/clinics";
import { cn } from "./ui/utils";

interface ClinicBadgeProps {
  clinicName: string;
  colorKey: ClinicColorKey;
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
  className?: string;
}

export function ClinicBadge({
  clinicName,
  colorKey,
  size = "md",
  showDot = false,
  className,
}: ClinicBadgeProps) {
  const colors = getClinicColor(colorKey);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  if (showDot) {
    return (
      <span className={cn("inline-flex items-center gap-1.5", className)}>
        <span className={cn("w-2 h-2 rounded-full", colors.dot)} />
        <span className="text-sm text-gray-700">{clinicName}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-medium",
        colors.bg,
        colors.text,
        colors.border,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn("w-2 h-2 rounded-sm", colors.dot)} />
      {clinicName}
    </span>
  );
}

interface ClinicDotsProps {
  clinics?: Array<{ name: string; colorKey: ClinicColorKey }>;
  colorKey?: ClinicColorKey;
  className?: string;
}

export function ClinicDots({ clinics, colorKey, className }: ClinicDotsProps) {
  // Support both single dot or multiple dots
  if (colorKey) {
    const colors = getClinicColor(colorKey);
    return (
      <div
        className={cn("w-2.5 h-2.5 rounded-full inline-block", colors.dot, className)}
      />
    );
  }

  if (!clinics || clinics.length === 0) return null;

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {clinics.map((clinic, index) => {
        const colors = getClinicColor(clinic.colorKey);
        return (
          <div
            key={index}
            className={cn("w-2.5 h-2.5 rounded-full", colors.dot)}
            title={clinic.name}
          />
        );
      })}
    </div>
  );
}