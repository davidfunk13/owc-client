const TOKEN_KEY = "auth_token";
const THEME_KEY = "theme";

export const storage = {
  async getToken(): Promise<string | null> {
    return localStorage.getItem(TOKEN_KEY);
  },

  async setToken(token: string): Promise<void> {
    localStorage.setItem(TOKEN_KEY, token);
  },

  async removeToken(): Promise<void> {
    localStorage.removeItem(TOKEN_KEY);
  },

  async getTheme(): Promise<string | null> {
    return localStorage.getItem(THEME_KEY);
  },

  async setTheme(value: string): Promise<void> {
    localStorage.setItem(THEME_KEY, value);
  },
};
