'use client'
// React Imports
import type { ReactNode } from 'react'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import LayoutContent from './components/vertical/LayoutContent'

// Util Imports
import { verticalLayoutClasses } from './utils/layoutClasses'
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
  Dashboard
} from '@mui/icons-material'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
// Styled Component Imports
import StyledContentWrapper from './styles/vertical/StyledContentWrapper'
import { IconButton, Typography } from '@mui/material'
import NotificationsDropdown from '@/components/layout/shared/NotificationsDropdown'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import FormFlowLayout from './FormFlowLayout'
import ProfileLayout from './ProfileLayout'
import { useDialog } from '@/hooks/useDialog'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { any } from 'valibot'
type VerticalLayoutProps = ChildrenType & {
  navigation?: ReactNode
  navbar?: ReactNode
  footer?: ReactNode
  formPropertyBar?: ReactNode
  dictionary?: any
}

const VerticalLayout = (props: VerticalLayoutProps) => {
  const { showDialog } = useDialog()
  const { lang: locale } = useParams()
  // Props
  const { navbar, footer, navigation, formPropertyBar, children, dictionary } = props
  const profile = useAuthStore(state => state.profile)
  const urlBase = useAuthStore(state => state.urlBase)
  // const urlLogin = useAuthStore(state => state.urlLogin)

  const pathname = usePathname()
  const router = useRouter()
  const target = `/${locale}/user/dashboard`

  const handleClick = (e: any) => {
    // เปรียบเทียบเฉพาะ path ไม่รวม query string
    if (pathname === target) {
      e.preventDefault()
      window.location.href = target // reload path (clear query too)
    }
  }

  return (
    <div className={classnames(verticalLayoutClasses.root, 'flex  flex-col flex-auto ')}>
      <div
        className='w-full h-[80px] px-8 md:px-16  flex items-center justify-center'
        style={{
          background: 'linear-gradient(to right, #1e69cb 10%, #2d78db 70%, #47b0ff 100%)'
        }}
      >
        <ProfileLayout />
      </div>
      <div className='w-full h-[64px] px-6 md:px-16 flex items-center justify-center bg-white shadow-sm'>
        <div className='w-full max-w-[1440px] flex gap-2 sm:gap-6 '>
          <Link
            href='#'
            // href={urlBase}
            className='flex gap-2'
            onClick={e => {
              showDialog({
                id: 'alertErrorToken',
                component: (
                  <ConfirmAlert
                    id='alertErrorToken'
                    title={'กลับสู่หน้าหลัก'}
                    content1={'คุณต้องการดำเนินการต่อหรือไม่'}
                    onClick={() => {
                      window.location.href = urlBase
                      // router.push(`/${locale}${notification?.data?.link}`)
                    }}
                  />
                ),
                size: 'sm'
              })
            }}
          >
            <Home style={{ width: '20px', height: '20px' }} className=' text-primary' />

            <Typography variant='h6' className='font-normal  hover:text-primary '>
              {dictionary['navigation']?.frontPages}
            </Typography>
          </Link>

          <Link href={target} onClick={handleClick} className='flex gap-2'>
            <Dashboard style={{ width: '20px', height: '20px' }} className='text-primary' />
            <Typography variant='h6' className='font-normal hover:text-primary'>
              {dictionary['navigation']?.dashboards}
            </Typography>
          </Link>

          {profile && ['1006', '1026'].some(id => profile.USER_GROUP_LISTS_ID.includes(id)) ? (
            <Link href={`/${locale}/user/report`} className='flex gap-2'>
              <Assessment style={{ width: '20px', height: '20px' }} className=' text-primary' />
              <Typography variant='h6' className='font-normal  hover:text-primary '>
                {dictionary['navigation']?.report}
              </Typography>
            </Link>
          ) : null}
          <FormFlowLayout />
        </div>
      </div>
      <div className='flex'>
        {navigation || null}
        <StyledContentWrapper
          className={classnames(verticalLayoutClasses.contentWrapper, 'flex flex-col min-is-0 is-full overflow-auto')}
        >
          {navbar || null}
          {/* Content */}
          <LayoutContent>{children}</LayoutContent>
          {footer || null}
        </StyledContentWrapper>
        {formPropertyBar || null}
      </div>
    </div>
  )
}

export default VerticalLayout
