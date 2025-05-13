'use client'
import { useDispatch } from 'react-redux'
import { useRef, useState } from 'react'

// MUI Imports

// Third-party Imports
import { addDays, subDays, setHours, setMinutes } from 'date-fns'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const DatetimePickerForm = props => {
  const { config, id } = props
  const dispatch = useDispatch()

  const [timeExclude, setTimeExclude] = useState(setHours(setMinutes(new Date(), 0), 18))

  console.log('config', config)

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    ></div>
  )
}

export default DatetimePickerForm
