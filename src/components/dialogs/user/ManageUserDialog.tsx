'use client'
// React Imports
// MUI Imports
import type { ChangeEvent } from 'react'
import { useState } from 'react'

import Button from '@mui/material/Button'
import { Checkbox, FormControlLabel, Grid, IconButton, InputAdornment, MenuItem, Typography } from '@mui/material'
import classnames from 'classnames'

import { useDialog } from '@/hooks/useDialog'
import CustomInputVertical from '@/@core/components/custom-inputs/Vertical'
import CustomTextField from '@/@core/components/mui/TextField'

interface confirmProps {
  title: string
  content?: string
  id: string
  onClick: () => void
}

const data: any = [
  {
    value: 'solo',
    title: 'คนเดียว',
    isSelected: true
  },
  {
    value: 'multi',
    title: 'หลายคน'
  }
]

const ManageUserDialog = ({ id, title, content, onClick }: confirmProps) => {
  const { closeDialog } = useDialog()
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setConfirmIsPasswordShown] = useState(false)
  const [isAddBank, setIsAddBank] = useState(false)

  const initialSelected: string = data.filter((item: any) => item.isSelected)[
    data.filter((item: any) => item.isSelected).length - 1
  ].value

  // States
  const [selected, setSelected] = useState<string>(initialSelected)

  const handleChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setSelected(prop)
    } else {
      setSelected((prop.target as HTMLInputElement).value)
    }
  }

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowConfirmPassword = () => setConfirmIsPasswordShown(show => !show)

  return (
    <Grid container className='flex flex-col gap-4 max-w-[430px]' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>{title}</Typography>
      </Grid>
      <Grid container spacing={3} className='w-full flex items-center justify-center'>
        {data.map((item: any, index: number) => {
          let asset

          if (item.asset && typeof item.asset === 'string') {
            asset = <i className={classnames(item.asset, 'text-[28px]')} />
          }

          return (
            <CustomInputVertical
              type='radio'
              key={index}
              data={{ ...item, asset }}
              selected={selected}
              name='custom-radios-icons'
              handleChange={handleChange}
            />
          )
        })}
      </Grid>

      <form onSubmit={e => e.preventDefault()}>
        <Grid container spacing={5}>
          {selected == 'solo' && (
            <Grid item xs={12} sm={6}>
              <CustomTextField fullWidth label='Mobile Number' placeholder='Mobile Number' />
            </Grid>
          )}

          <Grid item xs={12} sm={selected == 'solo' ? 6 : 12}>
            <CustomTextField fullWidth label='Agent Code' placeholder='Agent Code' />
          </Grid>

          {selected !== 'solo' && (
            <Grid item xs={12} sm={6}>
              <CustomTextField fullWidth label='Moblie number' placeholder='Moblie number' />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              label='Password'
              placeholder='············'
              type={isPasswordShown ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                      <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {selected == 'solo' && (
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Confirm Password'
                placeholder='············'
                type={isConfirmPasswordShown ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isConfirmPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          )}

          {selected == 'solo' && (
            <Grid item xs={12}>
              <FormControlLabel
                label='เพิ่มข้อมูลธนาคาร'
                control={
                  <Checkbox
                    checked={isAddBank}
                    onChange={e => {
                      setIsAddBank(e.target.checked)
                    }}
                  />
                }
              />
            </Grid>
          )}

          {selected !== 'solo' && (
            <Grid item xs={12} sm={12}>
              <Button fullWidth variant='outlined' color='info' onClick={() => {}}>
                add more
              </Button>
            </Grid>
          )}

          {isAddBank && selected == 'solo' && (
            <>
              <Grid item xs={12}>
                <CustomTextField select fullWidth defaultValue='' label='Bank'>
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>SCB</MenuItem>
                  <MenuItem value={20}>KBANK</MenuItem>
                  <MenuItem value={30}>BBL</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField fullWidth label='Mobile Number' placeholder='Mobile Number' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField fullWidth label='Agent Code' placeholder='Agent Code' />
              </Grid>
            </>
          )}
        </Grid>
      </form>

      <Grid item xs={12} className='flex items-center  justify-end gap-2'>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => {
            closeDialog(id)
          }}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            closeDialog(id), onClick()
          }}
        >
          Add User
        </Button>
      </Grid>
    </Grid>
  )
}

export default ManageUserDialog
