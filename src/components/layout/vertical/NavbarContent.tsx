'use client'

// Third-party Imports
import classnames from 'classnames'
import React from 'react'

// Component Imports

import FormNavbarContent from './navbar/FormNavbarContent'
import SpreadsheetNavbarContent from './navbar/SpreadsheetNavbarContent'

// Util Imports

import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import DashboardNavbarContent from './navbar/DashboardNavbarContent'
import { usePathname } from 'next/navigation'
import ClientUserNavbar from './navbar/ClientUserNavbar'

interface NavbarContentProps {}

const NavbarContent: React.FC<NavbarContentProps> = () => {
  const pathname = usePathname()
  function renderNavbar() {
    if (pathname.includes('form')) return
    if (pathname.includes('dashboard')) return <DashboardNavbarContent />

    return <SpreadsheetNavbarContent />
  }

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      {/* hamberger and theme  */}
      {/* <div className='flex items-center gap-4'>
        <NavToggle />
        <ModeDropdown />
      </div> */}
      {renderNavbar()}
    </div>
  )
}

export default NavbarContent
