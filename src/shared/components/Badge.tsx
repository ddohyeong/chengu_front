import React from 'react';

export const Badge = ({ children, className }: { children?: React.ReactNode, className?: string }) => (
  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${className}`}>
    {children}
  </span>
);
