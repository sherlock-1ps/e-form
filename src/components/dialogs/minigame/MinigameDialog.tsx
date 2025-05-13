// React Imports

// MUI Imports
import type { ChangeEvent} from 'react';
import { useState } from 'react'

import Button from '@mui/material/Button'
import { Grid, InputAdornment, MenuItem, Typography } from '@mui/material'
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
    value: 'real',
    title: 'ของรางวัล',
    isSelected: true
  },
  {
    value: 'fake',
    title: 'รางวัลหลอก'
  }
]

const ConfirmAlert = ({ id, title, content, onClick }: confirmProps) => {
  const { closeDialog } = useDialog()

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

  return (
    <Grid container className='flex flex-col gap-4 min-w-[350px]' spacing={2}>
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

      <Grid item xs={12} sm>
        <CustomTextField select fullWidth defaultValue='' label='Default' id='custom-select'>
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>คอยโบนัส</MenuItem>
          <MenuItem value={20}>ลูกดอก</MenuItem>
          <MenuItem value={30}>กุญแจ</MenuItem>
        </CustomTextField>
      </Grid>

      <Grid item xs={12} sm>
        <CustomTextField fullWidth label='จำนวน' placeholder='จำนวนเงินรางวัล' />
      </Grid>

      <Grid item xs={12} sm>
        <CustomTextField
          fullWidth
          label='เปอร์เซ็นต์การออก'
          placeholder='เปอร์เซ็นต์การออก'
          type='number'
          InputProps={{
            endAdornment: <InputAdornment position='end'>%</InputAdornment>
          }}
        />
      </Grid>

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
          Add
        </Button>
      </Grid>
    </Grid>
  )
}

export default ConfirmAlert
