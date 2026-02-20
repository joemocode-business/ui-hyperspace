import { clsx } from 'clsx'

export type StatCardProps = {
  label: string
  value: string
  limit?: string
  usage?: string
  className?: string
}

export function StatCard({
  label,
  value,
  limit,
  usage,
  className,
}: StatCardProps) {
  return (
    <div
      className={clsx(
        'relative rounded-lg border border-(--color-border-base) bg-white p-5',
        className,
      )}
    >
      {/* Top row: label + usage */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {label}
        </span>
        {usage && (
          <span className="shrink-0 text-xs text-zinc-400">{usage}</span>
        )}
      </div>

      {/* Value + optional limit */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold text-zinc-950">{value}</span>
        {limit && (
          <span className="text-base text-zinc-400">{limit}</span>
        )}
      </div>
    </div>
  )
}
