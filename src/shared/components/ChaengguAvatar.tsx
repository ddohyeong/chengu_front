import React from 'react';

export const ChaengguAvatar = ({ size = 40, mood = 'happy', className = '' }: { size?: number, mood?: 'happy'|'working'|'sad', className?: string }) => (
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
