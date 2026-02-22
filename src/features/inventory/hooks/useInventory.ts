import { useState, useEffect } from 'react';
import { Item, Location } from '@/shared/types';
import {
  useStoragesQuery,
  useCreateStorageMutation,
  useUpdateStorageMutation,
  useDeleteStorageMutation,
} from './useStoragesQuery';
import {
  useItemsQuery,
  useSaveItemMutation,
  useDeleteItemMutation,
  useBulkCreateItemsMutation, useUpdateItemMutation,
} from './useItemsQuery';

interface UseInventoryOptions {
  isLoggedIn: boolean;
  userNickname: string;
}

export const useInventory = ({ isLoggedIn, userNickname }: UseInventoryOptions) => {
  const [activeLocId, setActiveLocId] = useState<string>('');

  // ── 데이터 조회 (React Query) ────────────────────────────────
  const { data: locations = [], isLoading: locationsLoading } = useStoragesQuery(isLoggedIn);
  const { data: items = [], isLoading: itemsLoading } = useItemsQuery(isLoggedIn);
  const isLoading = locationsLoading || itemsLoading;

  // 로그아웃 시 UI 상태 초기화
  useEffect(() => {
    if (!isLoggedIn) {
      setActiveLocId('');
    }
  }, [isLoggedIn]);

  // 보관함 목록이 처음 로드됐을 때 첫 번째 장소를 활성화
  useEffect(() => {
    if (locations.length > 0 && !activeLocId) {
      setActiveLocId(locations[0].id);
    }
  }, [locations, activeLocId]);

  // ── 물건 뮤테이션 ──────────────────────────────────────────
  const saveItemMutation = useSaveItemMutation();
  const updateItemMutation = useUpdateItemMutation()
  const deleteItemMutation = useDeleteItemMutation();
  const bulkCreateMutation = useBulkCreateItemsMutation();

  const saveItem = async (item: Item) => {
    try {
      // ID 존재 여부에 따라 다른 Mutation 호출
      // ID 가 존재하지 않으면 날짜를 넣는등 패턴이 존재하기에 해당 로직 가능
      if (/^\d+$/.test(item.id)) {
        // ID가 있으면 이미 존재하는 물건 -> 수정(Update)
        await updateItemMutation.mutateAsync({ ...item, userNickname: userNickname || undefined });
      } else {
        // ID가 없으면 새로운 물건 -> 생성(Create)
        await saveItemMutation.mutateAsync({ ...item, userNickname: userNickname || undefined });
      }


    } catch (error) {
      console.error('물건 저장 실패:', error);
    }
  };

  const deleteItem = async (id: string) => {
    if (confirm('정말로 이 물건을 삭제할까요?')) {
      try {
        await deleteItemMutation.mutateAsync(id);
      } catch (error) {
        console.error('물건 삭제 실패:', error);
      }
    }
  };

  const bulkAddItems = async (newItems: Item[]) => {
    try {
      const itemsWithNickname = newItems.map((item) => ({
        ...item,
        userNickname: userNickname || undefined,
      }));
      await bulkCreateMutation.mutateAsync(itemsWithNickname);
    } catch (error) {
      console.error('물건 일괄 등록 실패:', error);
    }
  };

  // ── 보관함 뮤테이션 ────────────────────────────────────────
  const createStorageMutation = useCreateStorageMutation();
  const updateStorageMutation = useUpdateStorageMutation();
  const deleteStorageMutation = useDeleteStorageMutation();

  const saveLocation = async (loc: Location) => {
    try {
      const isExistingBackendLoc = /^\d+$/.test(loc.id);
      if (isExistingBackendLoc) {
        await updateStorageMutation.mutateAsync(loc);
      } else {
        await createStorageMutation.mutateAsync(loc);
      }
    } catch (error) {
      console.error('보관함 저장 실패:', error);
    }
  };

  const deleteLocation = async (id: string) => {
    if (confirm('장소를 삭제하면 안의 물건들도 함께 삭제됩니다. 계속할까요?')) {
      try {
        // 삭제될 장소가 현재 활성 장소면 다른 장소로 전환
        if (activeLocId === id) {
          const remaining = locations.filter((l) => l.id !== id);
          setActiveLocId(remaining.length > 0 ? remaining[0].id : '');
        }
        await deleteStorageMutation.mutateAsync(id);
      } catch (error) {
        console.error('보관함 삭제 실패:', error);
      }
    }
  };

  return {
    items,
    locations,
    activeLocId,
    setActiveLocId,
    saveItem,
    deleteItem,
    saveLocation,
    deleteLocation,
    bulkAddItems,
    isLoading,
  };
};
