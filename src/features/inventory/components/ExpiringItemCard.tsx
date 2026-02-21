import { MapPin, Calendar, Pencil, Trash2 } from 'lucide-react';
import { Item, Location } from '@/shared/types';
import { Badge } from '@/shared/components/Badge';
import { CATEGORY_ICONS, CATEGORY_STYLES } from '@/shared/constants/inventory';

interface ExpiringItemCardProps {
  item: Item;
  locations: Location[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export const ExpiringItemCard = ({ item, locations, onEdit, onDelete }: ExpiringItemCardProps) => {
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
        <button onClick={() => onEdit(item)} className="p-2 text-slate-300 hover:text-slate-600">
          <Pencil size={16} />
        </button>
        <button onClick={() => onDelete(item.id)} className="p-2 text-slate-300 hover:text-rose-500">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
