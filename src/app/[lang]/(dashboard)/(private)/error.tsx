'use client'

import { Typography, Box } from '@mui/material'

type ErrorPageProps = {
  error: Error
}

const ErrorPage = ({ error }: ErrorPageProps) => {
  return (
    <Box p={4}>
      <Typography variant='h4' color='error' gutterBottom>
        Something went wrong in this path! Please try again!
      </Typography>
      <Typography variant='body1'>{error.message || 'An unexpected error occurred.'}</Typography>
    </Box>
  )
}

export default ErrorPage
