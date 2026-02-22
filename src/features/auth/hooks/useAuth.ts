import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { authStorage } from '@/shared/services/authStorage';
import { LoginRequest, SignupRequest } from '@/shared/types';

// JWT payload를 디코딩해서 memberId를 추출하는 헬퍼 함수
const extractMemberIdFromToken = (token: string): number | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    // 백엔드 JWT claims에서 memberId 필드를 찾음 (sub 또는 memberId)
    const memberId = decoded.memberId ?? decoded.sub;
    return memberId ? Number(memberId) : null;
  } catch {
    return null;
  }
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      if (response.success && response.body.accessToken) {
        const token = response.body.accessToken;
        authStorage.setToken(token);
        if (response.body.nickname) {
          authStorage.setNickname(response.body.nickname);
        }
        // JWT에서 memberId 추출 후 저장
        const memberId = extractMemberIdFromToken(token);
        if (memberId !== null) {
          authStorage.setMemberId(memberId);
        }
        queryClient.invalidateQueries({ queryKey: ['auth'] });
      }
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: SignupRequest) => authService.signup(data),
  });

  const logout = () => {
    authStorage.clear();
    queryClient.clear();
  };

  const isAuthenticated = () => {
    return !!authStorage.getToken();
  };

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    signup: signupMutation.mutate,
    signupAsync: signupMutation.mutateAsync,
    isSigningUp: signupMutation.isPending,
    signupError: signupMutation.error,
    logout,
    isAuthenticated,
  };
};
