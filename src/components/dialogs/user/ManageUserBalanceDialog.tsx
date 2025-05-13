'use client'

// React Imports
import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import { Divider, Grid, InputAdornment, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'

interface ConfirmProps {
  title: string
  mode?: string
  id: string
  onClick: () => void
}

const ManageUserBalanceDialog = ({ id, title, mode, onClick }: ConfirmProps) => {
  const { closeDialog } = useDialog()
  const [amount, setAmount] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [isConfirm, setIsConfirm] = useState(false)

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
  }

  const handleNoteChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const numericAmount = parseFloat(amount)

    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Please enter a valid amount', { autoClose: 2000 })

      return
    }

    setIsConfirm(true)
  }

  return (
    <Grid container className='flex flex-col gap-4 max-w-[360px]' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>{title}</Typography>
      </Grid>

      {isConfirm ? (
        <div className=' w-[360px] '>
          <Typography>Are you sure you want to {mode === 'topup' ? 'Topup' : 'Subtract'} this user?</Typography>
          <Divider className='my-2' />
          <div className='flex gap-2 mt-4 w-full items-center '>
            <img
              src={`/images/user/${mode === 'topup' ? 'topup' : 'subtract'}Image.png`}
              width={84}
              alt='icon_balance'
              className=' rounded'
            />
            <div className='w-full'>
              <Typography variant='h6'>ID: BOFXKL123456789</Typography>
              <div className='flex gap-1 items-center justify-between'>
                <Typography>Current Balance</Typography>
                <Typography>$200.00</Typography>
              </div>
              <div className='flex gap-1 items-center justify-between'>
                <Typography color={'success.main'}>{mode === 'topup' ? 'Topup' : 'Subtract'} Balance</Typography>
                <Typography color={'success.main'}>$200.00</Typography>
              </div>
              <Divider className='my-2' />
              <div className='flex gap-1 items-center justify-between'>
                <Typography>Total Balance</Typography>
                <Typography>$400.00</Typography>
              </div>
            </div>
          </div>
          <Divider className='my-2' />
          <Grid item xs={12} className='flex items-center justify-end gap-2 mt-4'>
            <Button variant='contained' color='secondary' onClick={() => setIsConfirm(false)}>
              Back
            </Button>

            <Button
              onClick={() => {
                closeDialog(id)
              }}
              variant='contained'
              color={mode === 'topup' ? 'success' : 'error'}
            >
              Confirm
            </Button>
          </Grid>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                fullWidth
                type='number'
                label={mode === 'topup' ? 'Topup Amount' : 'Subtract Amount'}
                placeholder='Enter amount'
                InputProps={{
                  startAdornment: <InputAdornment position='start'>$</InputAdornment>
                }}
                value={amount}
                onChange={handleAmountChange}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                fullWidth
                label='Note'
                placeholder='Add a note'
                value={note}
                onChange={handleNoteChange}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} className='flex items-center justify-end gap-2 mt-4'>
            <Button variant='contained' color='secondary' onClick={() => closeDialog(id)}>
              Cancel
            </Button>

            <Button type='submit' variant='contained' color={mode === 'topup' ? 'success' : 'error'}>
              {mode === 'topup' ? 'Topup' : 'Subtract'}
            </Button>
          </Grid>
        </form>
      )}
    </Grid>
  )
}

export default ManageUserBalanceDialog
