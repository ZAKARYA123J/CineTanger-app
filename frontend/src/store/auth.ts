import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  setToken: (token: string) => Promise<void>;
  clearToken: () => Promise<void>;
  hydrateUserId: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set: any) => ({
      token: null,
      userId: null,
      isAuthenticated: false,
      setToken: async (token: string) => {
        await AsyncStorage.setItem("@user_token", token);
        let uid: number | null = null;
        try {
          const decoded: any = jwtDecode(token);
          uid = decoded?.id ?? null;
        } catch {}
        set({ token, userId: uid, isAuthenticated: !!token });
      },
      clearToken: async () => {
        await AsyncStorage.removeItem("@user_token");
        set({ token: null, userId: null, isAuthenticated: false });
      },
      hydrateUserId: () => {
        const t = useAuthStore.getState().token;
        if (!t) return;
        try {
          const decoded: any = jwtDecode(t);
          set({ userId: decoded?.id ?? null });
        } catch {}
      },
    }),
    {
      name: "@auth_store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state: any) => ({
        token: state.token,
        userId: state.userId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
