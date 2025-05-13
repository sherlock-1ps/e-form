'use client'
import { useState } from 'react'

import { InsertDriveFileOutlined, AccountTreeOutlined } from '@mui/icons-material'

// Component Imports

// Util Imports
import type { SelectChangeEvent } from '@mui/material'
import {
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography
} from '@mui/material'

const DashboardNavbarContent = () => {
  return (
    <Card>
      <CardContent className='flex gap-2 items-center justify-end'>
        <Button variant='contained' className='capitalize' startIcon={<InsertDriveFileOutlined />}>
          จัดการแบบฟอร์ม
        </Button>
        <Button color='secondary' variant='contained' className='capitalize' startIcon={<AccountTreeOutlined />}>
          จัดการเวิร์กโฟลว์
        </Button>
      </CardContent>
    </Card>
  )
}

export default DashboardNavbarContent
