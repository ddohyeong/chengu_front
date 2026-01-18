
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutGrid, 
  MapPin, 
  Plus, 
  ShoppingBag, 
  AlertCircle, 
  Calendar, 
  Package, 
  Trash2, 
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  Home,
  Menu,
  Settings,
  Pencil,
  X,
  Camera,
  Upload,
  Loader2,
  Check,
  Heart,
  Image as ImageIcon,
  Coins,
  History,
  Timer
} from 'lucide-react';
import { Item, Location, SalesListing, Category, ReceiptItem } from './types';
import * as Storage from './services/storageService';
import { generateSalesListing, analyzeReceipt } from './services/geminiService';

// --- Utils & Constants ---

const CATEGORY_ICONS: Record<string, string> = {
  food: '🍎',
  electronics: '📱',
  clothes: '👕',
  furniture: '🪑',
  misc: '📦',
};

const CATEGORY_STYLES: Record<string, string> = {
  food: 'bg-emerald-100 text-emerald-700',
  electronics: 'bg-blue-100 text-blue-700',
  clothes: 'bg-violet-100 text-violet-700',
  furniture: 'bg-amber-100 text-amber-700',
  misc: 'bg-slate-100 text-slate-600',
};

const CATEGORY_LABELS: Record<string, string> = {
  food: '식품',
  electronics: '전자제품',
  clothes: '의류',
  furniture: '가구',
  misc: '기타',
};

const SUB_CATEGORIES: Record<Category, string[]> = {
  food: ['신선식품', '냉동/간편식', '음료/주류', '간식', '조미료', '기타 식품'],
  electronics: ['스마트폰/태블릿', 'PC/노트북', '생활가전', '주방가전', '액세서리', '기타 가전'],
  clothes: ['상의', '하의', '아우터', '신발', '패션잡화', '기타 의류'],
  furniture: ['침실가구', '거실가구', '주방가구', '수납가구', '인테리어', '기타 가구'],
  misc: ['도서/문구', '생활용품', '화장품', '공구', '취미', '기타'],
};

const LOCATION_TYPE_ICONS: Record<string, string> = {
  refrigerator: '❄️',
  closet: '👕',
  drawer: '🗄️',
  room: '🏠',
  box: '📦',
};

const LOCATION_TYPE_LABELS: Record<string, string> = {
  refrigerator: '냉장고',
  closet: '옷장',
  drawer: '서랍장',
  room: '방',
  box: '수납박스',
};

// --- Branding Components ---

const ChaengguAvatar = ({ size = 40, mood = 'happy', className = '' }: { size?: number, mood?: 'happy'|'working'|'sad', className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 10C28 10 12 28 12 55C12 85 28 95 50 95C72 95 88 85 88 55C88 28 72 10 50 10Z" fill="#1e293b"/>
    <path d="M50 90C72 90 78 70 78 55C78 38 68 28 50 28C32 28 22 38 22 55C22 70 28 90 50 90Z" fill="white"/>
    <circle cx="38" cy="45" r="4" fill="#1e293b"/>
    <circle cx="62" cy="45" r="4" fill="#1e293b"/>
    {mood === 'happy' && (
      <>
        <circle cx="32" cy="50" r="3" fill="#fca5a5" opacity="0.6"/>
        <circle cx="68" cy="50" r="3" fill="#fca5a5" opacity="0.6"/>
      </>
    )}
    <path d="M45 52H55L50 58L45 52Z" fill="#fbbf24"/>
    <path d="M35 94C30 94 25 90 35 85" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"/>
    <path d="M65 94C70 94 75 90 65 85" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"/>
    {mood === 'working' && (
      <circle cx="85" cy="45" r="8" fill="#ef4444" opacity="0.8" />
    )}
  </svg>
);

const Header = ({ title, subtitle, action, showLogo, onBack }: { title?: string, subtitle?: string, action?: React.ReactNode, showLogo?: boolean, onBack?: () => void }) => (
  <header className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 shadow-[0_2px_10px_-5px_rgba(0,0,0,0.05)]">
    <div className="flex items-center gap-3">
      {onBack && (
        <button onClick={onBack} className="-ml-2 p-2 text-slate-500 hover:text-slate-900">
          <ArrowLeft size={24} />
        </button>
      )}
      {showLogo && <ChaengguAvatar size={42} className="animate-waddle" />}
      <div>
        {showLogo ? (
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">챙구</h1>
        ) : (
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        )}
        {(subtitle || showLogo) && (
          <p className="text-xs text-slate-500 font-medium">{subtitle || "내 물건 챙겨주는 친구"}</p>
        )}
      </div>
    </div>
    {action && <div>{action}</div>}
  </header>
);

const NavTab = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`relative flex flex-col items-center justify-center w-full py-2 transition-all duration-300 ${active ? 'text-slate-900' : 'text-slate-300 hover:text-slate-500'}`}
  >
    <div className={`p-1.5 rounded-2xl transition-all duration-300 ${active ? 'bg-slate-100 -translate-y-1' : ''}`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    </div>
    <span className={`text-[10px] font-bold mt-1 transition-opacity ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
  </button>
);

const Badge = ({ children, className }: { children?: React.ReactNode, className?: string }) => (
  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${className}`}>
    {children}
  </span>
);

