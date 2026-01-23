import { useMemo } from 'react';
import { MapPin, Calendar, AlertCircle, Timer, Pencil, Trash2 } from 'lucide-react';
import { Item, Location } from '@/shared/types';
import { Header } from '@/shared/components/Header';
import { ChaengguAvatar } from '@/shared/components/ChaengguAvatar';
import { Badge } from '@/shared/components/Badge';
import { CATEGORY_ICONS, CATEGORY_STYLES } from '@/shared/constants/inventory';

export const ExpiringView = ({
  items,
  locations,
  onBack,
  onEditItem,
  onDeleteItem
}: {
  items: Item[],
  locations: Location[],
  onBack: () => void,
  onEditItem: (item: Item) => void,
  onDeleteItem: (id: string) => void
}) => {
  const { expired, expiringSoon } = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const threshold = new Date(today);
    threshold.setDate(today.getDate() + 7);
    
    const activeItems = items.filter(i => i.status === 'active' && i.expiryDate);
    
    return {
      expired: activeItems.filter(i => new Date(i.expiryDate!) < today)
        .sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime()),
      expiringSoon: activeItems.filter(i => {
        const exp = new Date(i.expiryDate!);
        return exp >= today && exp <= threshold;
      }).sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime())
    };
  }, [items]);

  const ItemCard = ({ item }: { item: Item }) => {
    const loc = locations.find(l => l.id === item.locationId);
    const isExpired = new Date(item.expiryDate!) < new Date();

    return (
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${CATEGORY_STYLES[item.category]}`}>
          {CATEGORY_ICONS[item.category]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-slate-900 truncate">{item.name}</h4>
            <Badge className={`${isExpired ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
               {isExpired ? '만료됨' : '임박'}
            </Badge>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
            {item.userNickname && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                <span>👤 {item.userNickname}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <MapPin size={12} className="text-slate-300" />
              {loc?.icon} {loc?.name}
            </div>
            <div className={`flex items-center gap-1 text-[11px] font-bold ${isExpired ? 'text-rose-500' : 'text-amber-600'}`}>
              <Calendar size={12} />
              ~{item.expiryDate}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 border-l pl-2">
           <button onClick={() => onEditItem(item)} className="p-2 text-slate-300 hover:text-slate-600"><Pencil size={16} /></button>
           <button onClick={() => onDeleteItem(item.id)} className="p-2 text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button>
        </div>
      </div>
    );
  };

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
                <ItemCard key={item.id} item={item} />
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
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {expired.length === 0 && expiringSoon.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 opacity-60">
             <ChaengguAvatar size={80} mood="happy" className="mb-4 grayscale opacity-50"/>
             <p className="text-slate-900 font-bold">모든 물건이 안전합니다!</p>
             <p className="text-xs text-slate-500 mt-1">유통기한이 넉넉하거나 잘 관리되고 있어요.</p>
          </div>
        )}
      </div>
    </div>
  );
};
