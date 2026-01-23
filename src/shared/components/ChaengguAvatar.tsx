import React from 'react';

export const ChaengguAvatar = ({ size = 40, mood = 'happy', className = '' }: { size?: number, mood?: 'happy'|'working'|'sad', className?: string }) => (
  <img 
    src="/img/chenguC.png" 
    alt="챙구 캐릭터" 
    width={size} 
    height={size} 
    className={className}
    style={{ objectFit: 'contain' }}
  />
);
