import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Location } from '@/shared/types';
import * as storageApi from '../services/storageService';
import { ITEMS_QUERY_KEY } from './useItemsQuery';

export const STORAGES_QUERY_KEY = ['storages'] as const;

/**
 * 보관함 목록 조회
 * GET /api/v1/storages
 */
export const useStoragesQuery = (enabled = true) => {
  return useQuery<Location[]>({
    queryKey: STORAGES_QUERY_KEY,
    queryFn: storageApi.getStorages,
    enabled,
  });
};

/**
 * 보관함 생성
 * POST /api/v1/storages
 */
export const useCreateStorageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loc: Location) => storageApi.createStorage(loc),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STORAGES_QUERY_KEY }),
  });
};

/**
 * 보관함 수정
 * PUT /api/v1/storages/{storageId}
 */
export const useUpdateStorageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loc: Location) => storageApi.updateStorage(loc),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STORAGES_QUERY_KEY }),
  });
};

/**
 * 보관함 삭제
 * DELETE /api/v1/storages/{storageId}
 * 보관함 삭제 시 내부 물건도 함께 삭제되므로 items도 무효화
 */
export const useDeleteStorageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => storageApi.deleteStorage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STORAGES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
    },
  });
};
