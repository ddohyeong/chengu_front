import React, { useState, useEffect } from 'react';
import { Location } from '@/shared/types';
import { LOCATION_TYPE_ICONS, LOCATION_TYPE_LABELS } from '@/shared/constants/inventory';

// 빠른 선택용 프리셋 보관함 목록
const LOCATION_PRESETS: { type: Location['type']; label: string; icon: string }[] = [
  { type: 'refrigerator', label: '냉장고', icon: LOCATION_TYPE_ICONS.refrigerator },
  { type: 'closet',       label: '옷장',   icon: LOCATION_TYPE_ICONS.closet },
  { type: 'drawer',       label: '서랍장', icon: LOCATION_TYPE_ICONS.drawer },
  { type: 'room',         label: '방',     icon: LOCATION_TYPE_ICONS.room },
  { type: 'box',          label: '수납박스', icon: LOCATION_TYPE_ICONS.box },
];

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

  // 프리셋 클릭 → 이름 자동 입력 + 아이콘 자동 선택
  const handlePresetClick = (preset: typeof LOCATION_PRESETS[0]) => {
    setType(preset.type);
    setIcon(preset.icon);
    setName(preset.label);
  };

  // 아이콘 타입만 변경 (직접 입력 시 아이콘 선택용)
  const handleIconChange = (newType: Location['type']) => {
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
            {/* ── 프리셋 빠른 선택 ── */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                빠른 선택
              </label>
              <div className="grid grid-cols-5 gap-2">
                {LOCATION_PRESETS.map((preset) => (
                  <button
                    key={preset.type}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={`flex flex-col items-center justify-center gap-1 py-3 px-1 rounded-2xl transition-all ${
                      type === preset.type && name === preset.label
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">{preset.icon}</span>
                    <span className="text-[10px] font-semibold leading-tight">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── 직접 입력 ── */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                직접 입력
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 주방 냉장고, 드레스룸 행거..."
                className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-1 pl-1">
                프리셋 선택 후 이름을 수정하거나 직접 입력할 수 있어요.
              </p>
            </div>

            {/* ── 직접 입력 시 아이콘 선택 ── */}
            {name && !LOCATION_PRESETS.some((p) => p.label === name) && (
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                  아이콘 선택
                </label>
                <div className="flex gap-2">
                  {LOCATION_PRESETS.map((preset) => (
                    <button
                      key={preset.type}
                      type="button"
                      onClick={() => handleIconChange(preset.type)}
                      className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all ${
                        type === preset.type
                          ? 'bg-slate-900 text-white shadow-md scale-105'
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-lg">{preset.icon}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (!name) return;
              onSave({
                id: initialData?.id || `loc-${Date.now()}`,
                name,
                type,
                icon,
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
