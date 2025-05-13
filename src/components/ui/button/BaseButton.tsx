'use client'
import React from 'react'

import { Button, Typography } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'

interface BaseButtonProps {
  text?: string // Button text
  icon?: SvgIconComponent // Icon to display
  iconPosition?: 'left' | 'right' // Position of the icon
  color?: 'primary' | 'secondary' | 'error' | 'inherit' | 'success' | 'info' | 'warning' // Updated color options
  onClick?: () => void // Click handler
  sx?: object
}

const BaseButton: React.FC<BaseButtonProps> = ({
  text,
  icon: Icon,
  iconPosition = 'left',
  color = 'primary',
  onClick,
  sx
}) => {
  return (
    <Button
      variant='contained'
      type='submit'
      color={color}
      onClick={onClick}
      style={{
        backgroundColor: color == 'primary' ? '#0463EA' : 'rgba(4, 99, 234, 0.16)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: 0,
        ...sx
      }}
    >
      {Icon && iconPosition === 'left' && <Icon sx={{ color: color === 'primary' ? 'white' : '#0463EA' }} />}
      {text && <Typography color={color === 'primary' ? 'white' : '#0463EA'}>{text}</Typography>}
      {Icon && iconPosition === 'right' && <Icon sx={{ color: color === 'primary' ? 'white' : '#0463EA' }} />}
    </Button>
  )
}

export default BaseButton
