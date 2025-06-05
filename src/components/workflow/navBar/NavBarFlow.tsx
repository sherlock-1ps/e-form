'use client'

import { useFlowStore } from '@/store/useFlowStore'
import { Button, IconButton, TextField, Typography } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { EditOutlined } from '@mui/icons-material'

const NavBarFlow = ({ onCreate, onUpdate, onUpdateVersion }: any) => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const flow = useFlowStore(state => state.flow)
  const updateFlowInfo = useFlowStore(state => state.updateFlowInfo)

  const handleSave = async () => {
    if (flow?.isContinue) {
      if (!flow?.newVersion) {
        onUpdate()
      } else {
        onUpdateVersion()
      }
    } else {
      onCreate()
    }
  }

  return (
    <>
      <div className='flex flex-col flex-1'>
        <div className='flex  items-center flex-1'>
          <Typography className='text-nowrap mr-2'>Name :</Typography>

          <TextField
            value={flow?.name ?? ''}
            onChange={e => updateFlowInfo({ name: e.target.value })}
            variant='standard'
            className='max-w-[394px] w-full'
          />
          <IconButton edge='end' onMouseDown={e => e.preventDefault()} className='p-1'>
            <EditOutlined sx={{ width: '16px', height: '18px' }} />
          </IconButton>
        </div>
        <div className='flex gap-2 items-center'>
          <Typography className='text-nowrap'>version :</Typography>
          <TextField
            value={(flow?.newVersion || flow?.version) ?? ''}
            onChange={e => updateFlowInfo({ version: e.target.value })}
            variant='standard'
            disabled={flow?.isContinue}
          />
        </div>
      </div>
      <Button onClick={handleSave} variant='contained' className='flex items-center justify-center w-[144px] ml-2'>
        บันทึก
      </Button>
    </>
  )
}

export default NavBarFlow
