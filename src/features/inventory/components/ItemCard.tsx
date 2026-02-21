import { Calendar, Trash2, AlertCircle, ShoppingBag, Pencil } from 'lucide-react';
import { Item } from '@/shared/types';
import { Badge } from '@/shared/components/Badge';
import { CATEGORY_ICONS, CATEGORY_STYLES, CATEGORY_LABELS } from '@/shared/constants/inventory';

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onSell: (item: Item) => void;
}

export const ItemCard = ({ item, onEdit, onDelete, onSell }: ItemCardProps) => {
  const isExpiring =
    item.expiryDate &&
    new Date(item.expiryDate) <= new Date(new Date().setDate(new Date().getDate() + 7));

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] flex gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${CATEGORY_STYLES[item.category]}`}>
        {CATEGORY_ICONS[item.category]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-slate-900 truncate">{item.name}</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {CATEGORY_LABELS[item.category]} {item.subCategory && `> ${item.subCategory}`}
            </p>
          </div>
          {isExpiring && (
            <Badge className="bg-rose-100 text-rose-600 flex items-center gap-1">
              <AlertCircle size={10} /> 임박
            </Badge>
          )}
        </div>

        <div className="mt-3 flex items-center gap-4 flex-wrap">
          {item.userNickname && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
              <span>👤 {item.userNickname}</span>
            </div>
          )}
          {item.expiryDate && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar size={12} />
              <span>~{item.expiryDate.slice(2)}</span>
            </div>
          )}
          {item.discardDate && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Trash2 size={12} className="text-slate-400" />
              <span>폐기: {item.discardDate.slice(2)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-l border-slate-50 pl-3 justify-center">
        <button
          onClick={() => onEdit(item)}
          className="p-2 text-slate-300 hover:text-slate-600 rounded-lg hover:bg-slate-50"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onSell(item)}
          className="p-2 text-slate-300 hover:text-blue-500 rounded-lg hover:bg-blue-50"
        >
          <ShoppingBag size={16} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
