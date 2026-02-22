const TOKEN_KEY = 'auth_token';
const NICKNAME_KEY = 'user_nickname';
const MEMBER_ID_KEY = 'member_id';

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

  getMemberId: (): number | null => {
    const id = localStorage.getItem(MEMBER_ID_KEY);
    return id ? Number(id) : null;
  },

  setMemberId: (memberId: number): void => {
    localStorage.setItem(MEMBER_ID_KEY, String(memberId));
  },

  removeMemberId: (): void => {
    localStorage.removeItem(MEMBER_ID_KEY);
  },

  clear: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NICKNAME_KEY);
    localStorage.removeItem(MEMBER_ID_KEY);
  },
};
