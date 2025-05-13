'use client'

import { usePathname } from 'next/navigation'

import Navbar from '@components/layout/vertical/Navbar'

const NavbarContent = () => {
  const pathname = usePathname()

  const renderNavbarContent = () => {
    switch (pathname) {
      case '/dashboard':
        return <Navbar variant='dashboard' />
      case '/dashboard/form':
        return <Navbar variant='form' />
      case '/board':
        return <Navbar variant='board' />
      case '/workflow':
        return
      case '/draftform':
        return
      default:
        return <Navbar />
    }
  }

  return renderNavbarContent()
}

export default NavbarContent
