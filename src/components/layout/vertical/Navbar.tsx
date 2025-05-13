'use client'
import type { FC } from 'react'

// Component Imports
import LayoutNavbar from '@layouts/components/vertical/Navbar'
import NavbarContent from './NavbarContent'
import { usePathname } from 'next/navigation'

interface NavbarProps {
  variant?: string
}

const Navbar: FC<NavbarProps> = () => {
  const hideNavbarPages = ['/user', '/admin', '/draftform', '/workflow']
  const pathname = usePathname()

  const shouldHideNavbar = hideNavbarPages.some(path => pathname.includes(path))

  if (shouldHideNavbar) return null

  return (
    <LayoutNavbar>
      <NavbarContent />
    </LayoutNavbar>
  )
}

export default Navbar
