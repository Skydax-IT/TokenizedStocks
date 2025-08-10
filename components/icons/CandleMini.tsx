export default function CandleMini({ className = '', size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Wick */}
      <line
        x1="8"
        y1="2"
        x2="8"
        y2="14"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Candle body */}
      <rect
        x="6"
        y="5"
        width="4"
        height="6"
        rx="1"
        fill="currentColor"
      />
    </svg>
  )
}
