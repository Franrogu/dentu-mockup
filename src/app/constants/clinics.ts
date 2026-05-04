/**
 * Sistema de colores de clínicas - DentalOS
 * Usado SOLO en contextos multi-clínica consolidados
 * Cuando se ve una sola clínica, se usa el teal de marca normal
 */

export const clinicColors = {
  teal: {
    hex: "#0F5F6D",
    bg: "bg-[#0F5F6D]/15",
    text: "text-[#0F5F6D]",
    border: "border-[#0F5F6D]",
    borderLeft: "border-l-[#0F5F6D]",
    dot: "bg-[#0F5F6D]",
  },
  violet: {
    hex: "#6B46C1",
    bg: "bg-[#6B46C1]/15",
    text: "text-[#6B46C1]",
    border: "border-[#6B46C1]",
    borderLeft: "border-l-[#6B46C1]",
    dot: "bg-[#6B46C1]",
  },
  amber: {
    hex: "#B45309",
    bg: "bg-[#B45309]/15",
    text: "text-[#B45309]",
    border: "border-[#B45309]",
    borderLeft: "border-l-[#B45309]",
    dot: "bg-[#B45309]",
  },
  rose: {
    hex: "#BE185D",
    bg: "bg-[#BE185D]/15",
    text: "text-[#BE185D]",
    border: "border-[#BE185D]",
    borderLeft: "border-l-[#BE185D]",
    dot: "bg-[#BE185D]",
  },
  cyan: {
    hex: "#0E7490",
    bg: "bg-[#0E7490]/15",
    text: "text-[#0E7490]",
    border: "border-[#0E7490]",
    borderLeft: "border-l-[#0E7490]",
    dot: "bg-[#0E7490]",
  },
  emerald: {
    hex: "#065F46",
    bg: "bg-[#065F46]/15",
    text: "text-[#065F46]",
    border: "border-[#065F46]",
    borderLeft: "border-l-[#065F46]",
    dot: "bg-[#065F46]",
  },
} as const;

export type ClinicColorKey = keyof typeof clinicColors;

export const clinicColorOptions = [
  { key: "teal" as const, name: "Teal", hex: "#0F5F6D" },
  { key: "violet" as const, name: "Violet", hex: "#6B46C1" },
  { key: "amber" as const, name: "Amber", hex: "#B45309" },
  { key: "rose" as const, name: "Rose", hex: "#BE185D" },
  { key: "cyan" as const, name: "Cyan", hex: "#0E7490" },
  { key: "emerald" as const, name: "Emerald", hex: "#065F46" },
];

export const getClinicColor = (colorKey: string) => {
  if (colorKey in clinicColors) {
    return clinicColors[colorKey as ClinicColorKey];
  }
  return clinicColors.teal; // default
};

export interface Clinic {
  id: number;
  name: string;
  colorKey: ClinicColorKey;
  dentistCount?: number;
  appointmentsToday?: number;
}