// --- Modals ---

const LocationModal = ({ 
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

const ItemModal = ({
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

const SalesModal = ({ item, isOpen, onClose }: { item: Item, isOpen: boolean, onClose: () => void }) => {
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

const ReceiptModal = ({ 
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

// --- Views ---

const DashboardView = ({ 
  items, 
  locations, 
  onScanReceipt,
  onNavigateToLocation,
  onAddItem,
  onNavigateToSales,
  onNavigateToExpiring
}: { 
  items: Item[], 
  locations: Location[], 
  onScanReceipt: () => void,
  onNavigateToLocation: (locId: string) => void,
  onAddItem: () => void,
  onNavigateToSales: () => void,
  onNavigateToExpiring: () => void
}) => {
  const { expiringSoon, expired, sellableCount } = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const threshold = new Date(today);
    threshold.setDate(today.getDate() + 7);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const activeItems = items.filter(i => i.status === 'active');
    
    return {
      expiringSoon: activeItems.filter(i => {
        if (!i.expiryDate) return false;
        const exp = new Date(i.expiryDate);
        return exp >= today && exp <= threshold;
      }),
      expired: activeItems.filter(i => {
        if (!i.expiryDate) return false;
        const exp = new Date(i.expiryDate);
        return exp < today;
      }),
      sellableCount: activeItems.filter(i => {
         const purchase = new Date(i.purchaseDate);
         return purchase < sixMonthsAgo;
      }).length
    };
  }, [items]);

  return (
    <div className="h-full overflow-y-auto pb-24 bg-slate-50/50 no-scrollbar">
      <Header 
        showLogo 
        subtitle="오늘도 물건들을 꼼꼼히 살피는 중!" 
      />
      
      <div className="p-5 space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div 
            onClick={() => locations.length > 0 && onNavigateToLocation(locations[0].id)}
            className="bg-white p-5 rounded-[20px] shadow-sm border border-slate-100 flex flex-col justify-between h-36 relative overflow-hidden group cursor-pointer hover:border-slate-300 transition-colors"
          >
            <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:scale-110 transition-transform">
              <Package size={80} className="text-slate-900" />
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <ChaengguAvatar size={24} />
              </div>
              <p className="text-slate-500 text-xs font-bold">보관 중인 물건</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-0.5">{items.filter(i => i.status === 'active').length}개</p>
            </div>
          </div>
          
          <div 
             onClick={onNavigateToSales}
             className="bg-slate-900 p-5 rounded-[20px] shadow-lg shadow-slate-200 flex flex-col justify-between h-36 text-white relative overflow-hidden cursor-pointer hover:bg-slate-800 transition-colors"
          >
             <div className="absolute -right-2 -bottom-2 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
             <div className="relative z-10">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                <Sparkles size={18} className="text-yellow-300" />
              </div>
              <p className="text-slate-300 text-xs font-bold">판매 추천</p>
              <div className="flex items-end gap-1.5 mt-0.5">
                <p className="text-3xl font-extrabold">{sellableCount}개</p>
              </div>
             </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
           <button 
            onClick={onScanReceipt}
            className="flex-shrink-0 flex items-center gap-3 pl-4 pr-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
           >
             <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
               <Camera size={20} />
             </div>
             <div className="text-left">
               <p className="font-bold text-slate-900 text-sm">영수증 스캔</p>
               <p className="text-[10px] text-slate-500">사진으로 자동 등록</p>
             </div>
           </button>
           
           <button 
            onClick={onNavigateToExpiring}
            className="flex-shrink-0 flex items-center gap-3 pl-4 pr-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
           >
             <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
               <Timer size={20} />
             </div>
             <div className="text-left">
               <p className="font-bold text-slate-900 text-sm">유통기한 관리</p>
               <p className="text-[10px] text-slate-500">전체 물건 기한 확인</p>
             </div>
           </button>

           <button 
            onClick={onAddItem}
            className="flex-shrink-0 flex items-center gap-3 pl-4 pr-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
           >
             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
               <Plus size={20} />
             </div>
             <div className="text-left">
               <p className="font-bold text-slate-900 text-sm">직접 등록</p>
               <p className="text-[10px] text-slate-500">빠르게 추가하기</p>
             </div>
           </button>
        </div>

        {/* Alerts */}
        {(expired.length > 0 || expiringSoon.length > 0) && (
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 ml-1">챙구의 브리핑</h3>
            
            {expired.length > 0 && (
              <div 
                onClick={onNavigateToExpiring}
                className="bg-rose-50 p-4 rounded-2xl border border-rose-100 flex items-start gap-3 cursor-pointer hover:bg-rose-100 transition-colors shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <AlertCircle size={22} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-rose-700 text-sm">유통기한이 지난 물건 {expired.length}개</p>
                  <p className="text-xs text-rose-600/80 mt-1 leading-relaxed">
                    {expired[0].name} 등 이미 만료된 물건이 있어요. 챙구가 정리를 도와드릴까요?
                  </p>
                </div>
                <ChevronRight className="text-rose-300 self-center" size={18} />
              </div>
            )}

            {expiringSoon.length > 0 && (
              <div 
                onClick={onNavigateToExpiring}
                className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3 cursor-pointer hover:bg-amber-100 transition-colors shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Clock size={22} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-amber-700 text-sm">곧 만료되는 물건 {expiringSoon.length}개</p>
                  <p className="text-xs text-amber-600/80 mt-1 leading-relaxed">
                     {expiringSoon[0].name}의 기한이 얼마 남지 않았어요! 부지런히 사용해봐요.
                  </p>
                </div>
                <ChevronRight className="text-amber-300 self-center" size={18} />
              </div>
            )}
          </div>
        )}

        {/* Recent Locations */}
        <div>
          <h3 className="font-bold text-slate-900 mb-3 ml-1 flex items-center gap-2">
            <MapPin size={16} className="text-slate-400" />
            나의 공간들
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {locations.map(loc => (
              <div 
                key={loc.id} 
                onClick={() => onNavigateToLocation(loc.id)}
                className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all active:scale-95"
              >
                <span className="text-2xl">{loc.icon}</span>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">{loc.name}</p>
                  <p className="text-xs text-slate-400 font-medium">
                    {items.filter(i => i.locationId === loc.id && i.status === 'active').length}개 보관 중
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LocationsView = ({ 
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

const SalesView = ({ 
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

const ExpiringView = ({
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

  // Fix: Added optional key prop to avoid TypeScript assignment error in list rendering
  const ItemCard = ({ item }: { item: Item; key?: React.Key }) => {
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
              {expired.map(item => <ItemCard key={item.id} item={item} />)}
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
              {expiringSoon.map(item => <ItemCard key={item.id} item={item} />)}
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

// --- Main App ---

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'locations' | 'sales' | 'expiring'>('dashboard');
  const [locations, setLocations] = useState<Location[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [activeLocId, setActiveLocId] = useState<string>('');
  
  // Modals
  const [modalType, setModalType] = useState<'item' | 'location' | 'sales' | 'receipt' | null>(null);
  const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);
  const [editingLocation, setEditingLocation] = useState<Location | undefined>(undefined);
  const [preSelectedLocationId, setPreSelectedLocationId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadedLocations = Storage.getLocations();
    setLocations(loadedLocations);
    setItems(Storage.getItems());
    
    // Initialize active location if not set
    if (loadedLocations.length > 0 && !activeLocId) {
      setActiveLocId(loadedLocations[0].id);
    }
  }, []); // Run once on mount

  const refreshData = () => {
    const locs = Storage.getLocations();
    setLocations(locs);
    setItems(Storage.getItems());
    if (locs.length > 0 && !activeLocId) {
      setActiveLocId(locs[0].id);
    }
  };

  const handleSaveItem = (item: Item) => {
    Storage.saveItem(item);
    refreshData();
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('정말로 이 물건을 삭제할까요?')) {
      Storage.deleteItem(id);
      refreshData();
    }
  };
  
  const handleSaveLocation = (loc: Location) => {
    Storage.saveLocation(loc);
    refreshData();
  };

  const handleDeleteLocation = (id: string) => {
    if (confirm('장소를 삭제하면 안의 물건들도 함께 삭제됩니다. 계속할까요?')) {
       Storage.deleteLocation(id);
       refreshData();
       // Reset active location if the deleted one was active
       const remaining = Storage.getLocations();
       if (remaining.length > 0) setActiveLocId(remaining[0].id);
       else setActiveLocId('');
    }
  };

  const handleBulkAddItems = (newItems: Item[]) => {
    newItems.forEach(item => Storage.saveItem(item));
    refreshData();
  };

  const handleNavigateToLocation = (locId: string) => {
    setActiveLocId(locId);
    setCurrentView('locations');
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col relative max-w-md mx-auto shadow-2xl overflow-hidden">
      {/* View Content */}
      <div className="flex-1 overflow-hidden relative">
        {currentView === 'dashboard' && (
          <DashboardView 
            items={items} 
            locations={locations} 
            onScanReceipt={() => setModalType('receipt')}
            onNavigateToLocation={handleNavigateToLocation}
            onNavigateToSales={() => setCurrentView('sales')}
            onNavigateToExpiring={() => setCurrentView('expiring')}
            onAddItem={() => {
              setEditingItem(undefined);
              setPreSelectedLocationId(activeLocId || undefined);
              setModalType('item');
            }}
          />
        )}
        {currentView === 'locations' && (
          <LocationsView 
            locations={locations} 
            items={items} 
            activeLocId={activeLocId}
            onSelectLocation={setActiveLocId}
            onAddItem={(locId) => {
              setEditingItem(undefined);
              setPreSelectedLocationId(locId);
              setModalType('item');
            }}
            onEditItem={(item) => {
              setEditingItem(item);
              setModalType('item');
            }}
            onDeleteItem={handleDeleteItem}
            onAddLocation={() => {
              setEditingLocation(undefined);
              setModalType('location');
            }}
            onEditLocation={(loc) => {
               setEditingLocation(loc);
               setModalType('location');
            }}
            onDeleteLocation={handleDeleteLocation}
            onSellItem={(item) => {
              setEditingItem(item);
              setModalType('sales');
            }}
          />
        )}
        {currentView === 'sales' && (
          <SalesView 
            items={items}
            onBack={() => setCurrentView('dashboard')}
            onSellItem={(item) => {
              setEditingItem(item);
              setModalType('sales');
            }}
          />
        )}
        {currentView === 'expiring' && (
          <ExpiringView 
            items={items}
            locations={locations}
            onBack={() => setCurrentView('dashboard')}
            onEditItem={(item) => {
              setEditingItem(item);
              setModalType('item');
            }}
            onDeleteItem={handleDeleteItem}
          />
        )}
      </div>

      {/* Navigation Bar */}
      <nav className="bg-white border-t border-slate-100 pb-safe px-6 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.03)] z-30">
        <div className="flex justify-around items-center h-[70px]">
          <NavTab 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')} 
            icon={Home} 
            label="홈" 
          />
          <div className="-mt-8">
             <button 
                onClick={() => {
                   setEditingItem(undefined);
                   setPreSelectedLocationId(activeLocId || undefined);
                   setModalType('item');
                }}
                className="bg-slate-900 text-white p-4 rounded-full shadow-lg shadow-slate-300 hover:scale-105 transition-transform"
             >
                <Plus size={28} />
             </button>
          </div>
          <NavTab 
            active={currentView === 'locations'} 
            onClick={() => setCurrentView('locations')} 
            icon={Package} 
            label="보관함" 
          />
        </div>
      </nav>

      {/* Modals */}
      <ItemModal 
        isOpen={modalType === 'item'} 
        onClose={() => setModalType(null)} 
        onSave={handleSaveItem}
        locations={locations}
        initialData={editingItem}
        preSelectedLocationId={preSelectedLocationId}
      />

      <LocationModal
         isOpen={modalType === 'location'}
         onClose={() => setModalType(null)}
         onSave={handleSaveLocation}
         initialData={editingLocation}
      />
      
      {editingItem && (
        <SalesModal 
          isOpen={modalType === 'sales'}
          onClose={() => setModalType(null)}
          item={editingItem}
        />
      )}

      <ReceiptModal
         isOpen={modalType === 'receipt'}
         onClose={() => setModalType(null)}
         onSaveItems={handleBulkAddItems}
         locations={locations}
      />
    </div>
  );
}
