import { LogOut, User } from 'lucide-react';
import { Header } from '@/shared/components/Header';
import { ChaengguAvatar } from '@/shared/components/ChaengguAvatar';
import { useAuth } from '../hooks/useAuth';
import { authStorage } from '@/shared/services/authStorage';

export const MyPage = ({ onBack, onLogout }: { onBack: () => void, onLogout: () => void }) => {
  const { logout } = useAuth();
  const token = authStorage.getToken();
  const userNickname = authStorage.getNickname();

  // TODO: 마이페이지 API가 구현되면 실제 사용자 정보를 가져와야 합니다
  // 현재는 토큰만 확인하여 표시
  const isLoggedIn = !!token;

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      logout();
      onLogout();
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <Header 
        title="마이페이지" 
        subtitle="내 정보를 확인하세요" 
        onBack={onBack}
      />

      <div className="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
        <div className="bg-white rounded-[24px] p-6 mb-4 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <ChaengguAvatar size={48} mood="happy" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {isLoggedIn ? `${userNickname} 님` : '게스트'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isLoggedIn ? '로그인 중' : '로그인이 필요합니다'}
              </p>
            </div>
          </div>

          {isLoggedIn && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <User size={20} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">사용자 정보</p>
                  <p className="text-sm font-bold text-slate-900">마이페이지 API 미구현</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="w-full bg-rose-50 text-rose-700 font-bold py-4 rounded-2xl border border-rose-100 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            로그아웃
          </button>
        )}
      </div>
    </div>
  );
};
