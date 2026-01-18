import React, { useState, useEffect } from 'react';
import { Location } from '@/shared/types';
import { LOCATION_TYPE_ICONS, LOCATION_TYPE_LABELS } from '@/shared/constants/inventory';

export const LocationModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSave: (loc: Location) => void,
  initialData?: Location 
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<Location['type']>('box');
  const [icon, setIcon] = useState('📦');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setType(initialData.type);
      setIcon(initialData.icon);
    } else {
      setName('');
      setType('box');
      setIcon('📦');
    }
  }, [initialData, isOpen]);

  const handleTypeChange = (newType: Location['type']) => {
    setType(newType);
    setIcon(LOCATION_TYPE_ICONS[newType]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative z-10 bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl transform transition-all">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            {initialData ? '장소 수정' : '새 장소 추가'}
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 안방 서랍장"
                className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">종류</label>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(LOCATION_TYPE_ICONS) as Location['type'][]).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTypeChange(t)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                      type === t 
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105' 
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl mb-1">{LOCATION_TYPE_ICONS[t]}</span>
                  </button>
                ))}
              </div>
              <p className="text-center text-xs font-medium text-slate-500 mt-2">{LOCATION_TYPE_LABELS[type]}</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (!name) return;
              onSave({
                id: initialData?.id || `loc-${Date.now()}`,
                name,
                type,
                icon
              });
              onClose();
            }}
            disabled={!name}
            className="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
          >
            {initialData ? '수정 완료' : '장소 만들기'}
          </button>
        </div>
      </div>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
    </div>
  );
};
