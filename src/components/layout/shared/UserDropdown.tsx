'use client'

// React Imports
import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

// Third-party Imports

// Type Imports
import type { Locale } from '@configs/i18n'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { signOut } from '@/app/actions/auth/authAction'
import { useDictionary } from '@/contexts/DictionaryContext'
import Axios from '@/libs/axios/axios'
import { useAuthStore } from '@/store/useAuthStore'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false)
  const name = useAuthStore(state => state.profile?.operator_name)

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()
  const { lang: locale } = useParams()
  const { dictionary } = useDictionary()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(getLocalizedUrl(url, locale as Locale))
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {
    try {
      const response = await Axios.get('/logout')

      if (response?.data?.code == 'SUCCESS') {
        useAuthStore.getState().clearTokens()
        // router.push(`${locale}/login`)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        // badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {/* <Avatar
          ref={anchorRef}
          alt={session?.user?.name || ''}
          src={'/images/setting-website/provider/provider8.png'}
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
        /> */}
        <Button ref={anchorRef} onClick={handleDropdownOpen} className='flex gap-2 items-center justify-center'>
          {name ?? ''}
          {open ? <i className='tabler-chevron-up' /> : <i className='tabler-chevron-down' />}
        </Button>
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  {/* <div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
                    <Avatar
                      alt={session?.user?.name || ''}
                      src={'/images/setting-website/provider/provider8.png'}

                    />
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        Oneplaybet No.1
                      </Typography>
                      <Typography variant='caption'>
                        oneplaybet@slot.com
                      </Typography>
                    </div>
                  </div> */}
                  {/* <Divider className='mlb-1' /> */}
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/profile')}>
                    <i className='tabler-user' />
                    <Typography color='text.primary'>{dictionary['myProfile']}</Typography>
                  </MenuItem>
                  {/* <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/pages/account-settings')}>
                    <i className='tabler-settings' />
                    <Typography color='text.primary'>Settings</Typography>
                  </MenuItem> */}
                  {/* <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/pages/pricing')}>
                    <i className='tabler-currency-dollar' />
                    <Typography color='text.primary'>Pricing</Typography>
                  </MenuItem> */}
                  {/* <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/pages/faq')}>
                    <i className='tabler-help-circle' />
                    <Typography color='text.primary'>FAQ</Typography>
                  </MenuItem> */}
                  <div className='flex items-center plb-2 pli-3'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='tabler-logout' />}
                      onClick={handleUserLogout}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      {dictionary['logout']}
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown
