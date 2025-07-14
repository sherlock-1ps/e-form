/* eslint-disable react-hooks/exhaustive-deps */
'use client'

// React Imports
import { useEffect, useMemo, useRef, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

import { useDialog } from '@/hooks/useDialog'

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
  Assessment,
  SupervisedUserCircle
} from '@mui/icons-material'
import { useAuthStore } from '@/store/useAuthStore'
import { Typography } from '@mui/material'
import { useDictionary } from '@/contexts/DictionaryContext'

const FormFlowLayout = () => {
  const { showDialog } = useDialog()
  const profile = useAuthStore(state => state.profile)
  const { dictionary } = useDictionary()
  const { lang: locale } = useParams()

  return (
    <>
      {profile && ['1006', '1026'].some(id => profile.USER_GROUP_LISTS_ID.includes(id)) ? (
        <>
          {' '}
          <Link href={`/${locale}/admin/dashboard`} className='flex gap-2'>
            <InsertDriveFile style={{ width: '20px', height: '20px' }} className=' text-primary' />
            <Typography variant='h6' className='font-normal hover:text-primary '>
              {dictionary?.manageForm}
            </Typography>
          </Link>
          <Link href={`/${locale}/workflow/dashboard`} className='flex gap-2'>
            <AccountTree style={{ width: '20px', height: '20px' }} className=' text-primary' />
            <Typography variant='h6' className='font-normal hover:text-primary '>
              {dictionary?.manageFlow}
            </Typography>
          </Link>
          <Link href={`/${locale}/admin/acting`} className='flex gap-2'>
            <SupervisedUserCircle style={{ width: '20px', height: '20px' }} className=' text-primary' />
            <Typography variant='h6' className='font-normal hover:text-primary '>
              {dictionary?.actingOfDepartment}
            </Typography>
          </Link>
        </>
      ) : null}
    </>
  )
}

export default FormFlowLayout
