import { useMemo } from 'react';
import { Item } from '@/shared/types';

export const useInventoryStats = (items: Item[]) => {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const threshold = new Date(today);
    threshold.setDate(today.getDate() + 7);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const activeItems = items.filter(i => i.status === 'active');
    const activeWithExpiry = activeItems.filter(i => i.expiryDate);

    const expired = activeWithExpiry
      .filter(i => new Date(i.expiryDate!) < today)
      .sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime());

    const expiringSoon = activeWithExpiry
      .filter(i => {
        const exp = new Date(i.expiryDate!);
        return exp >= today && exp <= threshold;
      })
      .sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime());

    const sellableItems = activeItems.filter(i => new Date(i.purchaseDate) < sixMonthsAgo);

    return { expired, expiringSoon, sellableItems, sellableCount: sellableItems.length };
  }, [items]);
};
