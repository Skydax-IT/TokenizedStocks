import React from 'react';

export default function LogoMark({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 28 28" 
      aria-label="Tokenized Stocks" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect 
        x="1.5" 
        y="1.5" 
        width="25" 
        height="25" 
        rx="7" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      />
      <rect 
        x="6" 
        y="7" 
        width="16" 
        height="3" 
        rx="1.5" 
        fill="currentColor"
      />
      <rect 
        x="12.5" 
        y="10.5" 
        width="3" 
        height="11" 
        rx="1.5" 
        fill="currentColor"
      />
      <path 
        d="M8 18c2.5 2.2 9.5 2.2 12 0" 
        stroke="currentColor" 
        strokeWidth="1.75" 
        strokeLinecap="round" 
        opacity="0.6"
      />
    </svg>
  )
}
