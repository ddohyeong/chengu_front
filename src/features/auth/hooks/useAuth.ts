import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { authStorage } from '@/shared/services/authStorage';
import { LoginRequest, SignupRequest } from '@/shared/types';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      if (response.success && response.body.accessToken) {
        authStorage.setToken(response.body.accessToken);
        if (response.body.nickname) {
        //   debugger
          authStorage.setNickname(response.body.nickname);
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
