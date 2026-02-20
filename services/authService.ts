import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
// const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("El usuario y/o la contraseña son incorrectos");
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch {
      throw new Error("El usuario y/o la contraseña son incorrectos");
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync("auth-token");
    } catch {
      return null;
    }
  },
};
