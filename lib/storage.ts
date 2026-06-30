import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const THEME_KEY = "theme";

export const storage = {
  getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },

  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  getTheme(): Promise<string | null> {
    return SecureStore.getItemAsync(THEME_KEY);
  },

  async setTheme(value: string): Promise<void> {
    await SecureStore.setItemAsync(THEME_KEY, value);
  },
};
