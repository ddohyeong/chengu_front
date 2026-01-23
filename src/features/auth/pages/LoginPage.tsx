import React, { useState } from 'react';
import { ChaengguAvatar } from '@/shared/components/ChaengguAvatar';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = ({ onLoginSuccess, onShowSignup }: { onLoginSuccess: () => void, onShowSignup?: () => void }) => {
  const [signId, setSignId] = useState('');
  const [signPw, setSignPw] = useState('');
  const { login, isLoggingIn, loginError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signId || !signPw) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    login(
      { signId, signPw },
      {
        onSuccess: (response) => {
          if (response.success) {
            onLoginSuccess();
          } else {
            alert(response.message || '로그인에 실패했습니다.');
          }
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message || '로그인에 실패했습니다.';
          alert(message);
        },
      }
    );
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <ChaengguAvatar size={80} mood="happy" className="mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">챙구</h1>
          <p className="text-sm text-slate-500">내 물건 챙겨주는 친구</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">아이디</label>
            <input
              type="text"
              value={signId}
              onChange={(e) => setSignId(e.target.value)}
              placeholder="아이디를 입력하세요"
              className="w-full px-4 py-3 bg-white border-0 rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">비밀번호</label>
            <input
              type="password"
              value={signPw}
              onChange={(e) => setSignPw(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3 bg-white border-0 rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 transition-all shadow-sm"
            />
          </div>

          {loginError && (
            <div className="bg-rose-50 text-rose-700 text-sm p-3 rounded-xl">
              로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.
            </div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
          >
            {isLoggingIn ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {onShowSignup && (
          <div className="mt-4 text-center">
            <button
              onClick={onShowSignup}
              className="text-sm text-slate-500 hover:text-slate-900 font-medium"
            >
              계정이 없으신가요? 회원가입
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
