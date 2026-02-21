import { Plus, Settings } from 'lucide-react';
import { Item, Location } from '@/shared/types';
import { Header } from '@/shared/components/Header';
import { ChaengguAvatar } from '@/shared/components/ChaengguAvatar';
import { ItemCard } from '../ItemCard';

interface LocationsViewProps {
  locations: Location[];
  items: Item[];
  activeLocId: string;
  onSelectLocation: (id: string) => void;
  onAddItem: (locId?: string) => void;
  onEditItem: (item: Item) => void;
  onDeleteItem: (id: string) => void;
  onAddLocation: () => void;
  onEditLocation: (loc: Location) => void;
  onDeleteLocation: (id: string) => void;
  onSellItem: (item: Item) => void;
  onBack: () => void;
}

export const LocationsView = ({
  locations,
  items,
  activeLocId,
  onSelectLocation,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onAddLocation,
  onEditLocation,
  onDeleteLocation,
  onSellItem,
  onBack,
}: LocationsViewProps) => {
  const activeLocation = locations.find(l => l.id === activeLocId);
  const locationItems = items.filter(i => i.locationId === activeLocId && i.status === 'active');

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <Header
        title="보관함"
        subtitle="어디에 무엇이 있나 볼까요?"
        onBack={onBack}
        action={
          <button
            onClick={onAddLocation}
            className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-200"
          >
            <Plus size={18} />
          </button>
        }
      />

      <div className="bg-white border-b border-slate-100">
        <div className="flex overflow-x-auto p-4 gap-3 no-scrollbar">
          {locations.map(loc => {
            const isActive = loc.id === activeLocId;
            return (
              <button
                key={loc.id}
                onClick={() => onSelectLocation(loc.id)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-200'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <span>{loc.icon}</span>
                <span className="font-bold text-sm">{loc.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3 pb-24 no-scrollbar">
        {activeLocation && (
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-xs font-bold text-slate-400 uppercase">
              총 {locationItems.length}개의 물건
            </span>
            <button
              onClick={() => onEditLocation(activeLocation)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <Settings size={12} /> 설정
            </button>
          </div>
        )}

        {locationItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <ChaengguAvatar size={80} mood="working" className="mb-4 grayscale opacity-50" />
            <p className="text-slate-900 font-bold">여기는 텅 비어있어요</p>
            <p className="text-xs text-slate-500 mt-1">새로운 물건을 채워볼까요?</p>
          </div>
        ) : (
          locationItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
              onSell={onSellItem}
            />
          ))
        )}
      </div>
    </div>
  );
};
