
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar'
import type { ReactNode } from 'react'
import Header from '../Header' 

interface LayoutProps {
  children?: ReactNode
  showBack?: boolean
}

export default function Layout({ children, showBack = false }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header showBack={showBack} />
        <main className="flex-1 overflow-auto p-8 scrollbar-hide">
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  )
}