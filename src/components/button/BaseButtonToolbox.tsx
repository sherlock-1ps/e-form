import React from 'react'

import { Button, Typography } from '@mui/material'

type BaseButtonProps = {
  icon: React.ReactNode
  label?: string
  onClick?: () => void
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit'
}

const BaseButtonToolbox: React.FC<BaseButtonProps> = ({ icon, label, onClick, color = 'primary' }) => {
  return (
    <main className='flex flex-col items-center justify-center'>
      <Button
        color={color}
        variant='contained'
        onClick={onClick}
        className='
        flex flex-col items-center justify-center gap-1
        w-[38px] h-[38px] min-w-0 rounded-lg  shadow-md
        hover:bg-blue-700 active:shadow-inner
      '
      >
        <div className='text-white text-3xl'>{icon}</div>
      </Button>
      {label && (
        <Typography
          color='text.primary'
          fontSize={12}
          className={label === 'WYSIWYG Editor' ? 'text-center' : 'whitespace-nowrap'}
        >
          {label}
        </Typography>
      )}
    </main>
  )
}

export default BaseButtonToolbox
