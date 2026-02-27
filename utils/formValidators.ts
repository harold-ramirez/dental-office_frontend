/**
 * Form Validators - Utilidades para validación de formularios
 */

export const validateDate = (dateString: string): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const validateAge = (birthDate: string): number | null => {
  try {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    // Validar que sea un edad razonable (0-150 años)
    if (age < 0 || age > 150) return null;
    return age;
  } catch {
    return null;
  }
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const trimFormData = <T extends Record<string, any>>(formData: T): T => {
  const trimmed = { ...formData } as Record<string, unknown>;
  Object.keys(trimmed).forEach((key) => {
    if (typeof trimmed[key] === "string") {
      trimmed[key] = (trimmed[key] as string).trim();
    }
  });
  return trimmed as T;
};
