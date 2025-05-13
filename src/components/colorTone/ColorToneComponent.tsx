'use client'

import { Grid, Typography, Box } from '@mui/material'

const colors = [
  { label: 'โทนสีหลัก', color: '#7B61FF' },
  { label: 'โทนสีรอง', color: '#F4C76E' },
  { label: 'สีเสริม 1', color: '#FF6B6B' },
  { label: 'สีเสริม 2', color: '#4ECDC4' },
  { label: 'สีเสริม 3', color: '#FFB400' },
  { label: 'สีเสริม 4', color: '#1A535C' },
  { label: 'สีพิเศษ 1', color: '#FF4081' },
  { label: 'สีพิเศษ 2', color: '#8BC34A' },
  { label: 'สีพิเศษ 3', color: '#00BCD4' },
  { label: 'สีพิเศษ 4', color: '#795548' },
  { label: 'สีพิเศษ 5', color: '#9C27B0' },
  { label: 'สีพิเศษ 6', color: '#607D8B' },
  { label: 'สีขาว 1', color: '#FFFFFF' },
  { label: 'สีขาว 2', color: '#F5F5F5' },
  { label: 'สีขาว 3', color: '#E0E0E0' },
  { label: 'สีขาว 4', color: '#D6D6D6' },
  { label: 'สีขาว 5', color: '#C0C0C0' },
  { label: 'สีขาว 6', color: '#B0B0B0' }
]

const ColorToneComponent = () => {
  return (
    <Grid container spacing={6} justifyContent='start' alignItems='center'>
      {colors.map((item, index) => (
        <Grid key={index} item xs={12} sm={2} textAlign='center'>
          <Typography variant='h6' fontWeight='bold'>
            {item.label}
          </Typography>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              backgroundColor: item.color,
              margin: '8px auto'
            }}
          />
          <Typography variant='body2' fontWeight='bold'>
            {item.color}
          </Typography>
        </Grid>
      ))}
    </Grid>
  )
}

export default ColorToneComponent
