import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Item } from '@/shared/types';
import * as itemApi from '../services/itemService';

export const ITEMS_QUERY_KEY = ['items'] as const;

/**
 * 물건 목록 조회
 * GET /api/v1/items
 */
export const useItemsQuery = (enabled = true) => {
  return useQuery<Item[]>({
    queryKey: ITEMS_QUERY_KEY,
    queryFn: itemApi.getItems,
    enabled,
  });
};

/**
 * 물건 저장 (신규 생성 또는 수정)
 * POST /api/v1/items (신규)
 * DELETE + POST (수정 — 백엔드에 PUT 없음)
 */
export const useSaveItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: Item) => itemApi.saveItem(item),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY }),
  });
};

/**
 * 물건 삭제
 * DELETE /api/v1/items
 */
export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => itemApi.deleteItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY }),
  });
};

/**
 * 물건 일괄 등록 (영수증 스캔 등)
 * POST /api/v1/items (배열)
 */
export const useBulkCreateItemsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: Item[]) => itemApi.bulkCreateItems(items),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY }),
  });
};
