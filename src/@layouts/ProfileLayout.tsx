'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { IconButton, Typography } from '@mui/material'
import { useDialog } from '@/hooks/useDialog'
import ProfileDialog from '@/components/dialogs/profile/ProfileDialog'
import NotificationsDropdown from '@/components/layout/shared/NotificationsDropdown'
import useVerticalNav from '@/@menu/hooks/useVerticalNav'
import { useAuthStore } from '@/store/useAuthStore'
import { useDictionary } from '@/contexts/DictionaryContext'

const ProfileLayout = () => {
  const { showDialog } = useDialog()
  const profile = useAuthStore(state => state.profile)
  const router = useRouter()
  const pathname = usePathname()
  const { isBreakpointReached } = useVerticalNav()
  const { lang: locale } = useParams()
  const { dictionary } = useDictionary()
  const [showLangCard, setShowLangCard] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLangCard(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChangeLang = (langCode: string) => {
    setShowLangCard(false)
    const segments = pathname.split('/')
    segments[1] = langCode
    router.push(segments.join('/'))
  }

  return (
    <div className='flex items-center justify-between max-w-[1440px] w-full'>
      <div className='flex items-center gap-4 justify-center'>
        <Link href={'/'}>
          <img
            src='https://dtn.igenco.dev/media/logos/dtn/DTN_logo_blue.gif'
            alt='dtn-header'
            className='w-[94px] h-auto cursor-pointer'
          />
        </Link>
        <Typography
          className='leading-tight text-white font-normal hidden sm:block'
          variant={isBreakpointReached ? 'h6' : 'h4'}
        >
          {dictionary?.title}
        </Typography>
      </div>

      <div className='flex items-center justify-center gap-1'>
        <div className='relative' ref={langRef}>
          <IconButton onClick={() => setShowLangCard(prev => !prev)}>
            {locale == 'th' ? (
              <img src='/images/lang/langTH.png' alt='dtn-lang' className='w-[32px]' />
            ) : (
              <img src='/images/lang/langEN.png' alt='dtn-lang' className='w-[32px]' />
            )}
          </IconButton>

          {showLangCard && (
            <div className='absolute left-0 top-[110%] z-50 bg-white rounded shadow p-2 w-40'>
              <div
                className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded'
                onClick={() => handleChangeLang('th')}
              >
                <img src='/images/lang/langTH.png' alt='TH' className='w-[20px]' />
                <span>ภาษาไทย</span>
              </div>
              <div
                className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded'
                onClick={() => handleChangeLang('en')}
              >
                <img src='/images/lang/langEN.png' alt='EN' className='w-[20px]' />
                <span>English</span>
              </div>
            </div>
          )}
        </div>

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
          <img src='/images/iconProfile.png' alt='profile' className='w-[48px] rounded-full' />
        </IconButton>
      </div>
    </div>
  )
}

export default ProfileLayout
