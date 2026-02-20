import Constants from "expo-constants";
import { authService } from "./authService";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

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
    const error = new Error(`API error: ${response.status}`);
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
}
