import React, { useState, useEffect } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Item, Location, Category } from '@/shared/types';
import { ChaengguAvatar } from '@/shared/components/ChaengguAvatar';
import { CATEGORY_LABELS, SUB_CATEGORIES } from '@/shared/constants/inventory';

export const ItemModal = ({
  isOpen,
  onClose,
  onSave,
  locations,
  initialData,
  preSelectedLocationId
}: {
  isOpen: boolean,
  onClose: () => void,
  onSave: (item: Item) => void,
  locations: Location[],
  initialData?: Item,
  preSelectedLocationId?: string
}) => {
  const [name, setName] = useState('');
  const [locationId, setLocationId] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [subCategory, setSubCategory] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [discardDate, setDiscardDate] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      if (initialData) {
        setName(initialData.name);
        setLocationId(initialData.locationId);
        setCategory(initialData.category);
        setSubCategory(initialData.subCategory || '');
        setPurchaseDate(initialData.purchaseDate);
        setExpiryDate(initialData.expiryDate || '');
        setDiscardDate(initialData.discardDate || '');
        setNote(initialData.note || '');
      } else {
        setName('');
        setLocationId(preSelectedLocationId || (locations[0]?.id || ''));
        setCategory('food');
        setSubCategory(SUB_CATEGORIES['food'][0]);
        setPurchaseDate(today);
        setExpiryDate('');
        setDiscardDate('');
        setNote('');
      }
    }
  }, [isOpen, initialData, locations, preSelectedLocationId]);

  useEffect(() => {
    if (!initialData && isOpen && category) {
       setSubCategory(SUB_CATEGORIES[category][0]);
    }
  }, [category, isOpen, initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative z-10 bg-white rounded-[32px] w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all no-scrollbar">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ChaengguAvatar size={32} mood="working" />
              {initialData ? '물건 정보 수정' : '새 물건 등록'}
            </h2>
            <button onClick={onClose} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-500">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">물건 이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 신선한 우유"
                className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">카테고리</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl text-slate-900 font-medium appearance-none focus:ring-2 focus:ring-slate-900"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" size={16} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">상세 분류</label>
                <div className="relative">
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl text-slate-900 font-medium appearance-none focus:ring-2 focus:ring-slate-900"
                  >
                     {SUB_CATEGORIES[category].map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" size={16} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">보관 장소</label>
              <div className="relative">
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl text-slate-900 font-medium appearance-none focus:ring-2 focus:ring-slate-900"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.icon} {loc.name}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" size={16} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">구매일</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase text-rose-500">유통기한</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-4 py-3 bg-rose-50 border-0 rounded-2xl text-rose-900 font-medium focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

             <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">폐기 예정일 (선택)</label>
                <input
                  type="date"
                  value={discardDate}
                  onChange={(e) => setDiscardDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-slate-900"
                />
                 <p className="text-[10px] text-slate-400 mt-1 pl-1">유통기한과 별도로 챙구가 알려드려요.</p>
              </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">메모</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="특이사항이나 상태를 적어주세요"
                className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 resize-none h-20"
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (!name || !locationId) return;
              onSave({
                id: initialData?.id || `item-${Date.now()}`,
                name,
                locationId,
                category,
                subCategory,
                purchaseDate,
                expiryDate: expiryDate || undefined,
                discardDate: discardDate || undefined,
                note: note || undefined,
                status: initialData?.status || 'active'
              });
              onClose();
            }}
            disabled={!name || !locationId}
            className="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
          >
            {initialData ? '수정 완료' : '등록하기'}
          </button>
        </div>
      </div>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
    </div>
  );
};
