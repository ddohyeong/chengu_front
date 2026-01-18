import React, { useState, useEffect, useRef } from 'react';
import { Camera, Image as ImageIcon, CheckCircle2, X } from 'lucide-react';
import { Item, Location, ReceiptItem } from '@/shared/types';
import { ChaengguAvatar } from '@/shared/components/ChaengguAvatar';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '@/shared/constants/inventory';
import { analyzeReceipt } from '@/shared/services/geminiService';

export const ReceiptModal = ({ 
  isOpen, 
  onClose, 
  onSaveItems,
  locations 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSaveItems: (items: Item[]) => void,
  locations: Location[]
}) => {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'review'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzedItems, setAnalyzedItems] = useState<ReceiptItem[]>([]);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('upload');
      setPreviewUrl(null);
      setAnalyzedItems([]);
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setSelectedLocationId(locations[0]?.id || '');
    }
  }, [isOpen, locations]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setPreviewUrl(base64);
      setStep('analyzing');
      
      try {
        // Extract base64 data only
        const base64Data = base64.split(',')[1];
        const result = await analyzeReceipt(base64Data);
        setAnalyzedItems(result.items);
        if (result.purchaseDate) {
          setPurchaseDate(result.purchaseDate);
        }
        setStep('review');
      } catch (err) {
        console.error(err);
        alert('영수증 분석에 실패했습니다. 다시 시도해주세요.');
        setStep('upload');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!selectedLocationId) {
      alert('보관할 장소를 선택해주세요!');
      return;
    }

    const itemsToSave: Item[] = analyzedItems.map((item, idx) => ({
      id: `item-receipt-${Date.now()}-${idx}`,
      locationId: selectedLocationId,
      name: item.name,
      category: item.category,
      subCategory: item.subCategory,
      purchaseDate: purchaseDate,
      status: 'active'
    }));

    onSaveItems(itemsToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative z-10 bg-white rounded-[32px] w-full max-w-sm h-[80vh] overflow-hidden shadow-2xl flex flex-col">
        {step === 'upload' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
            <ChaengguAvatar size={60} mood="happy" />
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-900">영수증 찍고 한번에 등록!</h2>
              <p className="text-slate-500 mt-2 text-sm">마트 다녀오셨나요? 챙구가 정리해드릴게요.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <Camera size={32} className="text-slate-400 mb-2"/>
                <span className="text-sm font-bold text-slate-600">사진 찍기</span>
              </button>
              <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <ImageIcon size={32} className="text-slate-400 mb-2"/>
                <span className="text-sm font-bold text-slate-600">앨범 선택</span>
              </button>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
             <div className="relative mb-6">
               <img src={previewUrl!} alt="Receipt" className="w-32 h-32 object-cover rounded-2xl opacity-50 blur-sm"/>
               <div className="absolute inset-0 flex items-center justify-center">
                  <ChaengguAvatar size={60} mood="working" className="animate-waddle"/>
               </div>
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">영수증 읽는 중...</h3>
             <p className="text-slate-500 text-sm">어떤 물건을 사오셨는지 꼼꼼히 보고 있어요!</p>
          </div>
        )}

        {step === 'review' && (
          <div className="flex-1 flex flex-col overflow-hidden">
             <div className="p-5 border-b border-slate-100 bg-white">
               <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                 <CheckCircle2 size={20} className="text-emerald-500"/>
                 {analyzedItems.length}개의 물건을 찾았어요
               </h2>
             </div>
             
             <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
               <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-4">
                 <div>
                   <label className="text-xs font-bold text-slate-400 uppercase">구매일자</label>
                   <input 
                      type="date" 
                      value={purchaseDate} 
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="block w-full mt-1 font-bold text-slate-900 bg-transparent border-b border-slate-200 focus:border-slate-900 outline-none pb-1"
                   />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-400 uppercase">보관 장소 (일괄)</label>
                   <select 
                      value={selectedLocationId}
                      onChange={(e) => setSelectedLocationId(e.target.value)}
                      className="block w-full mt-1 font-bold text-slate-900 bg-transparent border-b border-slate-200 focus:border-slate-900 outline-none pb-1"
                   >
                     {locations.map(loc => (
                       <option key={loc.id} value={loc.id}>{loc.icon} {loc.name}</option>
                     ))}
                   </select>
                 </div>
               </div>

               <div className="space-y-2">
                 {analyzedItems.map((item, idx) => (
                   <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100">
                     <span className="text-xl">{CATEGORY_ICONS[item.category]}</span>
                     <div className="flex-1 min-w-0">
                       <p className="font-bold text-slate-900 truncate">{item.name}</p>
                       <p className="text-xs text-slate-500">{CATEGORY_LABELS[item.category]} &gt; {item.subCategory || '일반'}</p>
                     </div>
                     <button onClick={() => {
                        setAnalyzedItems(prev => prev.filter((_, i) => i !== idx));
                     }} className="text-slate-300 hover:text-rose-500">
                       <X size={16} />
                     </button>
                   </div>
                 ))}
               </div>
             </div>

             <div className="p-5 bg-white border-t border-slate-100">
                <button 
                  onClick={handleSave}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-200"
                >
                  모두 저장하기
                </button>
             </div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
    </div>
  );
};
