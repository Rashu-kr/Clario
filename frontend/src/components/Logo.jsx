import React from 'react';

export const Logo = ({ className = "h-8", showText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="36" rx="10" fill="#0F172A" />
        <path d="M12 28V12L28 20L12 28Z" fill="#FFFFFF" />
        <circle cx="28" cy="20" r="4" fill="#2563EB" />
      </svg>
      {showText && (
        <span className="font-sans text-xl font-bold tracking-tight text-[#0F172A]">
          Clario
        </span>
      )}
    </div>
  );
};
