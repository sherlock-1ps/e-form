'use client'
import { useEffect, useRef } from 'react'
import Switch from '@mui/material/Switch'
import FormGroup from '@mui/material/FormGroup'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useFormStore } from '@/store/useFormStore'

const SwitchForm = ({ item }: any) => {
  const updateDetails = useFormStore(state => state.updateDetails)
  const selectedField = useFormStore(state => state.selectedField)

  return (
    <div style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}>
      <FormControlLabel
        disabled={!item?.config?.details?.isUse}
        control={
          <Switch
            checked={item?.config?.details?.value === '1'}
            onChange={e => {
              updateDetails(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                {
                  value: e.target.checked ? '1' : '0'
                }
              )
            }}
          />
        }
        label={item?.config?.details?.text}
      />
    </div>
  )
}

export default SwitchForm
