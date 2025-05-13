'use client'
import { useState } from 'react'

import { Add } from '@mui/icons-material'

// Component Imports

// Util Imports
import type { SelectChangeEvent } from '@mui/material'
import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Typography } from '@mui/material'

const names = ['จัดซื้อ', 'จัดจ้าง']

const SpreadsheetNavbarContent = () => {
  const [personName, setPersonName] = useState<string[]>([])

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value }
    } = event

    setPersonName(typeof value === 'string' ? value.split(',') : value)
  }

  return (
    <>
      <div className='flex flex-col flex-1  '>
        <div className='flex gap-2 items-center'>
          <div className='flex flex-1 flex-col'>
            <Typography className='font-medium pl-1' color='text.primary'>
              Workflow
            </Typography>
            <FormControl sx={{ maxWidth: 195, width: '100%' }}>
              <Select
                labelId='demo-multiple-name-label'
                id='demo-multiple-name'
                value={personName}
                onChange={handleChange}
                sx={{ height: 32 }}
              >
                {names.map(name => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Button fullWidth variant='contained' className='capitalize' startIcon={<Add />}>
          เริ่มงานใหม่
        </Button>
      </div>
    </>
  )
}

export default SpreadsheetNavbarContent
