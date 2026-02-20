import { SplashScreen, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  token: string | null;
  logIn: (token: string) => void;
  logOut: () => void;
};

const tokenStorageKey = "auth-token";

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isReady: false,
  token: null,
  logIn: () => {},
  logOut: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const logIn = async (authToken: string) => {
    try {
      await SecureStore.setItemAsync(tokenStorageKey, authToken);
      setIsLoggedIn(true);
      setToken(authToken);
      console.log("JWT: [", authToken, "]");
      router.replace("/");
    } catch (error) {
      console.log("Error storing auth state:", error);
    }
  };

  const logOut = async () => {
    try {
      await SecureStore.deleteItemAsync(tokenStorageKey);
      setIsLoggedIn(false);
      setToken(null);
      router.replace("/login");
    } catch (error) {
      console.log("Error clearing auth state:", error);
    }
  };

  useEffect(() => {
    const getAuthFromStorage = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(tokenStorageKey);
        if (storedToken) {
          const res = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/auth/validate`,
            {
              headers: { Authorization: `Bearer ${storedToken}` },
            },
          );

          if (!res.ok) {
            await SecureStore.deleteItemAsync(tokenStorageKey);
            setIsLoggedIn(false);
            setToken(null);
          } else {
            setToken(storedToken);
            console.log("JWT: [", storedToken, "]");
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.log("Error retrieving auth state:", error);
      }
      setIsReady(true);
    };
    getAuthFromStorage();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <AuthContext.Provider
      value={{
        isReady,
        isLoggedIn,
        token,
        logIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
