export const SkeletonLine = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-[#2a2a2b] ${className}`} />
)

export const SkeletonCircle = ({ size = 48, className = '' }: { size?: number; className?: string }) => (
  <div
    className={`animate-pulse rounded-full bg-[#2a2a2b] shrink-0 ${className}`}
    style={{ width: size, height: size }}
  />
)

export const SkeletonCard = () => (
  <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-4 space-y-3'>
    <div className='flex items-center gap-3'>
      <SkeletonCircle size={40} />
      <div className='flex-1 space-y-2'>
        <SkeletonLine className='h-3 w-1/3' />
        <SkeletonLine className='h-2.5 w-1/5' />
      </div>
    </div>
    <div className='space-y-2'>
      <SkeletonLine className='h-3 w-full' />
      <SkeletonLine className='h-3 w-2/3' />
    </div>
    <SkeletonLine className='h-48 w-full rounded-lg' />
    <div className='flex gap-6 pt-1'>
      <SkeletonLine className='h-3 w-16' />
      <SkeletonLine className='h-3 w-16' />
      <SkeletonLine className='h-3 w-16' />
    </div>
  </div>
)

export const SkeletonUserRow = () => (
  <div className='flex items-center gap-3 rounded-lg p-2'>
    <SkeletonCircle size={56} />
    <div className='flex-1 space-y-2'>
      <SkeletonLine className='h-3.5 w-1/3' />
      <SkeletonLine className='h-3 w-1/5' />
    </div>
  </div>
)
