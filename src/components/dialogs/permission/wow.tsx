import React, { useState } from 'react'

import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const initialSwitchData = [
  { id: 1, label: 'Switch 1', isActive: true },
  { id: 2, label: 'Switch 2', isActive: false },
  { id: 3, label: 'Switch 3', isActive: true }
]

export default function MultipleSwitches() {
  const [switchData, setSwitchData] = useState(initialSwitchData)

  const handleChange = (index: number) => (event: any) => {
    const newSwitchData = [...switchData]
    const result = newSwitchData.map((item, i) => (i === index ? { ...item, isActive: event.target.checked } : item))

    setSwitchData(result)
  }

  console.log('switchData', switchData[0])
  console.log('initialSwitchData', initialSwitchData[0])

  // Check if any switch state differs from its initial isActive value in initialSwitchData
  const hasChanged = switchData.some((item, index) => item.isActive !== initialSwitchData[index].isActive)

  return (
    <div>
      {switchData.map((item, index) => (
        <div key={item.id}>
          <FormControlLabel
            control={<Switch checked={item.isActive} onChange={handleChange(index)} />}
            label={item.label}
          />
          <Typography variant='body2'>
            {item.label} is {item.isActive ? 'ON' : 'OFF'}
          </Typography>
        </div>
      ))}

      {/* Show "Close" button if any switch's state has changed */}
      {hasChanged && (
        <Button variant='contained' color='secondary'>
          Close
        </Button>
      )}
    </div>
  )
}
