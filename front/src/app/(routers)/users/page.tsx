import { Suspense } from 'react'
import { SearchResultsPage } from '@/common/pages'
import { VkPageSkeleton } from '@/common/pages/home-page/ui/vk'

// useSearchParams требует Suspense, иначе падает пререндер при сборке
export default function UsersPage() {
  return (
    <Suspense fallback={<VkPageSkeleton variant='search' />}>
      <SearchResultsPage />
    </Suspense>
  )
}
