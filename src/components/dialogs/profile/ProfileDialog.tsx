'use client'

// MUI Imports
import { Avatar, Button, Grid, Typography, Divider } from '@mui/material'
import { Email, Phone, Work, LocationOn } from '@mui/icons-material'

import { useDialog } from '@/hooks/useDialog'

interface profileProps {
  id: string
}

const ProfileDialog = ({ id }: profileProps) => {
  const { closeDialog } = useDialog()

  const mockProfile = {
    name: 'สมชาย ใจดี',
    email: 'somchai@example.com',
    phone: '081-234-5678',
    role: 'หัวหน้าฝ่ายบุคคล',
    location: 'สำนักงานใหญ่ กรุงเทพฯ',
    avatarUrl: '/images/avatars/avatar-1.png'
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h5' className='text-center'>
          โปรไฟล์ผู้ใช้งาน
        </Typography>
      </Grid>

      <Grid item xs={12} className='flex flex-col items-center gap-2'>
        <Avatar src={mockProfile.avatarUrl} sx={{ width: 80, height: 80 }} />
        <Typography variant='h6'>{mockProfile.name}</Typography>
        <Typography variant='body2' color='textSecondary'>
          {mockProfile.role}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} className='flex items-center gap-2'>
            <Email fontSize='small' />
            <Typography>{mockProfile.email}</Typography>
          </Grid>
          <Grid item xs={12} className='flex items-center gap-2'>
            <Phone fontSize='small' />
            <Typography>{mockProfile.phone}</Typography>
          </Grid>
          <Grid item xs={12} className='flex items-center gap-2'>
            <LocationOn fontSize='small' />
            <Typography>{mockProfile.location}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProfileDialog
