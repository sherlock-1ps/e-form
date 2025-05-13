import { Box, TextField } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

const CODE_LENGTH = 6

const CodeInput = ({ onComplete }: { onComplete: (code: string) => void }) => {
  const [values, setValues] = useState(Array(CODE_LENGTH).fill(''))
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const handleChange = (val: string, index: number) => {
    if (!/^\d?$/.test(val)) return // Only allow digits

    const newValues = [...values]
    newValues[index] = val
    setValues(newValues)

    if (val && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }

    const code = newValues.join('')
    if (code.length === CODE_LENGTH && !newValues.includes('')) {
      onComplete(code)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  return (
    <Box display='flex' justifyContent='center' gap={2}>
      {values.map((val, idx) => (
        <TextField
          key={idx}
          inputRef={el => (inputsRef.current[idx] = el)}
          value={val}
          onChange={e => handleChange(e.target.value, idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
          inputProps={{
            maxLength: 1,
            style: {
              textAlign: 'center',
              fontSize: '24px',
              width: '3rem',
              height: '3rem',
              padding: 0,
              fontFamily: 'monospace'
            }
          }}
          // type={val && idx !== values.findIndex(v => v === '') ? 'password' : 'text'} // Show only focused digit
          variant='outlined'
        />
      ))}
    </Box>
  )
}

export default CodeInput
