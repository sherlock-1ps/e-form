/* eslint-disable react-hooks/exhaustive-deps */
'use client'

// React Imports
import { useEffect, useMemo, useRef, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'

import { useDialog } from '@/hooks/useDialog'
import NormalSignDialog from '@/components/dialogs/sign/NormalSignDialog'
import ProfileDialog from '@/components/dialogs/profile/ProfileDialog'
import { useFetchNotificationQueryOption } from '@/queryOptions/form/formQueryOptions'
import { useWatchFormStore } from '@/store/useFormScreenEndUserStore'
import {
  ViewKanban,
  Draw,
  InsertDriveFile,
  AccountTree,
  SmsFailed,
  RuleFolder,
  Home,
  PermMedia,
  Task,
  Add,
  PushPin,
  ViewList,
  AssignmentTurnedIn,
  Assessment
} from '@mui/icons-material'
import { useAuthStore } from '@/store/useAuthStore'
import { IconButton, Typography } from '@mui/material'
import NotificationsDropdown from '@/components/layout/shared/NotificationsDropdown'
import useVerticalNav from '@/@menu/hooks/useVerticalNav'

const ProfileLayout = () => {
  const { showDialog } = useDialog()
  const profile = useAuthStore(state => state.profile)
  const router = useRouter()
  const { isBreakpointReached } = useVerticalNav()

  const { lang: locale } = useParams()

  return (
    <div className='flex items-center justify-between max-w-[1440px] w-full '>
      <div className='flex items-center gap-4 justify-center'>
        <Link href={'/'}>
          <img src='https://dtn.igenco.dev/media/logos/dtn/dtn-logo.png' alt='dtn-header' className='w-[94px] h-auto cursor-pointer' />
        </Link>
        <Typography
          className='leading-tight text-white font-normal hidden sm:block'
          variant={isBreakpointReached ? 'h6' : 'h4'}
        >
          ระบบสำนักงานอิเล็กทรอนิกส์ (DTN e-Office : e-Workflow)
        </Typography>
      </div>
      <div className='flex items-center justify-center gap-1'>
        <IconButton>
          <img src='/images/lang/langTH.png' alt='dtn-lang' className='w-[32px]' />
        </IconButton>
        <NotificationsDropdown />

        <IconButton
          onClick={() =>
            showDialog({
              id: 'alertProfileDialog',
              component: <ProfileDialog id='alertProfileDialog' />,
              size: 'sm'
            })
          }
        >
          <img src='/images/iconProfile.png' alt='dtn-lang' className='w-[48px] rounded-full' />
        </IconButton>
      </div>
    </div>
  )
}

export default ProfileLayout
