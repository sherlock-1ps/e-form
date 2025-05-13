'use client'
import { useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'
import Switch from '@mui/material/Switch'
import FormGroup from '@mui/material/FormGroup'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'

const SwitchElement = props => {
  const { config, id } = props

  const dispatch = useDispatch()

  const handleSwitch = event => {
    dispatch()
    // setValueElement({
    //   id,
    //   key: 'value',
    //   value: event.target.checked
    // })
  }

  return (
    <FormControl className='flex-wrap flex-row'>
      <FormGroup row>
        <FormControlLabel
          control={<Switch checked={config?.details?.value} onChange={handleSwitch} />}
          label={config?.details?.placeholder}
        />
      </FormGroup>
    </FormControl>
  )
}

export default SwitchElement
