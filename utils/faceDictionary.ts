export const FACE_TRANSLATIONS: Record<string, string> = {
  // Caras Simples
  distal: "Cara Distal",
  facial: "Cara Vestibular",
  mesial: "Cara Mesial",
  palatal: "Cara Palatina",
  lingual: "Cara Lingual",
  occlusal: "Cara Oclusal",

  // Raíces
  uniradicular_root: "Raíz",
  distal_root: "Raíz Distal",
  mesial_root: "Raíz Mesial",
  palatal_root: "Raíz Palatina",
  distofacial_root: "Raíz Distovestibular",
  mesiofacial_root: "Raíz Mesiovestibular",

  // Caras Compuestas (Oclusal + ...)
  occlusal_facial: "Cara Oclusal Vestibular",
  occlusal_palatal: "Cara Oclusal Palatina",
  occlusal_lingual: "Cara Oclusal Lingual",

  // Caras Complejas
  occlusal_distopalatal: "Cara Oclusal Distopalatino",
  occlusal_mesiopalatal: "Cara Oclusal Mesiopalatino",
  occlusal_distofacial: "Cara Oclusal Distovestibular",
  occlusal_mesiofacial: "Cara Oclusal Mesiovestibular",
  occlusal_distolingual: "Cara Oclusal Distolingual",
  occlusal_mesiolingual: "Cara Oclusal Mesiolingual",
};

export const translateFace = (faceName: string): string => {
  if (!faceName) return "";

  // El formato esperado es "NUMERO_NOMBRE_DE_CARA" (ej: "14_Occlusal_Facial")
  // 1. Encontrar la posición del primer guion bajo
  const firstUnderscoreIndex = faceName.indexOf("_");

  // Si no hay guion bajo, intentar traducir tal cual (fallback)
  if (firstUnderscoreIndex === -1) {
    const raw = faceName.toLowerCase();
    return FACE_TRANSLATIONS[raw] || faceName;
  }

  // 2. Extraer todo lo que está después del primer guion bajo
  // "14_Occlusal_Facial" -> "Occlusal_Facial"
  const rawName = faceName.substring(firstUnderscoreIndex + 1).toLowerCase();

  return (
    FACE_TRANSLATIONS[rawName] ||
    rawName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
};
