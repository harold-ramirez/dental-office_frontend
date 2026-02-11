export const STATUS_COLORS: Record<string, string> = {
  white: "#FFFFFF", // Default/Clean
  black: "#606060", // Gris oscuro para que se note el relieve del diente
  green: "#00E676", // Verde vivo (tipo Green Accent)
  blue: "#1d4ed8", // Blue-700 (Mantenido)
  red: "#FF1744", // Rojo vivo (tipo Red Accent)
};

export const STATUS_DESCRIPTIONS: Record<string, string> = {
  white: "Sano",
  black: "Diente Ausente", // Coincide con el gris oscuro visual
  green: "Prótesis Maladaptada",
  blue: "Implante",
  red: "Caries / LC",
};

export const getStatusDescription = (status: string | undefined): string => {
  if (!status) return "";
  return STATUS_DESCRIPTIONS[status.toLowerCase()] || "";
};

export const getStatusColor = (status: string | undefined): string | null => {
  if (!status || status === "white") return null; // Use default material
  return STATUS_COLORS[status.toLowerCase()] || STATUS_COLORS.red; // Fallback
};
