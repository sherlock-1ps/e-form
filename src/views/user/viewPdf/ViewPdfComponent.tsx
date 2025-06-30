/* eslint-disable react-hooks/exhaustive-deps */
// MUI Imports
'use client'

import CustomTextField from '@/@core/components/mui/TextField'
import { Button, Card, CardContent, Divider, IconButton, InputAdornment, MenuItem, Tab } from '@mui/material'
import type { TextFieldProps } from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import type { SyntheticEvent } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { DoneAll, PendingActions } from '@mui/icons-material'
import EditorForm from '@/components/e-form/newDefault/EditorForm'

const ViewPdfComponent = () => {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { lang: locale } = params
  const url = searchParams.get('url')

  return (
    <div className='w-full bg-white h-screen'>
      <iframe src={url || ''} className='w-full h-full' style={{ border: 'none' }} allowFullScreen />
    </div>
  )
}

export default ViewPdfComponent
