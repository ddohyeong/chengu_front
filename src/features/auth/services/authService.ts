import { apiClient } from '@/shared/services/apiClient';
import { ApiResponse, LoginRequest, LoginResponse, SignupRequest } from '@/shared/types';

export const authService = {
  signup: async (data: SignupRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/member/signup', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/member/login', data);
    return response.data;
  },
};
