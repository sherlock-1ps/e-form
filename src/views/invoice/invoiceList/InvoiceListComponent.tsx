// MUI Imports
'use client'

import CustomTextField from '@/@core/components/mui/TextField'
import { Button, Card, CardContent, Divider, Grid, IconButton, InputAdornment, MenuItem } from '@mui/material'
import type { TextFieldProps } from '@mui/material/TextField'
import { format, addDays } from 'date-fns'

import Typography from '@mui/material/Typography'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { forwardRef, useState } from 'react'
import InvoiceListTable from './InvoiceListTable'
import { useDictionary } from '@/contexts/DictionaryContext'

type CustomInputProps = TextFieldProps & {
  label: string
  end: Date | number
  start: Date | number
}

const InvoiceListComponent = () => {
  const [startDate, setStartDate] = useState<Date | null | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | null | undefined>(addDays(new Date(), 15))

  const handleOnChange = (dates: any) => {
    const [start, end] = dates

    setStartDate(start)
    setEndDate(end)
  }

  const CustomInput = forwardRef((props: CustomInputProps, ref) => {
    const { label, start, end, ...rest } = props

    const startDate = format(start, 'MM/dd/yyyy')
    const endDate = end !== null ? ` - ${format(end, 'MM/dd/yyyy')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return <CustomTextField fullWidth inputRef={ref} {...rest} label={label} value={value} />
  })
  const { dictionary } = useDictionary()

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <CardContent>
          <div className='flex flex-col gap-6'>
            <div className='flex gap-2 justify-between'>
              <Typography variant='h5' className=' text-nowrap'>
                {dictionary['invoice']?.titleInvoice}
              </Typography>
            </div>
            <Divider />
            <Grid container spacing={4}>
              <Grid item xs={12} sm>
                <AppReactDatepicker
                  selectsRange
                  endDate={endDate as Date}
                  selected={startDate}
                  startDate={startDate as Date}
                  id='date-range-picker-audit-log'
                  onChange={handleOnChange}
                  shouldCloseOnSelect={false}
                  customInput={
                    <CustomInput label={dictionary['dateRange']} start={startDate as Date | number} end={endDate as Date | number} />
                  }
                />
              </Grid>
              <Grid item xs={12} sm>
                <CustomTextField fullWidth label={dictionary['invoice']?.invoiceID} placeholder={dictionary['invoice']?.searchInvoiceID}></CustomTextField>
              </Grid>
              <Grid item xs={12} sm>
                <CustomTextField fullWidth label={dictionary['invoice']?.invoiceNumber} placeholder={dictionary['invoice']?.searchInvoiceNumber}></CustomTextField>
              </Grid>

              <Grid item xs={12} sm>
                <CustomTextField fullWidth label={dictionary['prefix']} placeholder={dictionary['searchPrefix']}></CustomTextField>
              </Grid>
            </Grid>
            <Grid container spacing={4} className='flex items-end justify-end'>
              <Grid item xs={12} sm={3}>
                <CustomTextField select fullWidth defaultValue={10} label={dictionary['status']}>
                  <MenuItem value=''>
                    <em>none</em>
                  </MenuItem>
                  <MenuItem value={10}>All</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomTextField select fullWidth defaultValue={10} label={dictionary['navigation']?.payment}>
                  <MenuItem value=''>
                    <em>none</em>
                  </MenuItem>
                  <MenuItem value={10}>All</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={3}>
                <Button variant='outlined' fullWidth>
                  {dictionary['clear']}
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button variant='contained' fullWidth>
                {dictionary['search']}
                </Button>
              </Grid>
            </Grid>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} className='flex items-center justify-between'>
              <Typography variant='h6'>{dictionary['searchDiscoverResultsInput']}</Typography>
              <Button variant='contained'>{dictionary['downloadSelectedAs']} PDF</Button>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <InvoiceListTable />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default InvoiceListComponent
