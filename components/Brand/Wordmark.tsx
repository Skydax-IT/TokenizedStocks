import LogoMark from './LogoMark'

export default function Wordmark({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`} aria-label="Tokenized Stocks">
      <LogoMark />
      <span className="font-display text-lg tracking-tight" style={{ color: 'currentColor' }}>
        <span className="font-semibold">Tokenized</span>
        <span className="opacity-90"> Stocks</span>
      </span>
    </div>
  )
}
