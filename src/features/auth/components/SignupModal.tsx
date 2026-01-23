import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ChaengguAvatar } from '@/shared/components/ChaengguAvatar';
import { useAuth } from '../hooks/useAuth';

export const SignupModal = ({ isOpen, onClose, onSignupSuccess }: { isOpen: boolean, onClose: () => void, onSignupSuccess?: () => void }) => {
  const [signId, setSignId] = useState('');
  const [signPw, setSignPw] = useState('');
  const [nickname, setNickname] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const { signup, isSigningUp, signupError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signId || !signPw || !nickname) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    if (signPw !== confirmPw) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    signup(
      { signId, signPw, nickname },
      {
        onSuccess: (response) => {
          if (response.success) {
            alert('회원가입이 완료되었습니다!');
            onClose();
            if (onSignupSuccess) {
              onSignupSuccess();
            }
          } else {
            alert(response.message || '회원가입에 실패했습니다.');
          }
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message || '회원가입에 실패했습니다.';
          alert(message);
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative z-10 bg-white rounded-[32px] w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all no-scrollbar">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ChaengguAvatar size={32} mood="happy" />
              회원가입
            </h2>
            <button onClick={onClose} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-500">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">아이디</label>
              <input
                type="text"
                value={signId}
                onChange={(e) => setSignId(e.target.value)}
                placeholder="아이디를 입력하세요"
                className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">비밀번호</label>
              <input
                type="password"
                value={signPw}
                onChange={(e) => setSignPw(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">비밀번호 확인</label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
                className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>

            {signupError && (
              <div className="bg-rose-50 text-rose-700 text-sm p-3 rounded-xl">
                회원가입에 실패했습니다. 입력한 정보를 확인해주세요.
              </div>
            )}

            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full mt-4 bg-slate-900 text-white font-bold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
            >
              {isSigningUp ? '가입 중...' : '회원가입'}
            </button>
          </form>
        </div>
      </div>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
    </div>
  );
};
