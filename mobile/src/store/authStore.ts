import { create } from "zustand";
import { saveTokens, clearTokens, getTokens } from "../utils/tokens";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  isLoading: boolean;
  setTokens: (access: string, refresh: string, userId: string) => Promise<void>;
  loadTokens: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  userId: null,
  isLoading: true,

  setTokens: async (access, refresh, userId) => {
    await saveTokens(access, refresh);
    set({ accessToken: access, refreshToken: refresh, userId });
  },

  loadTokens: async () => {
    const { accessToken, refreshToken } = await getTokens();
    set({ accessToken, refreshToken, isLoading: false });
  },

  logout: async () => {
    await clearTokens();
    set({ accessToken: null, refreshToken: null, userId: null });
  },
}));
