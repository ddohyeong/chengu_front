import { MapPin, Plus, AlertCircle, Clock, ChevronRight, Package, Sparkles, Camera, Timer, User } from 'lucide-react';
import { Item, Location } from '@/shared/types';
import { Header } from '@/shared/components/Header';
import { ChaengguAvatar } from '@/shared/components/ChaengguAvatar';
import { useInventoryStats } from '../../hooks/useInventoryStats';

interface DashboardViewProps {
  items: Item[];
  locations: Location[];
  onScanReceipt: () => void;
  onNavigateToLocation: (locId: string) => void;
  onAddItem: () => void;
  onNavigateToSales: () => void;
  onNavigateToExpiring: () => void;
  onNavigateToMyPage: () => void;
}

export const DashboardView = ({
  items,
  locations,
  onScanReceipt,
  onNavigateToLocation,
  onAddItem,
  onNavigateToSales,
  onNavigateToExpiring,
  onNavigateToMyPage,
}: DashboardViewProps) => {
  const { expired, expiringSoon, sellableCount } = useInventoryStats(items);

  return (
    <div className="h-full overflow-y-auto pb-24 bg-slate-50/50 no-scrollbar">
      <Header
        showLogo
        subtitle="오늘도 물건들을 꼼꼼히 살피는 중!"
        action={
          <button
            onClick={onNavigateToMyPage}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
          >
            <User size={20} />
          </button>
        }
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
              <p className="text-3xl font-extrabold text-slate-900 mt-0.5">
                {items.filter(i => i.status === 'active').length}개
              </p>
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
