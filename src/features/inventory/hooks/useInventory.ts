import { useState, useEffect, useCallback } from 'react';
import { Item, Location } from '@/shared/types';
import * as storageApi from '../services/storageService';
import * as itemApi from '../services/itemService';

interface UseInventoryOptions {
  isLoggedIn: boolean;
  userNickname: string;
}

export const useInventory = ({ isLoggedIn, userNickname }: UseInventoryOptions) => {
  const [items, setItems] = useState<Item[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [activeLocId, setActiveLocId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // 서버에서 보관함 + 물건 데이터를 새로 불러오는 함수
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedLocations, fetchedItems] = await Promise.all([
        storageApi.getStorages(),
        itemApi.getItems(),
      ]);
      setLocations(fetchedLocations);
      setItems(fetchedItems);
      setActiveLocId((prev) => {
        if (!prev && fetchedLocations.length > 0) return fetchedLocations[0].id;
        return prev;
      });
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 로그인 상태 변화 시 데이터 로드 / 초기화
  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    } else {
      setItems([]);
      setLocations([]);
      setActiveLocId('');
    }
  }, [isLoggedIn]);

  const saveItem = async (item: Item) => {
    try {
      await itemApi.saveItem({ ...item, userNickname: userNickname || undefined });
      await loadData();
    } catch (error) {
      console.error('물건 저장 실패:', error);
    }
  };

  const deleteItem = async (id: string) => {
    if (confirm('정말로 이 물건을 삭제할까요?')) {
      try {
        await itemApi.deleteItem(id);
        await loadData();
      } catch (error) {
        console.error('물건 삭제 실패:', error);
      }
    }
  };

  const saveLocation = async (loc: Location) => {
    try {
      const isExistingBackendLoc = /^\d+$/.test(loc.id);
      if (isExistingBackendLoc) {
        await storageApi.updateStorage(loc);
      } else {
        await storageApi.createStorage(loc);
      }
      await loadData();
    } catch (error) {
      console.error('보관함 저장 실패:', error);
    }
  };

  const deleteLocation = async (id: string) => {
    if (confirm('장소를 삭제하면 안의 물건들도 함께 삭제됩니다. 계속할까요?')) {
      try {
        await storageApi.deleteStorage(id);
        // 삭제된 장소가 현재 활성 장소였다면 초기화
        if (activeLocId === id) {
          const remaining = locations.filter((l) => l.id !== id);
          setActiveLocId(remaining.length > 0 ? remaining[0].id : '');
        }
        await loadData();
      } catch (error) {
        console.error('보관함 삭제 실패:', error);
      }
    }
  };

  const bulkAddItems = async (newItems: Item[]) => {
    try {
      const itemsWithNickname = newItems.map((item) => ({
        ...item,
        userNickname: userNickname || undefined,
      }));
      await itemApi.bulkCreateItems(itemsWithNickname);
      await loadData();
    } catch (error) {
      console.error('물건 일괄 등록 실패:', error);
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
