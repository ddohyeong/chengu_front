import React, { useMemo } from 'react';
import { Sparkles, Coins } from 'lucide-react';
import { Item } from '@/shared/types';
import { Header } from '@/shared/components/Header';
import { ChaengguAvatar } from '@/shared/components/ChaengguAvatar';
import { Badge } from '@/shared/components/Badge';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '@/shared/constants/inventory';

export const SalesView = ({ 
  items, 
  onBack,
  onSellItem 
}: { 
  items: Item[], 
  onBack: () => void,
  onSellItem: (item: Item) => void
}) => {
  const sellableItems = useMemo(() => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return items.filter(i => i.status === 'active' && new Date(i.purchaseDate) < sixMonthsAgo);
  }, [items]);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <Header 
        title="판매 추천" 
        subtitle="안 쓰는 물건, 용돈으로 바꿔볼까요?" 
        onBack={onBack}
      />

      <div className="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
        <div className="mb-6 bg-slate-900 rounded-[24px] p-6 text-white relative overflow-hidden">
           <div className="relative z-10 flex items-center gap-4">
             <ChaengguAvatar size={50} mood="happy" />
             <div>
               <p className="font-bold text-lg">챙구의 꿀팁!</p>
               <p className="text-sm text-slate-300 opacity-90 mt-1">6개월 이상 사용하지 않은 물건은<br/>중고로 판매하기 딱 좋아요.</p>
             </div>
           </div>
           <div className="absolute right-0 bottom-0 opacity-10">
              <Coins size={120} />
           </div>
        </div>

        <h3 className="font-bold text-slate-900 mb-4 ml-1 flex items-center gap-2">
          <Sparkles size={16} className="text-yellow-500"/>
          판매 추천 리스트 ({sellableItems.length})
        </h3>

        {sellableItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
             <ChaengguAvatar size={80} mood="working" className="mb-4 grayscale opacity-50"/>
             <p className="text-slate-900 font-bold">판매할 물건이 없어요!</p>
             <p className="text-xs text-slate-500 mt-1">모든 물건이 알차게 쓰이고 있네요.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sellableItems.map(item => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                   <div className="flex items-center gap-3">
                     <span className="text-2xl p-2 bg-slate-50 rounded-xl">{CATEGORY_ICONS[item.category]}</span>
                     <div>
                       <h4 className="font-bold text-slate-900 text-lg">{item.name}</h4>
                       <p className="text-xs text-slate-500">구매일: {item.purchaseDate}</p>
                     </div>
                   </div>
                   <Badge className="bg-slate-100 text-slate-600">
                      {CATEGORY_LABELS[item.category]}
                   </Badge>
                </div>
                
                <button 
                  onClick={() => onSellItem(item)}
                  className="w-full py-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  AI 판매글 자동 작성
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
