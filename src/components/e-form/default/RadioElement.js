'use client'
import { useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'

const RadioElement = props => {
  const { config, id } = props

  const dispatch = useDispatch()

  const handleSelectRadio = selected => {
    dispatch()
    // setValueElement({
    //   id,
    //   key: 'value',
    //   value: selected
    // })
  }

  return (
    <FormControl className='flex-wrap flex-row'>
      <RadioGroup
        row={config?.details?.row}
        value={config?.details?.value}
        name='radio_form'
        aria-label='radio_form'
        onChange={e => handleSelectRadio(e.target.value)}
      >
        {config?.details?.itemList.map((item, idx) => {
          return <FormControlLabel key={idx} value={item.value} control={<Radio />} label={item.name} />
        })}
      </RadioGroup>
    </FormControl>
  )
}

export default RadioElement
