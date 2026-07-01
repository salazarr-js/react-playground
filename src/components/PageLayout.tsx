import type { ReactNode } from 'react'
import PageFooter from './PageFooter'

type PageLayoutProps = {
  children: ReactNode
  hideFooter?: boolean // Omit the footer (e.g. the landing index)
}

/** Demo page layout: centered `page-container` column + sticky PageFooter (`hideFooter` drops it). */
export default function PageLayout({ children, hideFooter = false }: PageLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-gray-100">
      <main className="page-container flex-1 py-10">{children}</main>

      {!hideFooter && <PageFooter />}
    </div>
  )
}
