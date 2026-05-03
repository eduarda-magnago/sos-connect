
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar'
import type { ReactNode } from 'react'
// import Header from '../Header'

interface LayoutProps {
  children?: ReactNode
  showBack?: boolean
}

export default function Layout({ children, showBack = false }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* <Header showBack={showBack} /> */}
        <main className="flex-1 p-8">
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  )
}