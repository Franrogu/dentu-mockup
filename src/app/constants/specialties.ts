/**
 * Sistema de colores de especialidades - DentalOS
 * Usado consistentemente en: filas de visitas, tabs de formularios,
 * lista de agenda, filtros de expediente del paciente
 * Todos los colores pasan WCAG AA contrast en fondo blanco
 */

export const specialtyColors = {
  General: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
    full: "bg-gray-100 text-gray-800 border-gray-200",
  },
  Ortodoncia: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-200",
    full: "bg-purple-100 text-purple-800 border-purple-200",
  },
  Endodoncia: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-200",
    full: "bg-orange-100 text-orange-800 border-orange-200",
  },
  Periodoncia: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
    full: "bg-green-100 text-green-800 border-green-200",
  },
  Cirugía: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
    full: "bg-red-100 text-red-800 border-red-200",
  },
  Implantología: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
    full: "bg-blue-100 text-blue-800 border-blue-200",
  },
  Prostodoncia: {
    bg: "bg-indigo-100",
    text: "text-indigo-800",
    border: "border-indigo-200",
    full: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  Odontopediatría: {
    bg: "bg-pink-100",
    text: "text-pink-800",
    border: "border-pink-200",
    full: "bg-pink-100 text-pink-800 border-pink-200",
  },
} as const;

export type SpecialtyName = keyof typeof specialtyColors;

export const getSpecialtyColor = (specialty: string): string => {
  if (specialty in specialtyColors) {
    return specialtyColors[specialty as SpecialtyName].full;
  }
  return specialtyColors.General.full;
};
