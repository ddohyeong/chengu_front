import { useState, useEffect } from 'react';
import { Item, Location } from '@/shared/types';
import * as Storage from '@/shared/services/storageService';

interface UseInventoryOptions {
  isLoggedIn: boolean;
  userNickname: string;
}

export const useInventory = ({ isLoggedIn, userNickname }: UseInventoryOptions) => {
  const [items, setItems] = useState<Item[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [activeLocId, setActiveLocId] = useState<string>('');

  const refreshData = () => {
    const locs = Storage.getLocations();
    setLocations(locs);
    setItems(Storage.getItems());
    if (locs.length > 0 && !activeLocId) {
      setActiveLocId(locs[0].id);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      const loadedLocations = Storage.getLocations();
      setLocations(loadedLocations);
      setItems(Storage.getItems());
      if (loadedLocations.length > 0 && !activeLocId) {
        setActiveLocId(loadedLocations[0].id);
      }
    }
  }, [isLoggedIn]);

  const saveItem = (item: Item) => {
    Storage.saveItem({ ...item, userNickname: userNickname || undefined });
    refreshData();
  };

  const deleteItem = (id: string) => {
    if (confirm('정말로 이 물건을 삭제할까요?')) {
      Storage.deleteItem(id);
      refreshData();
    }
  };

  const saveLocation = (loc: Location) => {
    Storage.saveLocation(loc);
    refreshData();
  };

  const deleteLocation = (id: string) => {
    if (confirm('장소를 삭제하면 안의 물건들도 함께 삭제됩니다. 계속할까요?')) {
      Storage.deleteLocation(id);
      const remaining = Storage.getLocations();
      setLocations(remaining);
      setItems(Storage.getItems());
      if (remaining.length > 0) setActiveLocId(remaining[0].id);
      else setActiveLocId('');
    }
  };

  const bulkAddItems = (newItems: Item[]) => {
    newItems.forEach(item =>
      Storage.saveItem({ ...item, userNickname: userNickname || undefined })
    );
    refreshData();
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
  };
};
