import React from 'react';

export const NavTab = ({ active, onClick, icon: Icon, label }: any) => (
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
