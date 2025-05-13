/* eslint-disable react-hooks/exhaustive-deps */
'use client'

// React Imports
import { useEffect, useMemo, useRef } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

// MUI Imports
import { styled, useColorScheme, useTheme } from '@mui/material/styles'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { Mode, SystemMode } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import VerticalNav, { NavHeader, NavCollapseIcons } from '@menu/vertical-menu'
import VerticalMenu from './VerticalMenu'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import navigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'
import ToolboxFormNavigation from './ToolboxFormNavigation/ToolboxFormNavigation'
import { IconButton } from '@mui/material'
import { Home, NotificationAddOutlined, SupervisedUserCircleOutlined } from '@mui/icons-material'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import NotificationsDropdown, { NotificationsType } from '../shared/NotificationsDropdown'
import { useDialog } from '@/hooks/useDialog'
import NormalSignDialog from '@/components/dialogs/sign/NormalSignDialog'
import ProfileDialog from '@/components/dialogs/profile/ProfileDialog'

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  mode: Mode
  systemMode: SystemMode
}

const StyledBoxForShadow = styled('div')(({ theme }) => ({
  top: 60,
  left: -8,
  zIndex: 2,
  opacity: 0,
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  height: theme.mixins.toolbar.minHeight,
  transition: 'opacity .15s ease-in-out',
  background: `linear-gradient(var(--mui-palette-background-paper) ${
    theme.direction === 'rtl' ? '95%' : '5%'
  }, rgb(var(--mui-palette-background-paperChannel) / 0.85) 30%, rgb(var(--mui-palette-background-paperChannel) / 0.5) 65%, rgb(var(--mui-palette-background-paperChannel) / 0.3) 75%, transparent)`,
  '&.scrolled': {
    opacity: 1
  }
}))

const notifications: NotificationsType[] = [
  {
    avatarImage: '',
    title: 'โปรดตรวจสอบและลงนาม',
    subtitle: 'ขออนุมัติเบิกค่าเช่าบ้าน 6005',
    time: '1h ago',
    read: false
  },
  {
    avatarImage: '',
    title: 'โปรดตรวจสอบและลงนาม',
    subtitle: 'ขออนุมัติเบิกค่าเช่าบ้าน 6005',
    time: '12h ago',
    read: false
  },
  {
    avatarImage: '',
    title: 'ดำเนินการเรียบร้อย',
    subtitle: 'ขออนุมัติเบิกค่าเช่าบ้าน 6005',
    time: 'May 18, 8:26 AM',
    read: true
  }
]

const Navigation = (props: Props) => {
  // Props
  const { showDialog } = useDialog()
  const { dictionary, mode, systemMode } = props

  // Hooks
  const pathname = usePathname()
  const verticalNavOptions = useVerticalNav()
  const { updateSettings, settings } = useSettings()

  const { lang: locale } = useParams()
  const { mode: muiMode, systemMode: muiSystemMode } = useColorScheme()
  const theme = useTheme()

  // Refs
  const shadowRef = useRef(null)

  // Vars
  const { isCollapsed, isHovered, collapseVerticalNav, isBreakpointReached } = verticalNavOptions
  const isServer = typeof window === 'undefined'
  const isSemiDark = settings.semiDark
  let isDark

  if (isServer) {
    isDark = mode === 'system' ? systemMode === 'dark' : mode === 'dark'
  } else {
    isDark = muiMode === 'system' ? muiSystemMode === 'dark' : muiMode === 'dark'
  }

  const scrollMenu = (container: any, isPerfectScrollbar: boolean) => {
    container = isBreakpointReached || !isPerfectScrollbar ? container.target : container

    if (shadowRef && container.scrollTop > 0) {
      // @ts-ignore
      if (!shadowRef.current.classList.contains('scrolled')) {
        // @ts-ignore
        shadowRef.current.classList.add('scrolled')
      }
    } else {
      // @ts-ignore
      shadowRef.current.classList.remove('scrolled')
    }
  }

  useEffect(() => {
    if (settings.layout === 'collapsed') {
      collapseVerticalNav(true)
    } else {
      collapseVerticalNav(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.layout])

  const renderNavigationContent = useMemo(() => {
    if (pathname.includes('/admin/form')) {
      return <ToolboxFormNavigation />
    } else {
      return <VerticalMenu scrollMenu={scrollMenu} dictionary={dictionary} />
    }
  }, [pathname])

  const renderNavigationMenu = useMemo(() => {
    if (pathname.includes('/draftform')) {
      return null
    } else {
      return (
        <VerticalNav
          customStyles={navigationCustomStyles(verticalNavOptions, theme)}
          collapsedWidth={71}
          backgroundColor='linear-gradient(to right, #47B0FF,#2D78DB, #1E69CB)'
          // backgroundColor='red'
          // eslint-disable-next-line lines-around-comment
          // The following condition adds the data-mui-color-scheme='dark' attribute to the VerticalNav component
          // when semiDark is enabled and the mode or systemMode is light
          {...(isSemiDark &&
            !isDark && {
              'data-mui-color-scheme': 'dark'
            })}
        >
          {/* Nav Header including Logo & nav toggle icons  */}
          <NavHeader>
            <Link href={getLocalizedUrl('/', locale as Locale)}>
              <Logo />
            </Link>
            {/* {!(isCollapsed && !isHovered) && (
          <NavCollapseIcons
            lockedIcon={<i className='tabler-circle-dot text-xl' />}
            unlockedIcon={<i className='tabler-circle text-xl' />}
            closeIcon={<i className='tabler-x text-xl' />}
            onClick={() => updateSettings({ layout: !isCollapsed ? 'collapsed' : 'vertical' })}
          />
        )} */}
          </NavHeader>
          <section
            className='w-full h-[54px] px-3 flex items-center justify-between bg-white'
            style={{ borderBottom: '1px solid #11151A1F' }}
          >
            <Link href='/'>
              <IconButton edge='end' onMouseDown={e => e.preventDefault()} className='flex items-center justify-center'>
                <Home sx={{ width: '24px', height: '24px', color: '#11151AE5' }} />
              </IconButton>
            </Link>
            <div className='flex '>
              {/* <NotificationAddOutlined sx={{ width: '24px', height: '24px', color: '#11151AE5' }} /> */}
              <NotificationsDropdown notifications={notifications} />
              <IconButton
                edge='end'
                onMouseDown={e => e.preventDefault()}
                className='flex items-center justify-center'
                onClick={() => {
                  showDialog({
                    id: 'alertProfileDialog',
                    component: <ProfileDialog id='alertProfileDialog' />,
                    size: 'sm'
                  })
                }}
              >
                <CustomAvatar size={24}>{getInitials('Napat')}</CustomAvatar>
              </IconButton>
            </div>
          </section>
          <StyledBoxForShadow ref={shadowRef} />
          {renderNavigationContent}
        </VerticalNav>
      )
    }
  }, [pathname])

  return renderNavigationMenu
}

export default Navigation
