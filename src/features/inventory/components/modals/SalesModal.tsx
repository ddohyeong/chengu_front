import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Item, SalesListing } from '@/shared/types';
import { ChaengguAvatar } from '@/shared/components/ChaengguAvatar';
import { Badge } from '@/shared/components/Badge';
import { generateSalesListing } from '@/shared/services/geminiService';

export const SalesModal = ({ item, isOpen, onClose }: { item: Item, isOpen: boolean, onClose: () => void }) => {
  const [listing, setListing] = useState<SalesListing | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && item) {
      setLoading(true);
      generateSalesListing(item)
        .then(setListing)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setListing(null);
    }
  }, [isOpen, item]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative z-10 bg-white rounded-[32px] w-full max-w-sm max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
               <div className="absolute inset-0 bg-slate-100 rounded-full animate-ping"></div>
               <ChaengguAvatar size={80} mood="working" className="animate-waddle relative z-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">판매글 작성 중...</h3>
              <p className="text-slate-500 text-sm mt-2">챙구가 {item.name}의<br/>매력적인 소개글을 쓰고 있어요!</p>
            </div>
          </div>
        ) : listing ? (
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <div className="p-6">
               <div className="flex justify-between items-start mb-6">
                 <div>
                    <Badge className="bg-slate-900 text-white mb-2 inline-block">챙구의 제안</Badge>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">이렇게 팔아보세요!</h3>
                 </div>
                 <button onClick={onClose} className="p-2 bg-slate-50 rounded-full"><X size={18}/></button>
               </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">제목</p>
                  <p className="font-bold text-slate-900">{listing.title}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">가격 제안</p>
                  <p className="font-bold text-emerald-600 text-lg">{listing.suggestedPriceRange}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">내용</p>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{listing.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {listing.hashtags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 pt-0">
               <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${listing.title}\n\n${listing.description}\n\n${listing.hashtags.join(' ')}`);
                  alert('클립보드에 복사되었습니다!');
                }}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-200 active:scale-95 transition-transform"
               >
                 복사하기
               </button>
            </div>
          </div>
        ) : null}
      </div>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
    </div>
  );
};
