'use client'

// Third-party Imports
import classnames from 'classnames'
import React from 'react'
import Link from 'next/link'

// Component Imports

import FormNavbarContent from './navbar/FormNavbarContent'
import SpreadsheetNavbarContent from './navbar/SpreadsheetNavbarContent'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

// Util Imports

import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import DashboardNavbarContent from './navbar/DashboardNavbarContent'
import { usePathname } from 'next/navigation'
import ClientUserNavbar from './navbar/ClientUserNavbar'
import NavToggle from './NavToggle'
import { Typography, IconButton } from '@mui/material'
import { useDialog } from '@/hooks/useDialog'
import { Home, NotificationAddOutlined, HomeOutlined } from '@mui/icons-material'
import NotificationsDropdown, { NotificationsType } from '../shared/NotificationsDropdown'
import ProfileDialog from '@/components/dialogs/profile/ProfileDialog'

interface NavbarContentProps {}

const NavbarContent: React.FC<NavbarContentProps> = () => {
  const { showDialog } = useDialog()

  const pathname = usePathname()
  function renderNavbar() {
    if (pathname.includes('form')) return
    if (pathname.includes('dashboard')) return <DashboardNavbarContent />

    return <SpreadsheetNavbarContent />
  }

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-2 justify-between w-full'>
        <div className='flex gap-4 items-center'>
          <div className=' self-end'>
            <NavToggle />
          </div>

          <Link href='/'>
            <img
              src={'/images/DTN_logo_blue.gif'}
              alt={`logo_sarabun`}
              // width={100}
              height={40}
              className='mt-[-8px]'
            />
          </Link>
        </div>
        <div className='flex items-center gap-2'>
          <Link href='/'>
            <IconButton edge='end' onMouseDown={e => e.preventDefault()} className='flex items-center justify-center'>
              <HomeOutlined sx={{ width: '24px', height: '24px' }} className=' text-backgroundDefault' />
            </IconButton>
          </Link>
          <NotificationsDropdown />
          <IconButton
            edge='end'
            onMouseDown={e => e.preventDefault()}
            className='flex items-center justify-center m-0 p-0'
            onClick={() => {
              showDialog({
                id: 'alertProfileDialog',
                component: <ProfileDialog id='alertProfileDialog' />,
                size: 'sm'
              })
            }}
          >
            <AccountCircleIcon fontSize='medium' className=' text-backgroundDefault' />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default NavbarContent
