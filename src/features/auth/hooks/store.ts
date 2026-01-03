import { create } from 'zustand';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  updateTokens: (token: string, refreshToken: string) => void;
}

// 초기화: localStorage에서 토큰을 읽어 Zustand store 초기화
const initialToken = localStorage.getItem('token');
const initialRefreshToken = localStorage.getItem('refresh_token');

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  refreshToken: initialRefreshToken,
  isLoggedIn: !!initialToken,

  login: (token, refreshToken) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refresh_token', refreshToken);
    set({ token, refreshToken, isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    set({ token: null, refreshToken: null, isLoggedIn: false });
  },

  // 토큰 갱신용 (client.ts의 interceptor에서 사용)
  updateTokens: (token, refreshToken) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refresh_token', refreshToken);
    set({ token, refreshToken });
  },
}));

// 인증 상태 selector (최적화된 구독)
export const useIsLoggedIn = () => useAuthStore((state) => state.isLoggedIn);
export const useToken = () => useAuthStore((state) => state.token);

// 컴포넌트에서 사용하는 훅 (기존 API 호환)
export function useAuth() {
  const { login, logout } = useAuthStore();
  return { login, logout };
}
