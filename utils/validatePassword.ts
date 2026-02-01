export const validatePassword = (
  password: string,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Al menos 8 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Al menos 1 mayúscula");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Al menos 1 minúscula");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Al menos 1 número");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Al menos 1 carácter especial");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
