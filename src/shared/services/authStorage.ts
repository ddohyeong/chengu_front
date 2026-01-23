const TOKEN_KEY = 'auth_token';
const NICKNAME_KEY = 'user_nickname';

export const authStorage = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getNickname: (): string | null => {
    return localStorage.getItem(NICKNAME_KEY);
  },

  setNickname: (nickname: string): void => {
    localStorage.setItem(NICKNAME_KEY, nickname);
  },

  removeNickname: (): void => {
    localStorage.removeItem(NICKNAME_KEY);
  },

  clear: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NICKNAME_KEY);
  },
};
