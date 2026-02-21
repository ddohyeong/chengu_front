import { AlertCircle, Timer } from 'lucide-react';
import { Item, Location } from '@/shared/types';
import { Header } from '@/shared/components/Header';
import { ChaengguAvatar } from '@/shared/components/ChaengguAvatar';
import { ExpiringItemCard } from '../ExpiringItemCard';
import { useInventoryStats } from '../../hooks/useInventoryStats';

interface ExpiringViewProps {
  items: Item[];
  locations: Location[];
  onBack: () => void;
  onEditItem: (item: Item) => void;
  onDeleteItem: (id: string) => void;
}

export const ExpiringView = ({
  items,
  locations,
  onBack,
  onEditItem,
  onDeleteItem,
}: ExpiringViewProps) => {
  const { expired, expiringSoon } = useInventoryStats(items);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <Header
        title="유통기한 관리"
        subtitle="부지런히 써야 할 물건들이에요!"
        onBack={onBack}
      />
      <div className="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar space-y-8">
        {expired.length > 0 && (
          <section>
            <h3 className="text-rose-600 font-bold mb-3 ml-1 flex items-center gap-2">
              <AlertCircle size={18} />
              이미 만료되었어요 ({expired.length})
            </h3>
            <div className="space-y-3">
              {expired.map(item => (
                <ExpiringItemCard
                  key={item.id}
                  item={item}
                  locations={locations}
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                />
              ))}
            </div>
          </section>
        )}

        {expiringSoon.length > 0 && (
          <section>
            <h3 className="text-amber-600 font-bold mb-3 ml-1 flex items-center gap-2">
              <Timer size={18} />
              곧 만료 예정이에요 ({expiringSoon.length})
            </h3>
            <div className="space-y-3">
              {expiringSoon.map(item => (
                <ExpiringItemCard
                  key={item.id}
                  item={item}
                  locations={locations}
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                />
              ))}
            </div>
          </section>
        )}

        {expired.length === 0 && expiringSoon.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 opacity-60">
            <ChaengguAvatar size={80} mood="happy" className="mb-4 grayscale opacity-50" />
            <p className="text-slate-900 font-bold">모든 물건이 안전합니다!</p>
            <p className="text-xs text-slate-500 mt-1">유통기한이 넉넉하거나 잘 관리되고 있어요.</p>
          </div>
        )}
      </div>
    </div>
  );
};
