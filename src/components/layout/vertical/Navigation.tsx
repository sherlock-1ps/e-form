/* eslint-disable react-hooks/exhaustive-deps */
'use client'

// React Imports
import { useEffect, useMemo, useRef, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

// MUI Imports
import { styled, useColorScheme, useTheme } from '@mui/material/styles'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

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

// Style Imports
import navigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'
import ToolboxFormNavigation from './ToolboxFormNavigation/ToolboxFormNavigation'

import { useDialog } from '@/hooks/useDialog'

import { useWatchFormStore } from '@/store/useFormScreenEndUserStore'

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

const Navigation = (props: Props) => {
  // Props
  const { showDialog } = useDialog()
  const { dictionary, mode, systemMode } = props
  const setWatchFormFalse = useWatchFormStore(state => state.setWatchFormFalse)

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
    setWatchFormFalse()
    if (pathname.includes('/admin/form')) {
      return <ToolboxFormNavigation />
    } else if (pathname.includes('/admin/form')) {
      return <VerticalMenu scrollMenu={scrollMenu} dictionary={dictionary} />
    } else {
      return null
    }
  }, [pathname])

  const renderNavigationMenu = useMemo(() => {
    if (pathname.includes('/draftform')) {
      return null
    } else if (pathname.includes('/admin/workflow')) {
      return null
    } else if (pathname.includes('/user/viewPdf')) {
      return null
    } else if (pathname.includes('/admin/form')) {
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
          {/* <NavHeader>
            <Link href={getLocalizedUrl('/', locale as Locale)}>
              <Logo />
            </Link>

          </NavHeader> */}
          {/* {!isBreakpointReached && (
            <section
              className='w-full h-[54px] px-3 flex items-center justify-between bg-white'
              style={{ borderBottom: '1px solid #11151A1F' }}
            >
              <Link href='/'>
                <IconButton
                  edge='end'
                  onMouseDown={e => e.preventDefault()}
                  className='flex items-center justify-center'
                >
                  <HomeOutlined sx={{ width: '24px', height: '24px' }} />
                </IconButton>
              </Link>
              <div className='flex '>
                <NotificationsDropdown iconColor={true} />
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
                  <AccountCircleIcon fontSize='medium' />
                </IconButton>
              </div>
            </section>
          )} */}

          <StyledBoxForShadow ref={shadowRef} />
          {renderNavigationContent}
        </VerticalNav>
      )
    } else {
      return null
    }
  }, [pathname])

  return renderNavigationMenu
}

export default Navigation
