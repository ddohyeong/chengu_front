import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ChaengguAvatar } from './ChaengguAvatar';

export const Header = ({ title, subtitle, action, showLogo, onBack }: { title?: string, subtitle?: string, action?: React.ReactNode, showLogo?: boolean, onBack?: () => void }) => (
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
