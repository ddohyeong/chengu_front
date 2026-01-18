import React from 'react';
import { Plus, Settings, Calendar, Trash2, AlertCircle, ShoppingBag, Pencil } from 'lucide-react';
import { Item, Location } from '@/shared/types';
import { Header } from '@/shared/components/Header';
import { ChaengguAvatar } from '@/shared/components/ChaengguAvatar';
import { Badge } from '@/shared/components/Badge';
import { CATEGORY_ICONS, CATEGORY_STYLES, CATEGORY_LABELS } from '@/shared/constants/inventory';

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
  onSellItem
}: { 
  locations: Location[], 
  items: Item[], 
  activeLocId: string,
  onSelectLocation: (id: string) => void,
  onAddItem: (locId?: string) => void,
  onEditItem: (item: Item) => void,
  onDeleteItem: (id: string) => void,
  onAddLocation: () => void,
  onEditLocation: (loc: Location) => void,
  onDeleteLocation: (id: string) => void,
  onSellItem: (item: Item) => void
}) => {
  const activeLocation = locations.find(l => l.id === activeLocId);
  const locationItems = items.filter(i => i.locationId === activeLocId && i.status === 'active');

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <Header 
        title="보관함" 
        subtitle="어디에 무엇이 있나 볼까요?" 
        action={
          <button 
            onClick={onAddLocation}
            className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-200"
          >
            <Plus size={18} />
          </button>
        }
      />

      {/* Location Tabs */}
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

      {/* Items List */}
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
             <ChaengguAvatar size={80} mood="working" className="mb-4 grayscale opacity-50"/>
             <p className="text-slate-900 font-bold">여기는 텅 비어있어요</p>
             <p className="text-xs text-slate-500 mt-1">새로운 물건을 채워볼까요?</p>
          </div>
        ) : (
          locationItems.map(item => {
            const isExpiring = item.expiryDate && new Date(item.expiryDate) <= new Date(new Date().setDate(new Date().getDate() + 7));
            const categoryStyle = CATEGORY_STYLES[item.category];

            return (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] flex gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${categoryStyle}`}>
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
                  
                  <div className="mt-3 flex items-center gap-4">
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
                  <button onClick={() => onEditItem(item)} className="p-2 text-slate-300 hover:text-slate-600 rounded-lg hover:bg-slate-50">
                    <Pencil size={16} />
                  </button>
                   <button onClick={() => onSellItem(item)} className="p-2 text-slate-300 hover:text-blue-500 rounded-lg hover:bg-blue-50">
                    <ShoppingBag size={16} />
                  </button>
                  <button onClick={() => onDeleteItem(item.id)} className="p-2 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Add Button */}
      {activeLocation && (
        <div className="absolute bottom-24 right-5">
          <button 
            onClick={() => onAddItem(activeLocId)}
            className="bg-slate-900 text-white w-14 h-14 rounded-full shadow-xl shadow-slate-300 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={28} />
          </button>
        </div>
      )}
    </div>
  );
};
