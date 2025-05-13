// React Imports

// MUI Imports
import type { SyntheticEvent } from 'react'
import { ChangeEvent, useState } from 'react'

import Button from '@mui/material/Button'
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  MenuItem,
  Tab,
  Typography
} from '@mui/material'
import classnames from 'classnames'

import TabContext from '@mui/lab/TabContext'

import TabList from '@mui/lab/TabList'

import TabPanel from '@mui/lab/TabPanel'

import { useDialog } from '@/hooks/useDialog'
import CustomInputVertical from '@/@core/components/custom-inputs/Vertical'
import CustomTextField from '@/@core/components/mui/TextField'

interface confirmProps {
  title: string
  mode?: string
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

const ManageDepositDialog = ({ id, title, mode, onClick }: confirmProps) => {
  const { closeDialog } = useDialog()
  const [value, setValue] = useState<string>('1')

  const initialSelected: string = data.filter((item: any) => item.isSelected)[
    data.filter((item: any) => item.isSelected).length - 1
  ].value

  // States
  const [selected, setSelected] = useState<string>(initialSelected)

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <div className='flex flex-col max-w-[400px]'>
      <DialogTitle className='flex flex-col gap-2 text-center '>
        <Typography variant='h5'>{title}</Typography>
      </DialogTitle>
      <TabContext value={value}>
        <form onSubmit={e => e.preventDefault()}>
          <TabList onChange={handleChange}>
            <Tab value='1' label='Bank Detail' />
            <Tab value='2' label='Autometic' />
            {mode == 'rest' && <Tab value='3' label='Move condition' />}
          </TabList>
          <TabPanel value='1'>
            <Grid container spacing={4}>
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
              <Grid item xs={12}>
                <CustomTextField fullWidth autoComplete='off' label='Bank own name' placeholder='name' />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField fullWidth autoComplete='off' label='Bank Number' placeholder='Bank Number' />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField fullWidth label='Use with (Optional)' autoComplete='off' placeholder='Use with' />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  fullWidth
                  label='Limit Balance (Optional)'
                  autoComplete='off'
                  placeholder='Limit Balance'
                />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value='2'>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <CustomTextField select fullWidth defaultValue='' label='Autometic System'>
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Line License</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue=''
                  label=''
                  SelectProps={{
                    displayEmpty: true
                  }}
                >
                  <MenuItem value='' disabled>
                    <em className=' opacity-50'>Choose License</em>
                  </MenuItem>
                  <MenuItem value={10}>1</MenuItem>
                  <MenuItem value={20}>2</MenuItem>
                  <MenuItem value={30}>3</MenuItem>
                </CustomTextField>
              </Grid>

              {mode == 'withdraw' && (
                <Grid item xs={12}>
                  <CustomTextField fullWidth label='Max auto verify' autoComplete='off' placeholder='Less than' />
                </Grid>
              )}
            </Grid>
          </TabPanel>

          {mode == 'rest' && (
            <TabPanel value='3'>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    autoComplete='off'
                    label='Limit Balance'
                    placeholder='Enter limit balance'
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Move to when over limit</Typography>
                  <CustomTextField
                    select
                    fullWidth
                    defaultValue=''
                    label=''
                    SelectProps={{
                      displayEmpty: true
                    }}
                  >
                    <MenuItem value='' disabled>
                      <em className=' opacity-50'>Choose Bank</em>
                    </MenuItem>
                    <MenuItem value={10}>KBANK</MenuItem>
                    <MenuItem value={20}>SCB</MenuItem>
                    <MenuItem value={30}>BBL</MenuItem>
                  </CustomTextField>
                </Grid>
                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    autoComplete='off'
                    label='Balance amount'
                    placeholder='Enter balance want to move'
                  />
                </Grid>
              </Grid>
            </TabPanel>
          )}
        </form>
      </TabContext>
      <Grid item xs={12} className='flex gap-2 items-center justify-end mt-4'>
        <Button
          variant='outlined'
          type='reset'
          color='primary'
          onClick={() => {
            closeDialog(id)
          }}
        >
          Cancel
        </Button>
        <Button variant='contained' type='submit'>
          Add Bank
        </Button>
      </Grid>
    </div>
  )
}

export default ManageDepositDialog

{
  /* <Grid item xs={12} className='flex items-center  justify-end gap-2'>
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
      </Grid> */
}
