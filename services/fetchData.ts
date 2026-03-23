import Constants from "expo-constants";
import { authService } from "./authService";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const SPANISH_TRANSLATIONS: { [key: string]: string } = {
  "appointment conflict": "Existe una cita en ese horario.",
  "conflicts with existing appointment": "Esta cita choca con otra existente.",
  "overlaps with existing appointment":
    "Esta cita se superpone con otra existente.",
  "appointment overlaps another one":
    "Esta cita se superpone con otra existente.",
  "time conflict": "Existe un conflicto de horario.",
  "appointment already exists": "Ya existe una cita en ese momento.",
};

function translateMessage(message: string): string {
  const lowerMessage = message.toLowerCase();
  for (const [english, spanish] of Object.entries(SPANISH_TRANSLATIONS)) {
    if (lowerMessage.includes(english)) {
      return spanish;
    }
  }
  return message;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object") {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim() !== "") {
      if (!message.startsWith("API error:")) return translateMessage(message);
    }
    const status = (error as { status?: number }).status;
    if (status === 400) return "Datos invalidos. Verifique los campos.";
    if (status === 401 || status === 403)
      return "No tiene permisos para esta accion.";
    if (status === 404) return "Recurso no encontrado.";
    if (status === 409) return "Existe un conflicto con los datos.";
    if (typeof status === "number" && status >= 500)
      return "Error del servidor. Intente mas tarde.";
  }
  return fallback;
}

export async function fetchWithToken(
  url: string,
  options: RequestInit = {},
  onUnauthorized?: () => void,
) {
  const token = await authService.getToken();
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData))
    headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    if (response.status === 401) {
      onUnauthorized?.();
    }
    let errorMessage = `API error: ${response.status}`;
    try {
      const contentType = response.headers.get("Content-Type") || "";
      if (contentType.includes("application/json")) {
        const body = await response.json();
        if (body?.message && typeof body.message === "string") {
          errorMessage = body.message;
        }
      } else {
        const text = await response.text();
        if (text.trim() !== "") errorMessage = text;
      }
    } catch {
      // Keep default errorMessage
    }
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
}
