// React Imports
import type { ChangeEvent } from 'react'
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'

// Type Import
import type { CustomInputHorizontalData } from '@core/components/custom-inputs/types'

// Components Imports
import CustomInputHorizontal from '@core/components/custom-inputs/Horizontal'

const data: CustomInputHorizontalData[] = [
  {
    meta: 'normal',
    title: 'icon set 1',
    value: 'normal',
    isSelected: true,
    content: (
      <div className='flex gap-2'>
        <i className='tabler-moon-stars text-[30px]' />
        <i className='tabler-moon-stars text-[30px]' />
        <i className='tabler-moon-stars text-[30px]' />
        <i className='tabler-moon-stars text-[30px]' />
        <i className='tabler-moon-stars text-[30px]' />
        <i className='tabler-moon-stars text-[30px]' />
      </div>
    )
  },
  {
    meta: 'custom 1',
    title: 'icon set 2',
    value: 'custom1',
    content: (
      <div className='flex gap-2'>
        <i className='tabler-moon-stars text-[30px]' />
        <i className='tabler-moon-stars text-[30px]' />
        <i className='tabler-moon-stars text-[30px]' />
        <i className='tabler-moon-stars text-[30px]' />
        <i className='tabler-moon-stars text-[30px]' />
        <i className='tabler-moon-stars text-[30px]' />
      </div>
    )
  }
]

const CustomHorizontalRadio = () => {
  const initialSelected: string = data.filter(item => item.isSelected)[data.filter(item => item.isSelected).length - 1]
    .value

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
    <Grid container spacing={4}>
      {data.map((item, index) => (
        <CustomInputHorizontal
          type='radio'
          key={index}
          data={item}
          selected={selected}
          name='custom-radios-basic'
          handleChange={handleChange}
        />
      ))}
    </Grid>
  )
}

export default CustomHorizontalRadio
